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
  "assets/images/hardware/solar-side.webp",
  "assets/images/hardware/solar-top.webp",
  "assets/images/hardware/solar-angle.webp",
  "assets/images/hardware/rectifier-back.webp",
  "assets/images/hardware/rectifier-bridge.webp",
  "assets/images/hardware/rectifier-multimeter.webp",
  "assets/images/hardware/rectifier-pcb.webp",
  "assets/images/hardware/rectifier-whole.webp",
  "assets/images/hardware/rectifier-with-capacitor.webp",
  "assets/images/hardware/rectifier-without-capacitor.webp",
  "assets/images/hardware/robotic-front.webp",
  "assets/images/hardware/robotic-side.webp",
  "assets/images/hardware/robotic-top.webp",
  "assets/images/favicon.ico",
  "assets/media/voice-agent-bilingual-demo.wav",
  "assets/media/satellites-comparison.mp4",
  "assets/media/satellites-comparison-poster.webp",
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
const hardwareProjects = [
  "Solar-Powered Induction Cooktop",
  "Full-Wave Bridge Rectifier",
  "Raspberry Pi Robotic Car",
];
const atAGlanceLabels = ["Graduate", "Minor", "Building", "Exploring", "Interested in"];
const approvedFlipOffLead = "A forked implementation to make a more realistic and interactive browser-based split-flap display.";
const approvedHomeContact = "the best ways to reach me are by email or LinkedIn.";

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

for (const project of hardwareProjects) {
  if (!htmlByPage.get("about.html")?.includes(project)) {
    fail(`About page is missing approved early hardware project: ${project}`);
  }
  if (htmlByPage.get("work.html")?.includes(project)) {
    fail(`Early hardware project must not appear on Work: ${project}`);
  }
}

const hardwareCarouselCount = (htmlByPage.get("about.html")?.match(/data-carousel(?:\s|=|>)/g) || []).length;
if (hardwareCarouselCount !== 3) {
  fail(`About page must contain exactly three hardware carousels; found ${hardwareCarouselCount}`);
} else {
  pass("early hardware placement and carousel count checked");
}

if (!htmlByPage.get("about.html")?.includes('class="about-at-glance"')) {
  fail("About page is missing the approved At a glance panel");
} else if (atAGlanceLabels.some((label) => !htmlByPage.get("about.html").includes(`<dt>${label}</dt>`))) {
  fail("About At a glance panel is missing an approved label");
} else {
  pass("About At a glance panel checked");
}

if (!htmlByPage.get("work.html")?.includes(approvedFlipOffLead)) {
  fail("FlipOff lead does not use the approved fork-first wording");
}
if (!htmlByPage.get("index.html")?.includes(approvedHomeContact)) {
  fail("Home contact copy must identify both email and LinkedIn");
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

const urlAttributePattern = /(?:href|src|poster)="([^"]+)"/gi;
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
const homeHtml = htmlByPage.get("index.html") || "";
const section = (id, nextId) => {
  const end = nextId ? `(?=<article\\s+class="case-study[^>]*"\\s+id="${nextId}")` : "(?=</div>\\s*<section\\s+class=\"contact-band\")";
  return workHtml.match(new RegExp(`<article\\s+class="case-study[^>]*"\\s+id="${id}"[\\s\\S]*?${end}`, "i"))?.[0] || "";
};
const counsel = section("counsel", "demola-ar");
const demola = section("demola-ar", "expense-api");
const satellites = section("satellites");
if (!counsel || !demola) fail("Could not locate Counsel and Demola project sections");
if (!satellites) fail("Could not locate the Satellites project section");
if (/github\.com|gitlab|private repository/i.test(counsel)) fail("Counsel exposes a repository or private implementation detail");
if (/github\.com|gitlab|private repository/i.test(demola)) fail("Demola exposes a repository or private implementation detail");
if (/github\.com|gitlab/i.test(satellites)) fail("Satellites exposes a public repository link");
if (!/Tampere University-provided starter code/i.test(satellites)) fail("Satellites starter-code attribution is missing");
if (!/Retell AI/i.test(workHtml) || !/Sarvam AI/i.test(workHtml)) fail("Voice Agent provider attribution is incomplete");
if (!/voice-agent-bilingual-demo\.wav/i.test(workHtml)) fail("Voice Agent consented audio demo is missing");
if (!/Enhanced open-source fork/i.test(workHtml) || !/original FlipOff project/i.test(workHtml)) fail("FlipOff fork attribution is incomplete");

const expectedWorkIds = ["voice-agent", "counsel", "demola-ar", "expense-api", "flipoff", "satellites"];
const actualWorkIds = [...workHtml.matchAll(/<article\s+class="case-study[^"]*"\s+id="([^"]+)"/gi)].map((match) => match[1]);
if (actualWorkIds.join("|") !== expectedWorkIds.join("|")) {
  fail(`Work projects must match the six approved entries in order; found: ${actualWorkIds.join(", ")}`);
}

const homeProjectCount = (homeHtml.match(/<a\s+class="project-card"\s+href="work\.html#/gi) || []).length;
if (homeProjectCount !== 4) fail(`Home must contain exactly four selected-work cards; found ${homeProjectCount}`);
if (!/>View all projects\s*</i.test(homeHtml)) fail('Home selected-work action must say "View all projects"');
if (/Selected work\s*·\s*2025—2026/i.test(workHtml)) fail("Work eyebrow contains the stale date range");

const homeSatellitesVideo = homeHtml.match(/<video\b[^>]*data-satellites-preview[^>]*>/i)?.[0] || "";
if (homeSatellitesVideo && (!/muted/i.test(homeSatellitesVideo) || !/loop/i.test(homeSatellitesVideo) || /\sautoplay(?:\s|=|>)/i.test(homeSatellitesVideo))) {
  fail("Home Satellites preview must be muted and looping without HTML autoplay");
}
if (!/<video\b[^>]*controls[^>]*poster="assets\/media\/satellites-comparison-poster\.webp"/i.test(satellites)) {
  fail("Work Satellites demo must expose controls and its poster");
}
if (!/satellites-comparison\.mp4/i.test(satellites)) {
  fail("Satellites comparison video is not referenced from Work");
}

const sharedScript = exists("assets/patch-portfolio/site.js") ? read("assets/patch-portfolio/site.js") : "";
if (!/prefers-reduced-motion/i.test(sharedScript) || !/IntersectionObserver/i.test(sharedScript)) {
  fail("Shared script is missing reduced-motion or viewport-aware Satellites playback");
}
pass("six-project placement, privacy, media behavior, provider evidence, and attribution rules checked");

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
