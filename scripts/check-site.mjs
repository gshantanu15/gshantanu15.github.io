import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const corePages = ["index.html", "work.html", "about.html"];
const redirectPages = ["projects.html", "about-me.html", "contact-me.html"];
const publicPages = [...corePages, ...redirectPages, "404.html"];
const requiredFiles = [
  ...publicPages,
  ".github/workflows/check-site.yml",
  "assets/css/site.css",
  "assets/js/site.js",
  "assets/images/profile.png",
  "assets/images/profile.webp",
  "assets/images/flipoff.png",
  "assets/images/favicon.ico",
  "assets/media/voice-agent-bilingual-demo.wav",
  "robots.txt",
  "sitemap.xml",
];

const failures = [];
const pass = (message) => console.log(`PASS  ${message}`);
const fail = (message) => failures.push(message);
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

for (const file of requiredFiles) {
  if (!exists(file)) fail(`Missing required file: ${file}`);
}
if (failures.length === 0) pass("required production files exist");

const htmlByPage = new Map(
  publicPages.filter(exists).map((page) => [page, read(page)]),
);

const thesisUrl = "https://trepo.tuni.fi/handle/10024/237688";

for (const page of corePages) {
  const html = htmlByPage.get(page);
  if (!html) continue;

  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  if (h1Count !== 1) fail(`${page} must contain exactly one h1; found ${h1Count}`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${page} is missing a title`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) fail(`${page} is missing a description`);
  if (!/<link\s+rel="canonical"\s+href="https:\/\/gshantanu15\.github\.io\/[^"]*"/i.test(html)) fail(`${page} is missing its canonical URL`);
  if (!/<meta\s+property="og:title"\s+content="[^"]+"/i.test(html)) fail(`${page} is missing Open Graph title metadata`);
  if (!/<meta\s+property="og:description"\s+content="[^"]+"/i.test(html)) fail(`${page} is missing Open Graph description metadata`);
}

if (!htmlByPage.get("about.html")?.includes(thesisUrl)) {
  fail("About page must link to the public Trepo thesis record");
} else {
  pass("public thesis link checked");
}
pass("core page titles, descriptions, canonical URLs, headings, and Open Graph metadata checked");

for (const page of redirectPages) {
  const html = htmlByPage.get(page);
  if (!html) continue;
  if (!/<meta\s+http-equiv="refresh"/i.test(html)) fail(`${page} is missing its redirect`);
  if (!/<meta\s+name="robots"\s+content="noindex"/i.test(html)) fail(`${page} must be noindex`);
  if (!/<link\s+rel="canonical"/i.test(html)) fail(`${page} is missing a canonical destination`);
}
pass("legacy redirect metadata checked");

const urlAttributePattern = /(?:href|src)="([^"]+)"/gi;
for (const [page, html] of htmlByPage) {
  for (const match of html.matchAll(urlAttributePattern)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|data:)/i.test(reference)) continue;

    const [rawPath, fragment] = reference.split("#", 2);
    const targetPage = rawPath || page;
    const decodedPath = decodeURIComponent(targetPage.split("?", 1)[0]);
    const resolved = path.normalize(path.join(path.dirname(page), decodedPath));

    if (!exists(resolved)) {
      fail(`${page} references missing local target: ${reference}`);
      continue;
    }

    if (fragment && path.extname(resolved).toLowerCase() === ".html") {
      const targetHtml = read(resolved);
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`id=["']${escaped}["']`, "i").test(targetHtml)) {
        fail(`${page} references missing fragment #${fragment} in ${resolved}`);
      }
    }
  }
}
pass("local links, fragments, media, scripts, and styles checked");

for (const [page, html] of htmlByPage) {
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt="[^"]*"/i.test(image[0])) fail(`${page} contains an image without alt text`);
  }

  for (const anchor of html.matchAll(/<a\b[^>]*href="https?:\/\/[^>]+>/gi)) {
    if (/target="_blank"/i.test(anchor[0]) && !/rel="[^"]*noopener[^"]*noreferrer[^"]*"/i.test(anchor[0])) {
      fail(`${page} contains an unsafe external new-tab link: ${anchor[0]}`);
    }
  }
}
pass("image alternatives and external-link safety checked");

const productionHtml = [...htmlByPage.values()].join("\n");
const forbiddenTerms = [
  "NBA Analysis",
  "Finland Live",
  "Beopardy",
  "2D-to-3D",
  "Personal Knowledge Assistant",
  "Student Finance Tracker",
  "research traineeship",
  "MGIRED",
];
for (const term of forbiddenTerms) {
  if (productionHtml.toLowerCase().includes(term.toLowerCase())) fail(`Forbidden content appears in production HTML: ${term}`);
}
if (/href="tel:/i.test(productionHtml)) fail("A telephone link appears in production HTML");
if (/\+(?:91|358)[\s\d()-]{7,}/i.test(productionHtml)) fail("A public phone number appears in production HTML");
if (/99456[\s-]*41927|452300046/i.test(productionHtml)) fail("A legacy phone number appears in production HTML");
if (/Shantanu_Garg_Resume\.pdf|>\s*Résumé\s*</i.test(productionHtml)) fail("A launch-version résumé link appears in production HTML");
if (/bootstrap|jquery/i.test(productionHtml)) fail("Legacy Bootstrap or jQuery remains in production HTML");
pass("content exclusions, privacy rules, and zero-framework constraint checked");

const workHtml = htmlByPage.get("work.html") || "";
const section = (id, nextId) => {
  const end = nextId ? `(?=<article\\s+class="case-study[^>]*"\\s+id="${nextId}")` : "(?=</div>\\s*<section\\s+class=\"contact-band\")";
  return workHtml.match(new RegExp(`<article\\s+class="case-study[^>]*"\\s+id="${id}"[\\s\\S]*?${end}`, "i"))?.[0] || "";
};
const counsel = section("counsel", "demola-ar");
const demola = section("demola-ar", "expense-api");
if (!counsel || !demola) fail("Could not locate Counsel and Demola project sections");
if (/github\.com|gitlab|private repository/i.test(counsel)) fail("Counsel exposes a repository or private implementation detail");
if (/github\.com|gitlab|private repository/i.test(demola)) fail("Demola exposes a repository or private implementation detail");
if (!/Retell AI/i.test(workHtml) || !/Sarvam AI/i.test(workHtml)) fail("Voice Agent provider attribution is incomplete");
if (!/voice-agent-bilingual-demo\.wav/i.test(workHtml)) fail("Voice Agent consented audio demo is missing");
if (!/Enhanced open-source fork/i.test(workHtml) || !/original FlipOff project/i.test(workHtml)) fail("FlipOff fork attribution is incomplete");
pass("project-specific privacy, provider, evidence, and attribution rules checked");

const sitemap = exists("sitemap.xml") ? read("sitemap.xml") : "";
for (const url of [
  "https://gshantanu15.github.io/",
  "https://gshantanu15.github.io/work.html",
  "https://gshantanu15.github.io/about.html",
]) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`Sitemap is missing ${url}`);
}
if (!read("robots.txt").includes("https://gshantanu15.github.io/sitemap.xml")) fail("robots.txt does not advertise the sitemap");
pass("sitemap and robots discovery checked");

if (failures.length > 0) {
  console.error("\nSite validation failed:\n");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("\nAll static portfolio checks passed.");
