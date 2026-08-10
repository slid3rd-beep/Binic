/* Assemble index.html + styles.css + data.js + config.js + app.js
   en une seule page autonome : page-unique.html.
   Utile pour publier l'app sans serveur (envoi du fichier, hébergement simple).

   Usage :  node build-page-unique.js
*/

const fs = require("fs");

const read = (f) => fs.readFileSync(f, "utf8");

const html = read("index.html");

// On garde uniquement le contenu du <body>, sans les balises <script src>.
const body = html
  .slice(html.indexOf("<body>") + 6, html.indexOf("</body>"))
  .replace(/<script src="[^"]+"><\/script>\s*/g, "")
  .trim();

const page = `<title>Nos journées en Bretagne</title>
<style>
${read("styles.css")}
</style>

${body}

<script>
${read("config.js")}
${read("data.js")}
${read("app.js")}
</script>
`;

fs.writeFileSync("page-unique.html", page);
console.log(`page-unique.html écrit — ${(page.length / 1024).toFixed(1)} Ko`);
