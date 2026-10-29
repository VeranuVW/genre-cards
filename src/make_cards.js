// Genereert genre-kaartjes als transparante PNG's.
// Gebruik: node make_cards.js   -> PNG's komen in ./output
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const F = (p) => 'data:font/woff2;base64,' + fs.readFileSync(path.resolve(__dirname, 'node_modules', p)).toString('base64');

// Lettertypes (gratis, via npm @fontsource)
const fontCss = `
@font-face{font-family:BarlowX;font-style:italic;font-weight:800;src:url(${F('@fontsource/barlow/files/barlow-latin-800-italic.woff2')})}
@font-face{font-family:BarlowC;font-style:italic;font-weight:700;src:url(${F('@fontsource/barlow-condensed/files/barlow-condensed-latin-700-italic.woff2')})}
@font-face{font-family:BarlowC;font-style:italic;font-weight:800;src:url(${F('@fontsource/barlow-condensed/files/barlow-condensed-latin-800-italic.woff2')})}
@font-face{font-family:Archivo;font-style:normal;font-weight:100 900;font-stretch:62% 125%;src:url(${F('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}) format('woff2-variations')}
@font-face{font-family:Lexend;font-weight:400;src:url(${F('@fontsource/lexend/files/lexend-latin-400-normal.woff2')})}
@font-face{font-family:Nunito;font-weight:900;src:url(${F('@fontsource/nunito/files/nunito-latin-900-normal.woff2')})}
@font-face{font-family:Archivo;font-style:italic;font-weight:100 900;font-stretch:62% 125%;src:url(${F('@fontsource-variable/archivo/files/archivo-latin-wdth-italic.woff2')}) format('woff2-variations')}
@font-face{font-family:BarlowCN;font-weight:500;src:url(${F('@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2')})}
@font-face{font-family:BarlowCN;font-weight:700;src:url(${F('@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2')})}
@font-face{font-family:Creepster;src:url(${F('@fontsource/creepster/files/creepster-latin-400-normal.woff2')})}
@font-face{font-family:Marker;src:url(${F('@fontsource/permanent-marker/files/permanent-marker-latin-400-normal.woff2')})}
@font-face{font-family:Belleza;src:url(${F('@fontsource/belleza/files/belleza-latin-400-normal.woff2')})}
`;

