/* Rasterise icone.svg en PNG pour l'écran d'accueil iOS et Android.
   iOS ignore les icônes SVG du manifeste : il lui faut un apple-touch-icon PNG.

   Usage :  node build-icones.js        (nécessite playwright, installé à la demande)
*/

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const TAILLES = [
  { fichier: "apple-touch-icon.png", taille: 180 },
  { fichier: "icon-192.png", taille: 192 },
  { fichier: "icon-512.png", taille: 512 },
];

(async () => {
  const svg = fs.readFileSync(path.join(__dirname, "icone.svg"), "utf8");
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
  );

  for (const { fichier, taille } of TAILLES) {
    const page = await browser.newPage({ viewport: { width: taille, height: taille } });
    await page.setContent(
      `<body style="margin:0">${svg.replace(/width="512" height="512"/, `width="${taille}" height="${taille}"`)}</body>`
    );
    await page.screenshot({ path: path.join(__dirname, fichier), omitBackground: false });
    await page.close();
    console.log(`${fichier} — ${taille}×${taille}`);
  }

  await browser.close();
})();
