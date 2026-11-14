/* The Sanpou warehouse's fascia sign, in Japanese.
   It read "Sanpou 物流センター": the company's own building carried its name in roman letters only,
   while the truck beside it and the scene 04 card both carry 三豊運輸. The sign now reads
   「三豊運輸　物流センター」, the company name on the left of the rule and the facility on the right,
   both in the Japanese face. 26 px so four kanji clear the 40-unit band top and bottom (ascent ~22.9,
   so the glyphs sit between y -176.5 and -202.5 inside the band at -169..-209), and 110 units wide
   with the 1.5 letter spacing, which leaves 27 units of air before the rule at x 171.
   Characters checked against CONTEXT.md and the live site: 三豊運輸, never 三豊運送 or 株式会社. */

//== REPLACE from "    text.push(h(\"text\", { x: 34, y: -179.6," to "    /* ---- a strip of high windows"
    text.push(h("text", { x: 34, y: -179.6, fontFamily: FONTS.jp, fontSize: 26, fontWeight: 800, fill: COLORS.paper, letterSpacing: 1.5 }, CONTENT.brand.nameJp));
    text.push(h("text", { x: 191, y: -182.6, fontFamily: FONTS.jp, fontSize: 17, fontWeight: 700, fill: D.whSignSub, letterSpacing: 1.5 }, CONTENT.brand.signSub));

