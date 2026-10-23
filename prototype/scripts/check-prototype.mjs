
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const toolRoot = process.env.HALLMARK_PUPPETEER;
assert(toolRoot, 'Set HALLMARK_PUPPETEER to the folder containing puppeteer-core');
const require = createRequire(path.join(toolRoot, 'noop.js'));
const puppeteer = require('puppeteer-core');
const root = path.resolve(import.meta.dirname, '../..');
const site = path.join(root, 'prototype');
const review = path.join(site, 'review');
fs.mkdirSync(review, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
const reports = [];
const pages = ['index', 'work', 'about'];
const commands = ['overview', 'education', 'projects', 'experience', 'tascien', 'contact'];
const workIds = ['voice-agent', 'counsel', 'demola-ar', 'expense-api', 'flipoff', 'satellites'];
const baseUrl = process.env.BASE_URL;
const load = async (page, name) => {
  await page.goto(baseUrl ? `${baseUrl.replace(/\/$/, '')}/${name}` : pathToFileURL(path.join(root, 'prototype', name)).href, { waitUntil: 'load' });
  await page.evaluate(async () => { if (document.fonts) { await document.fonts.ready; if (document.fonts.check && !document.fonts.check('16px "Martian Mono"')) throw new Error('Martian Mono font is unavailable'); } await Promise.all([...document.images].map(async (image) => { image.loading = 'eager'; await image.decode().catch(() => {}); })); });
};
const checkRefs = async (page, name) => {
  const refs = await page.$$eval('[href],[src],[poster]', (els) => els.flatMap((e) => ['href', 'src', 'poster'].filter((a) => e.hasAttribute(a)).map((a) => e.getAttribute(a))));
  for (const ref of refs) {
    if (!ref || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    const [file, fragment] = ref.split('#');
    const resolved = path.resolve(site, file || `${name}.html`);
    assert(resolved.startsWith(`${root}${path.sep}`), `${name}: unsafe local reference ${ref}`);
    assert(fs.existsSync(resolved), `${name}: missing local target ${ref}`);
    if (fragment && resolved.endsWith('.html')) {
      const probe = await browser.newPage(); await probe.goto(pathToFileURL(resolved).href, { waitUntil: 'load' });
      assert(await probe.$(`#${fragment.replace(/[^a-zA-Z0-9_-]/g, '\\$&')}`), `${name}: missing fragment ${ref}`); await probe.close();
    }
  }
};
const contract = async (page, name) => {
  assert.equal(await page.$$eval('h1', (e) => e.length), 1, `${name}: one h1`);
  for (const selector of ['header', 'main', 'footer', '.skip-link', 'aside#directory', '.menu-toggle[aria-controls="directory"][aria-expanded]']) assert(await page.$(selector), `${name}: missing ${selector}`);
  assert.equal(await page.$$eval('.page-navigation[aria-label="Pages"] [aria-current="page"]', (e) => e.length), 1, `${name}: current page`);
  if (name === 'index') for (const selector of ['[data-command-form]', '[data-command-form] input[name="command"]', '#command-message', '#command-help']) assert(await page.$(selector), `${name}: missing ${selector}`);
  assert.equal(await page.$$eval('img:not([alt])', (e) => e.length), 0, `${name}: image alt`);
  assert.equal(await page.$$eval('a[target="_blank"]', (e) => e.filter((a) => !a.relList.contains('noopener') || !a.relList.contains('noreferrer')).length), 0, `${name}: unsafe new-tab link`);
  await checkRefs(page, name);
};
const checkLegacyCopy = async (page, name) => {
  if (!['work', 'about'].includes(name)) return;
  const original = await browser.newPage();
  await original.goto(pathToFileURL(path.join(root, `${name}.html`)).href, { waitUntil: 'load' });
  const copy = await original.$$eval(name === 'work' ? 'article p,article li,article dt,article dd,article figcaption' : 'p,li,dt,dd,figcaption', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()).filter((s) => s.split(/\s+/).length >= 12 && !/Vuforia|Unity|C# backend|positive response/i.test(s)));
  const updated = await page.$eval('body', (e) => e.textContent.replace(/\s+/g, ' '));
  for (const paragraph of copy) assert(updated.includes(paragraph), `${name}: substantive legacy copy missing: ${paragraph.slice(0, 90)}`);
  await original.close();
};
const layout = async (page, name, width) => {
  await page.setViewport({ width, height: width < 500 ? 844 : 900 });
  const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src), outside: [...document.querySelectorAll('main h1,main h2,main h3,main p,main li,main a,main img')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).length, wrappedNav: [...document.querySelectorAll('.page-navigation a,#directory nav a')].filter((e) => { if (!e.getClientRects().length || getComputedStyle(e).visibility === 'hidden' || getComputedStyle(e).display === 'none') return false; const range = document.createRange(); range.selectNodeContents(e); return range.getClientRects().length > 1; }).map((e) => e.textContent.trim()) }));
  assert(!result.overflow, `${name} ${width}: horizontal overflow`); assert.deepEqual(result.broken, [], `${name} ${width}: broken image`); assert.equal(result.outside, 0, `${name} ${width}: clipped content`); assert.deepEqual(result.wrappedNav, [], `${name} ${width}: navigation text wraps`);
  if ([390, 1440].includes(width)) { await page.screenshot({ path: path.join(review, `${name}-${width}.png`) }); await page.screenshot({ path: path.join(review, `${name}-${width}-full.png`), fullPage: true }); }
  reports.push(`${name} ${width}px: layout and media passed`);
};
const interaction = async (page, name) => {
  await page.setViewport({ width: 390, height: 844 });
  await page.click('.menu-toggle'); assert.equal(await page.$eval('.menu-toggle', (e) => e.getAttribute('aria-expanded')), 'true', `${name}: menu opens`);
  await page.keyboard.press('Escape'); assert.equal(await page.$eval('.menu-toggle', (e) => e.getAttribute('aria-expanded')), 'false', `${name}: menu Escape`); assert(await page.evaluate(() => document.activeElement.matches('.menu-toggle')), `${name}: menu focus restore`);
  if (name !== 'index') return;
  assert.equal(await page.$eval('[data-command-form]', (f) => f.hidden), false, 'home: command form shown by JavaScript');
  for (const [command, target] of Object.entries({ whoami: 'overview', education: 'education', projects: 'projects', experience: 'experience', tascien: 'tascien', contact: 'contact' })) {
    await page.$eval('input[name="command"]', (i, value) => { i.value = value; }, command); await page.$eval('[data-command-form]', (f) => f.requestSubmit());
    assert.equal(await page.evaluate(() => document.activeElement.id), target, `home: ${command} focuses target`);
  }
  await page.$eval('input[name="command"]', (i) => { i.value = 'help'; }); await page.$eval('[data-command-form]', (f) => f.requestSubmit()); assert.equal(await page.$eval('#command-help', (e) => e.hidden), false, 'home: help reveals commands'); assert((await page.$$eval('#command-help a', (e) => e.length)) >= 6, 'home: command help links');
  await page.$eval('input[name="command"]', (i) => { i.value = 'bogus <script>'; }); await page.$eval('[data-command-form]', (f) => f.requestSubmit()); assert.equal(await page.$eval('input[name="command"]', (i) => i.getAttribute('aria-invalid')), 'true', 'home: invalid aria'); assert.equal(await page.$$eval('#command-message script', (e) => e.length), 0, 'home: unknown command is text');
};

