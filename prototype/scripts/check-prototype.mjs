import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// Verification uses a temporary tool install; the website has no runtime dependencies.
const toolRoot = process.env.HALLMARK_PUPPETEER;
assert(toolRoot, 'Set HALLMARK_PUPPETEER to the folder containing puppeteer-core');
const require = createRequire(path.join(toolRoot, 'noop.js'));
const puppeteer = require('puppeteer-core');
const root = path.resolve(import.meta.dirname, '../..');
const output = path.join(root, 'prototype/review');
fs.mkdirSync(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const reports = [];
const normalize = (s) => s.replace(/[·/]/g, ' ').replace(/[↗→]/g, '').replace(/\s+/g, ' ').trim();
const sorted = (values) => values.map(normalize).sort();
const load = async (page, filename) => {
  await page.goto(pathToFileURL(path.join(root, filename)).href, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(async (image) => { image.loading = 'eager'; await image.decode().catch(() => {}); }));
  });
};
const record = (page) => page.evaluate(() => ({
  headings: [...document.querySelectorAll('h1,h2,h3')].map((e) => e.textContent),
  metadata: [document.title, ...[...document.querySelectorAll('meta[name="description"],meta[property^="og:"],link[rel="canonical"]')].map((e) => e.getAttribute('content') || e.getAttribute('href'))],
  copy: [...document.querySelectorAll('p,li,dt,dd,figcaption')]
    .filter((e) => !e.closest('[aria-hidden="true"]') && e.textContent.trim().split(/\s+/).length >= 8)
    .map((e) => e.textContent),
  links: [...document.querySelectorAll('a[href]')].map((e) => e.getAttribute('href')),
  media: [...document.querySelectorAll('img,source,video[poster]')].map((e) => e.getAttribute('src') || e.getAttribute('poster')),
}));

try {
  for (const name of ['index', 'work', 'about']) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await load(page, `${name}.html`);
    const original = await record(page);
    if (name !== 'about') await page.screenshot({ path: path.join(output, `${name}-before-1440.png`) });
    await load(page, `prototype/${name}.html`);
    const updated = await record(page);
    assert.deepEqual(updated.metadata, original.metadata, `${name}: metadata preserved`);
    assert.deepEqual(sorted(updated.headings), sorted(original.headings), `${name}: headings preserved`);
    assert.deepEqual(sorted(updated.copy), sorted(original.copy), `${name}: substantive text preserved`);
    assert.deepEqual(updated.media.map((s) => s.replace(/^\.\.\//, '')).sort(), original.media.sort(), `${name}: media preserved`);
    assert.deepEqual(updated.links.map((s) => s.replace(/^\.\.\//, '')).sort(), original.links.sort(), `${name}: destinations preserved`);
    const local = await page.evaluate(() => [...document.querySelectorAll('[href],[src],[poster]')].flatMap((e) =>
      ['href', 'src', 'poster'].filter((a) => e.hasAttribute(a)).map((a) => e.getAttribute(a))));
    for (const reference of local) {
      if (/^(https?:|mailto:|data:)/.test(reference)) continue;
      const [file, fragment] = reference.split('#');
      const resolved = path.resolve(root, 'prototype', file || `${name}.html`);
      assert(fs.existsSync(resolved), `${name}: missing local target ${reference}`);
      if (fragment && resolved.endsWith('.html')) {
        assert(fs.readFileSync(resolved, 'utf8').includes(`id="${fragment}"`), `${name}: missing fragment ${reference}`);
      }
    }
    assert.equal(await page.$$eval('h1', (elements) => elements.length), 1);
    assert.equal(await page.$$eval('.site-nav [aria-current="page"]', (elements) => elements.length), 1);
    assert.equal(await page.$$eval('img:not([alt])', (elements) => elements.length), 0);
    assert.equal(await page.$$eval('a[target="_blank"]:not([rel="noopener noreferrer"])', (elements) => elements.length), 0);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewport({ width, height: width < 500 ? 844 : 900 });
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        images: [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src),
        outside: [...document.querySelectorAll('main h1,main h2,main h3,main p,main a,main video,main audio')]
          .filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); })
          .map((e) => e.className || e.tagName),
      }));
      assert(!layout.overflow, `${name} ${width}: horizontal page overflow`);
      assert.deepEqual(layout.images, [], `${name} ${width}: image failed`);
      assert.deepEqual(layout.outside, [], `${name} ${width}: clipped content`);
      if ([390, 1440].includes(width)) {
        await page.screenshot({ path: path.join(output, `${name}-${width}.png`) });
        await page.screenshot({ path: path.join(output, `${name}-${width}-full.png`), fullPage: true });
      }
      reports.push(`${name} ${width}px: no overflow, clipped content, or broken images`);
    }
    await page.setViewport({ width: 390, height: 844 });
    await page.locator('.nav-toggle').click();
    assert.equal(await page.$eval('.nav-toggle', (e) => e.getAttribute('aria-expanded')), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('.nav-toggle', (e) => e.getAttribute('aria-expanded')), 'false');
    assert(await page.evaluate(() => document.activeElement.matches('.nav-toggle')), 'Escape restores menu focus');
    await page.locator('.nav-toggle').click();
    await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('.site-nav a[aria-current]')]);
    assert.equal(await page.$eval('.nav-toggle', (e) => e.getAttribute('aria-expanded')), 'false');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    assert(await page.$eval('.button', (e) => parseFloat(getComputedStyle(e).transitionDuration) <= .01).catch(() => true), 'Reduced motion disables transitions');
    assert.equal(await page.$$eval('video[autoplay]', (elements) => elements.length), 0);
    if (name === 'about') {
      for (const carousel of await page.$$('[data-carousel]')) {
        await carousel.$eval('[data-carousel-next]', (e) => e.click());
        assert.equal(await carousel.$eval('[data-carousel-current]', (e) => e.textContent), '2');
        await carousel.$eval('[data-carousel-prev]', (e) => e.click());
        assert.equal(await carousel.$eval('[data-carousel-current]', (e) => e.textContent), '1');
      }
    }
    await page.setJavaScriptEnabled(false);
    await load(page, `prototype/${name}.html`);
    assert.equal(await page.$$eval('main h1', (elements) => elements.length), 1);
    assert.equal(await page.$eval('.site-nav', (e) => getComputedStyle(e).display === 'none'), false);
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => document.activeElement.matches('.skip-link')), 'Skip link is first keyboard stop');
    await page.close();
    reports.push(`${name}: original details, headings, destinations, and media preserved; metadata, image alternatives, external-link safety, menu Escape, reduced motion, and no-JS access passed`);
  }
  fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ result: 'pass', reports }, null, 2));
  console.log(reports.join('\n'));
} finally {
  await browser.close();
}
