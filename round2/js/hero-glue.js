
(function(){
  var JP=window.JourneyPort, S=JP&&JP._scenes;
  var fit=document.getElementById('sjxFit'), stage=document.getElementById('sjxStage'), host=document.getElementById('sanpou-journey');
  if(!JP||!S||!fit||!stage||!host) return;
  var FPS=30;
  // Layer slots (r12 functional-002). Each stage element holds three persistent layer slots, in paint order:
  // w (world: 01, 02 and the departure in 03), t (transit: 03) and n (network: 04, 05). A frame is described as
  // {w|t|n: {s: the layer's style, c: its content}} and each slot is patched on its own (JP.mount), so a scene
  // keeps its nodes when the master timeline wraps it in a layer (02->03), when the transit scene slides in and
  // the world slides out (03), and when 03's entrance hands over to its idle; before, each of these rebuilt about
  // 1100 nodes in one frame. A slot that is not shown is emptied: the world and network scenes carry SVG ids
  // (clip paths, gradients), and a second, hidden copy of a scene would take over its url(#id) references.
  // BASE is the master timeline's own layer style (layer() in the port).
  var BASE='position:absolute;left:0px;top:0px;width:1920px;height:1080px;', HIDE='display:none', PRE=BASE+'opacity:0;', FAM=['w','t','n'];
  // two stage elements: the live one (id sjxStage) and a hidden spare. A dissolve swaps them: the live stage
  // stays where it is as the outgoing frame and fades out above the spare, which becomes the live stage (the
  // outgoing frame's nodes are not moved). The spare also takes the first frame of 04, built ahead (see
  // "pre-building" below).
  var spare=stage.cloneNode(false); spare.removeAttribute('id'); spare.style.visibility='hidden'; fit.appendChild(spare);
  function slotted(el){ el.style.position='absolute'; el.style.left='0'; el.style.top='0'; el.__slot={};
    FAM.forEach(function(f){ var s=document.createElement('div'); s.setAttribute('style',HIDE); s.__s=HIDE; s.__pre=false; el.appendChild(s); el.__slot[f]=s; });
    el.addEventListener('transitionend',function(e){ if(e.target===el&&e.propertyName==='opacity') endFade(el); });
    return el; }
  slotted(stage); slotted(spare);
  function one(f,v){ var d={}; d[f]={s:BASE,c:v}; return d; }
  // 03's entrance comes from the master timeline as one or two layers; a single layer is the world before
  // JP.SCENES[2] (the end of the slide) and the transit scene from there on
  function master(m){ var p=JP.renderMaster(m), d={};
    if(p.length>1){ d.w={s:p[0].a.style,c:p[0].c}; d.t={s:p[1].a.style,c:p[1].c}; }
    else if(p.length){ d[m<JP.SCENES[2]?'w':'t']={s:p[0].a.style,c:p[0].c}; }
    return d; }
  function setStyle(sl,s){ if(sl.__s!==s){ sl.setAttribute('style',s); sl.__s=s; } }
  function clear(sl){ setStyle(sl,HIDE); if(sl.firstChild) sl.textContent=''; }
  // a slot being pre-built (__pre) keeps the style the pre-build gives it until a frame shows it
  function show(st,d){ FAM.forEach(function(f){ var sl=st.__slot[f], e=d[f];
    if(e){ if(sl.__pre){ sl.__pre=false; if(job&&job.sl===sl) job=null; } setStyle(sl,e.s); JP.mount(sl,e.c); }
    else if(!sl.__pre) clear(sl); }); }
  // 5 stops. enter(f) renders the entrance MOTION (the real animation that carries you
  // into the scene); idle(t) renders the end-of-scene idle (choreography held, ambient
  // running). 'sec' idles advance ambient time in seconds (held-frame scenes); others
  // advance a frame clock (continuous driving / city trucks).
  // Seams (POLISH_SPEC §8.2): ambOff carries 01's idle ambient time into 02's entrance, so the
  // clouds do not jump back at 01->02; it is blended out over 02's entrance (f 185->391), so the
  // entrance ends at ambient time 391/30, which is what 02's held idle and 03's renderMaster(391)
  // show, so 02->03 does not jump either.
  var ambOff=0;
  // 03 -> 04 (round 7): the camera rises off the road to the map. The expressway, still running on its own clock
  // (outT, the transit frame it was on when the move began), goes down out of the frame in the t slot while the
  // map comes down into it in the n slot: JP.seam34(f) gives the two slots' places at frame f of 04's entrance.
  // outT is null when 04 is entered any other way (a jump, a dissolve): then 04 simply enters.
  var outT=null;
  function enter04(f){ var r=(outT!=null&&JP.seam34)?JP.seam34(f):null;
    if(!r) return one('n',S.network(f));
    return { t:{s:BASE+r.t,c:S.transit(outT+f/ENTER_RATE)}, n:{s:BASE+r.n,c:S.network(f)} }; }
  // the move can start from 03's hold, or from 03's entrance once the expressway is the only picture
  function canRise(i){ return i===3 && idx===2 && !!JP.seam34 && (mode==='idle' || clk>=JP.SCENES[2]); }
  var STOPS=[
    { enter:function(f){return one('w',S.world(f));}, eFrom:0, eTo:185, idle:function(t){return one('w',S.world(185,t));}, iStart:185/30, sec:true },                 // 01 入荷
    { enter:function(f){return one('w',S.world(f, f/30 + ambOff*(391-f)/206));}, eFrom:185, eTo:391, idle:function(t){return one('w',S.world(391,t));}, iStart:391/30, sec:true }, // 02 積込 (camera pan + load; the choreography holds, ambient runs on)
    { enter:master, eFrom:391, eTo:475, idle:function(c){return one('t',S.transit(c));}, iStart:55, sec:false },                                                     // 03 輸送 (depart + slide + convoy)
    { enter:enter04, eFrom:0, eTo:80, idle:function(t){return one('n',S.network(80,t));}, iStart:80/30, sec:true, cross:true },     // 04 ネットワーク (map)
    { enter:function(f){return one('n',S.network(f));}, eFrom:80, eTo:174, idle:function(c){return one('n',S.network(c));}, iStart:174, sec:false }                  // 05 結び (commitment)
  ];
  var items=Array.prototype.slice.call(document.querySelectorAll('#sjxIndex button'));
  var pauseBtn=document.getElementById('sjxPause');
  var idx=0, mode='enter', clk=0, idleClk=0, playing=true, raf=null, prevTs=0, visible=false, covered=false;
  // frame pacing (§8.4): heavy = render on a 30fps grid. Entered by a slow rAF average (fEMA) or by
  // the measured render cost (rCost), left after a long run of fast frames.
  var rCost=8, heavyR=false, heavyF=false, heavy=false, fEMA=1000/60, slowN=0, fastN=0;
  var autoOn=true, dwellMs=0, AUTO_DWELL=[7000,7600,7200,6000,18000], ENTER_RATE=1.2, nextR=0, metaT=null;
  // Input first (r12 functional-001): for a moment after a tap, a key, a wheel turn or a scroll the loop draws
  // nothing and its clocks stand still, so the browser can answer the input at once on a slow phone; the motion
  // then goes on from where it stopped (no jump).
  var holdUntil=0;
  (function(){ var hold=function(){ holdUntil=performance.now()+160; }, o={capture:true,passive:true};
    ['pointerdown','touchstart','keydown','wheel'].forEach(function(t){ document.addEventListener(t,hold,o); });
    window.addEventListener('scroll',function(){ holdUntil=Math.max(holdUntil,performance.now()+120); },{passive:true}); })();
  // Pre-building (r12 functional-002): the first frame of what the next seam shows is built ahead into a slot at
  // opacity 0 (laid out, not painted), in idle time and in chunks of about PRE_N nodes, one chunk per frame (each
  // chunk mounts a longer depth-first prefix of the target tree, so the patcher only appends), so the frame that
  // shows it mostly paints: transit(0) into the live stage before 03's slide (whose first layer style is this
  // same opacity 0), network(0) into the spare stage before the 03->04 dissolve. Whatever is not done by then is
  // simply created by the normal frame. preDone: the stop whose pre-build has been started.
  var PRE_N=200, PRE_LEAD=2000, job=null, preDone=-1;
  function count(l){ var n=0; for(var i=0;i<l.length;i++){ n++; if(typeof l[i]!=='string') n+=count(l[i].c); } return n; }
  function prefix(l,n){ var out=[], used=0;
    for(var i=0;i<l.length&&used<n;i++){ var v=l[i]; used++;
      if(typeof v==='string'){ out.push(v); continue; }
      var r=prefix(v.c,n-used); out.push({t:v.t,a:v.a,c:r.c}); used+=r.n; }
    return {c:out,n:used}; }
  // one step per frame: the style and layout of a chunk happen in the frame after it
  function schedPre(){ requestAnimationFrame(function(){ if(window.requestIdleCallback) requestIdleCallback(stepPre,{timeout:500}); else setTimeout(stepPre,0); }); }
  // make() returns the target frame; it runs in the first idle step, on its own (the first call of a scene
  // function compiles it: about 60ms for the network scene on a 4x slower CPU)
  function startPre(sl,make){ sl.__pre=true; setStyle(sl,PRE);
    // a slot that still holds an earlier frame of this scene is brought up to date in one patch
    job={sl:sl, make:make, l:null, n:sl.firstChild?Infinity:0, total:0, built:false}; schedPre(); }
  function stepPre(){ var j=job; if(!j) return;
    if(performance.now()<holdUntil){ schedPre(); return; }
    if(!j.l){ j.l=[j.make()]; j.total=count(j.l); schedPre(); return; }
    j.n+=PRE_N; j.built=j.n>=j.total;
    JP.mount(j.sl, j.built?j.l:prefix(j.l,j.n).c);
    if(j.built) job=null; else schedPre(); }
  // a scene change the visitor asked for drops what was being built
  function dropPre(){ job=null; [stage,spare].forEach(function(st){ FAM.forEach(function(f){ var sl=st.__slot[f];
    if(sl.__pre){ sl.__pre=false; clear(sl); } }); }); }
  function scheduleAuto(){ dwellMs=0; preDone=-1; }
  // Art-directed camera. Desktop keeps the static per-scene recentre
  // (FOCUS_X); as the visible window narrows (phones/tablets) each scene
  // blends toward its own keyframed framing — a slow pan/punch-in across
  // the scene's action over the dwell, exponentially smoothed so stop
  // changes glide. z multiplies the cover scale, and x/y are clamped, so
  // the stage always covers the box: no borders, no squashed ratio.
  var FOCUS_X=[780,960,960,960,1250];
  var CAM_M=[
    {x0:840,y0:660,z0:1.10,x1:1030,y1:680,z1:1.18},
    {x0:960,y0:690,z0:1.12,x1:1180,y1:700,z1:1.16},
    {x0:700,y0:640,z0:1.10,x1:1280,y1:660,z1:1.14},
    {x0:1015,y0:560,z0:1.00,x1:1015,y1:550,z1:1.03},
    {x0:1300,y0:600,z0:1.02,x1:1240,y1:610,z1:1.04}];
  var RMOT=false; try{RMOT=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  var boxW=0,boxH=0,sc0=1,mobT=0,cam={x:FOCUS_X[0],y:540,z:1},camSnap=true,lastTf='',lastSc='';
  // Round 7: how the camera gets from one scene's framing to the next. It used to chase its target at a fixed
  // rate (2.6 a second): it set off at full speed the moment the scene changed and crept in. Now every scene
  // change is one move of CAM_MS, from where the camera is (camA) to the new scene's own path: it gathers
  // speed over the first 0.3 of the move and lands over the rest (camEase: the cube of the time, then the
  // fourth power of what is left). After the move it is exactly on the scene's path, which is unchanged.
  var CAM_MS=1800, camA=null, camT=CAM_MS;
  function camEase(u){ var a=0.3, k=1/(a*a*(0.75+0.25*a)); if(u<=0) return 0; if(u>=1) return 1;
    return u<a ? k*u*u*u : 1-(3*k*a*a/(4*Math.pow(1-a,3)))*Math.pow(1-u,4); }
  function camFrom(){ camA={x:cam.x,y:cam.y,z:cam.z}; camT=0; }
  function fitStage(){ var box=fit.parentElement; boxW=box.clientWidth||0; boxH=box.clientHeight||0; if(!boxW||!boxH) return;
    sc0=Math.max(boxW/1920, boxH/1080);
    mobT=Math.max(0,Math.min(1,(1500-boxW/sc0)/880));
    fit.style.width=boxW+'px'; fit.style.height=boxH+'px';
    if(idxEl){ idxW=idxEl.clientWidth; lastTruckTf=''; placeTruck(lastTi,lastTfrac); }
    camSnap=true; camTick(16); }
  function ease2(p){ return p<.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2; }
  function camTarget(){ var k=CAM_M[idx];
    var p=RMOT?0.5:ease2(Math.max(0,Math.min(1,dwellMs/AUTO_DWELL[idx])));
    var mx=k.x0+(k.x1-k.x0)*p, my=k.y0+(k.y1-k.y0)*p, mz=k.z0+(k.z1-k.z0)*p;
    return { x:FOCUS_X[idx]+(mx-FOCUS_X[idx])*mobT, y:540+(my-540)*mobT, z:1+(mz-1)*mobT }; }
  function camTick(dt){ if(!boxW) return; var t=camTarget();
    if(camSnap||RMOT||!camA) camT=CAM_MS; else camT=Math.min(CAM_MS,camT+Math.max(0,dt));
    camSnap=false;
    if(camT>=CAM_MS){ cam.x=t.x; cam.y=t.y; cam.z=t.z; }
    else { var k=camEase(camT/CAM_MS); cam.x=camA.x+(t.x-camA.x)*k; cam.y=camA.y+(t.y-camA.y)*k; cam.z=camA.z+(t.z-camA.z)*k; }
    var sc=sc0*cam.z;
    var tx=-Math.min(Math.max(cam.x*sc-boxW/2,0),1920*sc-boxW);
    var ty=-Math.min(Math.max(cam.y*sc-boxH/2,0),1080*sc-boxH);
    // write only on change: on desktop the camera is still, so most frames touch no style at all
    var tf='translate('+tx+'px, '+ty+'px) scale('+sc+')';
    if(String(sc)!==lastSc){ lastSc=String(sc); fit.setAttribute('data-scale',sc); }
    if(tf!==lastTf){ lastTf=tf; stage.style.transform=tf; } }
  // §8.5: the stage box is measured when it actually changes size, never by timers during load.
  // The observer's first callback runs after the first layout and before the first paint, so the
  // script does not force a layout while the page is still parsing.
  if(window.ResizeObserver){ new ResizeObserver(function(){ fitStage(); }).observe(fit.parentElement); }
  else { window.addEventListener('resize',fitStage); fitStage(); }
  function render(){ var st=STOPS[idx]; show(stage, (mode==='enter') ? st.enter(clk) : st.idle(idleClk)); }
  var fills=items.map(function(b){ return b.querySelector('.hc-fill'); });
  // the road truck: a small Sanpou truck rides the leading edge of the dashed line (decoration only)
  var idxEl=document.getElementById('sjxIndex'), truckEl=null, TRUCK_W=30, idxW=0, lastTruckTf='', lastTi=0, lastTfrac=0;
  if(idxEl){ truckEl=document.createElement('span'); truckEl.className='sjx-truck'; truckEl.setAttribute('aria-hidden','true');
    // Round 8 (2026-11-16): the little truck is the film's truck, drawn again for 30 x 16 px (it was the site's
    // original drawing until now, the one thing in the picture nobody had remade, because it lives here and not
    // in the scene code). The film's proportions: a tall white box in a navy outline with the vermilion stripe in
    // its lower third and white under it; a lower navy cab with its glass; a dark chassis; two wheels tucked under
    // the body, dark tyres with steel hubs. It is always seen on the dark band, riding the track: the box and the
    // glass hold it against the dark, the white row and the navy chassis keep its stripe apart from the vermilion
    // dashes under it, and the cab is the film's cab in the light so it does not sink into the band.
    // The box stays 30 x 16 (the site's CSS places it). Every edge is on a whole or half pixel, so it is crisp at 1x.
    // The viewer's clock player reads this drawing out of this file: keep it one assignment of quoted pieces.
    truckEl.innerHTML='<svg width="30" height="16" viewBox="0 0 30 16" fill="none" aria-hidden="true" focusable="false">'
      +'<circle cx="7.5" cy="13.2" r="2.6" fill="#0c1626"/><circle cx="7.5" cy="13.2" r="1.15" fill="#b9c5d6"/>'
      +'<circle cx="24.3" cy="13.2" r="2.6" fill="#0c1626"/><circle cx="24.3" cy="13.2" r="1.15" fill="#b9c5d6"/>'
      +'<path d="M2 10.4h26.5v1.9H2z" fill="#13263f"/>'
      +'<rect x="0.5" y="0.5" width="19.5" height="10" rx="1.2" fill="#fbfdff" stroke="#13263f"/>'
      +'<rect x="1.5" y="7" width="17.5" height="2" fill="#e16347"/>'
      +'<path d="M20.9 3.4h5.2l2.9 3.5v5.4h-8.1z" fill="#30466f"/>'
      +'<path d="M22.2 4.6h3.5l2 2.6h-5.5z" fill="#b7d3ee"/>'
      +'</svg>';
    idxEl.appendChild(truckEl); }
  // truck x = the fill edge of scene i at fraction frac (track width cached in fitStage; no layout read per frame)
  function placeTruck(i,frac){ lastTi=i; lastTfrac=frac; if(!truckEl||!idxW) return;
    var liW=(idxW-32)/5, x=i*(liW+8)+liW*Math.max(0,Math.min(1,frac));
    x=Math.max(0,Math.min(idxW-TRUCK_W,x));
    var tf='translateX('+x.toFixed(1)+'px)';
    if(tf!==lastTruckTf){ lastTruckTf=tf; truckEl.style.transform=tf; } }
  var META=[
    {no:'01',jp:'入荷',lead:'お預かりした荷物を、丁寧に検品します。'},
    {no:'02',jp:'積込',lead:'行き先ごとに仕分けて、車両に積み込みます。'},
    {no:'03',jp:'輸送',lead:'各拠点を出発し、それぞれの納品先へ向かいます。'},
    {no:'04',jp:'配送ネットワーク',lead:'配送エリアは、関東1都6県と新潟市方面です。'},
    {no:'05',jp:'地域とともに',lead:'創業以来、地域の物流を支えてきました。'}];
  var metaBox=document.getElementById('hcMeta'), noEl=document.getElementById('hcNo'), scEl=document.getElementById('hcScene'), ldEl=document.getElementById('hcLead');
  var metaShown=0, metaWant=0;
  // the scene index shown by the controls: the pending target while a click is being applied (§8.3)
  var navTok=0, navPending=false, navTarget=0;
  function cur(){ return navPending ? navTarget : idx; }
  // fills: earlier scenes full; the current one full whenever the hero is not playing (§8.1 #7)
  function paintFills(i){ fills.forEach(function(f,k){ if(!f) return;
    f.style.width = (k<i || (k===i && !playing)) ? '100%' : (k===i && i===idx && autoOn ? Math.min(100, dwellMs/AUTO_DWELL[i]*100)+'%' : '0%'); });
    placeTruck(i, !playing ? 1 : (i===idx && autoOn ? Math.min(1, dwellMs/AUTO_DWELL[i]) : 0)); }
  function mark(i){ if(i==null) i=idx;
    items.forEach(function(b,k){ b.setAttribute('aria-current',k===i?'true':'false'); });
    host.classList.toggle('on-map', i===3);
    host.classList.toggle('on-sign', i===1||i===2);
    if(!playing && i===idx){ camSnap=true; camTick(16); }
    paintFills(i);
    if(metaBox && i!==metaWant){ metaWant=i;
      var apply=function(){ var m=META[metaWant];
        if(noEl)noEl.textContent=m.no; if(scEl)scEl.textContent=m.jp; if(ldEl)ldEl.textContent=m.lead;
        metaShown=metaWant; metaBox.classList.remove('is-swapping'); };
      if(metaT){ clearTimeout(metaT); metaT=null; }
      if(RMOT){ apply(); }
      else if(metaWant===metaShown){ metaBox.classList.remove('is-swapping'); }
      else { metaBox.classList.add('is-swapping'); metaT=setTimeout(function(){ metaT=null; apply(); },300); } } }
  function kick(){ if(!raf&&visible&&playing&&!covered){ prevTs=0; nextR=0; raf=requestAnimationFrame(loop); } }
  function loop(ts){ raf=null; var dt0=prevTs?ts-prevTs:0; prevTs=ts; var dt=dt0>200?1000/FPS:dt0;
    var held=ts<holdUntil;
    if(dt0>0 && dt0<=200 && !held){ fEMA=fEMA*0.9+dt0*0.1;
      if(fEMA>22){ fastN=0; if(++slowN>=20) heavyF=true; }
      else if(fEMA<18){ slowN=0; if(++fastN>=60) heavyF=false; }
      else { slowN=0; fastN=0; } }
    if(playing && !held){ var st=STOPS[idx];
      if(mode==='enter'){ clk+=dt/1000*FPS*ENTER_RATE; if(clk>=st.eTo){ clk=st.eTo; mode='idle'; idleClk=st.iStart; } }
      else { idleClk += st.sec ? dt/1000 : dt/1000*FPS; }
    }
    var drew=false;
    if(ts>=nextR && !navPending && !held){ drew=true; var rT0=performance.now(); render(); var rc=performance.now()-rT0; rCost=rCost*0.88+rc*0.12;
      heavyR = heavyR ? rCost>9 : rCost>15; heavy = heavyF||heavyR; nextR=ts+(heavy?1000/30:1000/60)-2; }
    if(autoOn&&playing&&visible&&!navPending&&!held){ dwellMs+=dt;
      // the progress bar moves on the frames that draw the scene (30fps in heavy mode)
      var fl=fills[idx]; if(fl&&drew){ fl.style.width=Math.min(100, dwellMs/AUTO_DWELL[idx]*100)+'%'; placeTruck(idx, Math.min(1, dwellMs/AUTO_DWELL[idx])); }
      // pre-building for the next seam (02: transit before 03's slide; 03: network before the dissolve into 04)
      if(AUTO_DWELL[idx]-dwellMs<PRE_LEAD && preDone!==idx){ preDone=idx;
        if(idx===1) startPre(stage.__slot.t, function(){ return S.transit(0); });
        else if(idx===2 && JP.seam34) startPre(stage.__slot.n, function(){ return S.network(0); });   // the move shows it in this stage
        else if(idx===2 && !spare.__fading) startPre(spare.__slot.n, function(){ return S.network(0); }); }
      if(dwellMs>=AUTO_DWELL[idx]){
        if(idx<STOPS.length-1){ enterStop(idx+1, !!STOPS[idx+1].cross); }
        else { dwellMs=AUTO_DWELL[idx]; } // final scene holds and loops its ambient idle
      }
    }
    if(!held) camTick(dt);
    if(visible&&playing&&!covered&&!raf) raf=requestAnimationFrame(loop);
  }
  // §8.3: the dissolve. The live stage stays where it is as the outgoing frame (aria-hidden artwork) and fades
  // out above the spare, which becomes the live stage: a click does only this (the outgoing nodes are not moved),
  // and the incoming scene is mounted into the new live stage underneath while the old one fades; at the end the
  // outgoing stage is hidden and emptied.
  function endFade(el){ if(!el.__fading) return; el.__fading=false; clearTimeout(el.__fadeT);
    el.style.visibility='hidden'; el.style.transition=''; el.style.opacity=''; el.style.zIndex='';
    FAM.forEach(function(f){ var sl=el.__slot[f]; if(!sl.__pre) clear(sl); }); }
  // the scene family a stop shows (for its idle): the slot whose ids a dissolve into it may share with the outgoing frame
  function famOf(i){ return i<2?'w':(i===2?'t':'n'); }
  function crossfade(i){ var out=stage, inn=spare;
    // a dissolve that is still running on the spare ends at once: the new outgoing frame covers it
    inn.__fading=false; clearTimeout(inn.__fadeT);
    inn.style.transition=''; inn.style.opacity=''; inn.style.zIndex=''; inn.style.visibility=''; inn.style.transform=lastTf;
    // a dissolve between two views of the same scene (01/02 or 04/05) has its SVG ids twice for a moment: the
    // incoming stage goes first in the document, so its url(#id) references stay its own (it is empty or holds
    // only a pre-built slot, so the move is cheap)
    if(out.__slot[famOf(i)].firstChild && (out.compareDocumentPosition(inn) & 4)) fit.insertBefore(inn,out);
    out.removeAttribute('id'); inn.id='sjxStage'; stage=inn; spare=out;
    out.__fading=true; out.style.zIndex='1'; out.style.opacity='1'; out.style.transition='opacity .85s cubic-bezier(.2,.6,.2,1)';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ if(out.__fading) out.style.opacity='0'; }); });
    out.__fadeT=setTimeout(function(){ endFade(out); },1000);
  }
  function enterStop(i, useCross){
    // 01's idle ambient time carries on into 02's entrance (sequential advance only)
    ambOff = (i===1 && idx===0 && mode==='idle') ? Math.max(0, idleClk-STOPS[0].iStart) : 0;
    var rise=canRise(i); outT = rise ? (mode==='idle' ? idleClk : clk-420) : null;
    if(useCross && visible && !rise) crossfade(i); camFrom(); idx=i; mode='enter'; clk=STOPS[i].eFrom; scheduleAuto(); mark(); render(); kick(); }
  function jumpStop(i){ ambOff=0; outT=null; dropPre(); camFrom(); idx=i; mode='idle'; idleClk=STOPS[i].iStart; scheduleAuto(); mark(); render(); kick(); }
  function showStatic(i){ ambOff=0; outT=null; dropPre(); idx=i; mode='idle'; idleClk=STOPS[i].iStart; scheduleAuto(); mark(); render(); camSnap=true; camTick(0); }
  // which navigations dissolve: every one while paused, and while playing every one except a plain
  // step forward into a scene without its own cross (04 has one)
  function dissolves(i){ if(RMOT||!visible) return false; if(!playing) return true; return i===idx+1 ? (!!STOPS[i].cross && !canRise(i)) : true; }
  function go(i){ if(i===idx){ mark(); return; }
    if(RMOT||!playing){ showStatic(i); return; }
    if(i===idx+1) enterStop(i, false);   // sequential forward = play the motion
    else jumpStop(i);                    // backward / non-adjacent jump = dissolve to idle
  }
  // §8.3: the click paints its feedback at once (current mark, fills, scene line); the dissolve and the
  // mounting of the incoming scene run in a task after that paint, and the loop draws nothing while it is pending
  var navX=false;
  function nav(i){ i=Math.max(0,Math.min(STOPS.length-1,i)); if(i===cur()) return i;
    var tok=++navTok; navPending=true; navTarget=i; mark(i); navX=dissolves(i);
    requestAnimationFrame(function(){ setTimeout(function(){ if(tok!==navTok) return; navPending=false;
      if(navX && i!==idx) crossfade(i);
      go(i); },0); });
    return i; }
  var ICON_PAUSE='<svg class="i" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" aria-hidden="true" focusable="false"><path d="M9 6v12M15 6v12"/></svg>';
  var ICON_PLAY='<svg class="i" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M8.5 5.75v12.5L18.5 12Z"/></svg>';
  function setPlay(on){ playing=on; host.classList.toggle('is-static',!on);
    if(pauseBtn){ pauseBtn.setAttribute('aria-label',on?'一時停止':'再生'); pauseBtn.innerHTML=on?ICON_PAUSE:ICON_PLAY; }
    paintFills(cur());
    if(on)kick(); else if(raf){cancelAnimationFrame(raf);raf=null;} }
  if(pauseBtn) pauseBtn.addEventListener('click',function(){ setPlay(!playing); });
  items.forEach(function(b,i){ b.addEventListener('click',function(){ nav(i); }); });
  // §8.1 #8: arrows, Home and End move the scene and the focus together (scene index only, I1). The arrows step
  // from the focused scene button (as in the APG tabs pattern), or from the current scene if focus is elsewhere
  (document.getElementById('sjxIndex')||host).addEventListener('keydown',function(e){ var k=e.key, fi=items.indexOf(document.activeElement), c=fi>=0?fi:cur(), t;
    if(k==='ArrowRight') t=c+1; else if(k==='ArrowLeft') t=c-1; else if(k==='Home') t=0; else if(k==='End') t=STOPS.length-1; else return;
    e.preventDefault(); t=Math.max(0,Math.min(STOPS.length-1,t)); nav(t); if(items[t]) items[t].focus(); });
  if(RMOT){ autoOn=false; playing=false; host.classList.add('is-static'); if(pauseBtn) pauseBtn.style.display='none'; showStatic(4); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ visible=e.isIntersecting; if(visible)kick(); else if(raf){cancelAnimationFrame(raf);raf=null;prevTs=0;} }); },{threshold:0.04});
  io.observe(host);
  // the full-screen menu (the drawer script puts .drawer-open on <html>) covers the hero: stop drawing behind it,
  // as when the hero is scrolled away, and go on where it was when the menu closes
  var root=document.documentElement;
  new MutationObserver(function(){ var c=root.classList.contains('drawer-open'); if(c===covered) return; covered=c;
    if(c){ if(raf){cancelAnimationFrame(raf);raf=null;prevTs=0;} } else kick(); }).observe(root,{attributes:true,attributeFilter:['class']});
  mark();
  enterStop(0,false);
})();