// Per genre: bestandsnaam + HTML voor de tekst (pas hier aan / voeg toe)
const cards = [
  { file: 'anime',    html: `<span style="font:italic 800 92px BarlowX;letter-spacing:-1px">ANIME</span>` },
  { file: 'action',   html: `<span style="font-family:Archivo;font-weight:800;font-stretch:125%;font-size:66px;letter-spacing:1px">ACTION</span>` },
  { file: 'sci-fi',   html: `<span style="font:italic 700 100px BarlowC">SCI-FI</span>` },
  { file: 'current-mood', html: `<div style="text-align:center;line-height:.82;font-family:Archivo;font-weight:900;font-stretch:110%">
        <div style="font-size:40px;letter-spacing:-1px">current</div>
        <div style="font-size:84px;letter-spacing:-2px">MOOD</div></div>` },
  { file: 'fantasy',  html: `<span style="font:400 60px Lexend;letter-spacing:7px">FANTASY</span>` },
  { file: 'thrillers',html: `<span style="font:italic 800 84px BarlowC;letter-spacing:1px">THRILLERS</span>` },
  { file: 'kids-family', html: `<div style="text-align:center;line-height:.85;font-family:Nunito;font-weight:900">
        <div style="font-size:78px">KIDS</div>
        <div style="font-size:34px;letter-spacing:1px">&amp; FAMILY</div></div>` },
  { file: 'halloween', html: `<span style="font:76px Creepster;letter-spacing:1px;transform:rotate(-3deg) scaleY(1.15);display:inline-block">HALLOWEEN</span>` },
  { file: 'animation', html: `<span style="font:500 70px BarlowCN;letter-spacing:7px">ANIMATION</span>` },
  { file: 'drama',     html: `<span style="font-family:Archivo;font-weight:800;font-stretch:100%;font-size:76px;letter-spacing:5px">DRAMA</span>` },
  { file: 'watch-your-favorite-books', html: `<div style="text-align:center;line-height:.9;font-family:Archivo;font-weight:800;font-stretch:125%">
        <div style="font-size:52px;letter-spacing:1px">WATCH YOUR</div>
        <div style="font-size:31px;letter-spacing:1px">FAVORITE BOOKS</div></div>` },
  { file: 'comedy',    html: `<span style="font:700 96px BarlowCN;letter-spacing:1px">COMEDY</span>` },
  { file: 'crime',     html: `<span style="font-family:Archivo;font-weight:900;font-stretch:125%;font-size:74px;letter-spacing:3px">CRIME</span>` },
  { file: 'romance',   html: `<span style="font:400 54px Lexend;letter-spacing:6px">ROMANCE</span>` },
  { file: 'love-ya-forever', html: `<div style="font:62px Marker;line-height:.85;transform:rotate(-8deg);text-align:center">
        <div style="margin-left:-60px">Love Ya</div><div style="margin-left:60px">Forever</div></div>` },
  { file: 'reality',   html: `<span style="font-family:Archivo;font-style:italic;font-weight:800;font-stretch:110%;font-size:84px;letter-spacing:5px">REALITY</span>` },
  { file: 'documentaries', html: `<span style="font:500 64px BarlowCN;letter-spacing:4px">DOCUMENTARIES</span>` },
  { file: 'astrology', html: `<span style="font:400 70px Belleza;letter-spacing:2px">ASTROLOGY</span>` },
  { file: 'wwe',       html: `<span style="font-family:Archivo;font-style:italic;font-weight:900;font-stretch:115%;font-size:110px;letter-spacing:2px">WWE</span>` },
  { file: 'stand-up-comedy', html: `<div style="text-align:center;line-height:.85;font-family:BarlowCN;font-weight:700">
        <div style="font-size:46px;letter-spacing:1px">STAND-UP</div>
        <div style="font-size:84px">COMEDY</div></div>` },
];

const W = 600, H = 340, PAD = 12; // kaartje 600x340, export op 2x = 1248x728 px

const page = (inner, focused, plain) => `<!doctype html><html><head><style>
${fontCss}
html,body{margin:0;background:transparent}
.wrap{padding:${PAD}px;display:inline-block}
.card{width:${W}px;height:${H}px;border-radius:40px;box-sizing:border-box;
  display:flex;align-items:center;justify-content:center;color:#fff;
  background:
    radial-gradient(120% 90% at 50% 15%, rgba(140,165,255,.55) 0%, rgba(140,165,255,0) 60%),
    linear-gradient(180deg,#5068c8 0%,#4256b0 100%);
  border:${focused ? '7px solid #fff' : '2px solid rgba(190,205,255,.45)'};
  box-shadow: inset 0 2px 0 rgba(255,255,255,.18), 0 10px 24px rgba(10,20,70,.35);
  text-shadow:0 2px 6px rgba(0,0,30,.25);
}
${plain ? '.card{background:none!important;box-shadow:none!important;border-color:' + (focused ? '#fff' : 'transparent') + '!important}' : ''}
</style></head><body><div class="wrap"><div class="card">${inner}</div></div></body></html>`;

(async () => {
  const out = path.join(__dirname, 'output');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const p = await browser.newPage({ deviceScaleFactor: 2 });
  // PLAIN=1 node make_cards.js  -> versie zonder blauwe achtergrond (map output/transparent)
  const plain = process.env.PLAIN === '1';
  const dir = plain ? path.join(out, 'transparent') : out;
  fs.mkdirSync(dir, { recursive: true });
  for (const c of cards) {
    for (const focused of [false, true]) {
      await p.setContent(page(c.html, focused, plain), { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready);
      const el = await p.$('.wrap');
      const name = `${c.file}${focused ? '-focused' : ''}.png`;
      await el.screenshot({ path: path.join(dir, name), omitBackground: true });
      console.log('✓', name);
    }
  }
  await browser.close();
})();