try {
  for (const name of pages) {
    const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 900 }); await load(page, `${name}.html`); await contract(page, name); await checkLegacyCopy(page, name);
    for (const width of [320, 390, 768, 1440]) await layout(page, name, width);
    await interaction(page, name); await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); assert.equal(await page.$$eval('video[autoplay],audio[autoplay]', (e) => e.length), 0, `${name}: autoplay media`); assert.equal(await page.$$eval('*', (els) => els.filter((e) => parseFloat(getComputedStyle(e).transitionDuration) > 0.01 || parseFloat(getComputedStyle(e).animationDuration) > 0.01).length), 0, `${name}: reduced motion disables transitions`); assert(await page.$eval('body', (e) => getComputedStyle(e).backgroundImage === 'none'), `${name}: gradient background`);
    if (name === 'index') { for (const id of commands) assert(await page.$(`#${id}`), `home: missing #${id}`); const body = await page.$eval('body', (e) => `${e.textContent} ${[...e.querySelectorAll('a[href]')].map((a) => a.href).join(' ')}`); for (const fact of ['Shantanu Garg', 'Tampere University', '2026', 'Computer Science', 'Machine Learning and Signal Processing', 'Voice Agent Lab', 'Counsel', 'AI-assisted Object Recognition in AR', 'Smart Expense Tracker API', 'FlipOff', 'Satellites', 'LinkedIn', 'GitHub', 'Chairperson', 'Treasurer', 'Comparative Analysis of Multi-Agent Frameworks for Requirements Engineering', 'https://trepo.tuni.fi/handle/10024/237688']) assert(body.includes(fact), `home: missing approved fact ${fact}`); }
    if (name === 'work') { assert.deepEqual(await page.$$eval('article[id]', (e) => e.map((x) => x.id)), workIds, 'work: six ordered projects'); assert.equal(await page.$$eval('article details', (e) => e.length), 6, 'work: native details'); assert(await page.$eval('#demola-ar', (e) => /Tripo3D API|manual end-to-end testing|team/i.test(e.textContent)), 'work: Demola approved scope'); }
    if (name === 'about') { assert.equal(await page.$$eval('[data-carousel]', (e) => e.length), 3, 'about: three carousels'); await page.$$eval('.archive-details', (details) => details.forEach((detail) => { detail.open = true; })); for (const c of await page.$$('[data-carousel]')) { for (const s of ['[data-slide]', '[data-carousel-prev]', '[data-carousel-next]', '[data-carousel-current]']) assert(await c.$(s), `about: carousel ${s}`); const before = await c.$eval('[data-carousel-current]', (e) => e.textContent); await c.$eval('[data-carousel-next]', (e) => e.click()); assert.notEqual(await c.$eval('[data-carousel-current]', (e) => e.textContent), before, 'about: carousel advances'); } }
    await page.setJavaScriptEnabled(false); await load(page, `${name}.html`); assert(await page.$eval('#directory', (e) => getComputedStyle(e).display !== 'none'), `${name}: no-JS directory`); await page.keyboard.press('Tab'); assert(await page.evaluate(() => document.activeElement.matches('.skip-link')), `${name}: skip link first`); await page.close(); reports.push(`${name}: contract, behavior, accessibility, no-JS, and content checks passed`);
  }
  fs.writeFileSync(path.join(review, 'checks.json'), JSON.stringify({ result: 'pass', reports }, null, 2)); console.log(reports.join('\n'));
} finally { await browser.close(); }
