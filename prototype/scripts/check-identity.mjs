import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

assert(process.env.HALLMARK_PUPPETEER, 'Set HALLMARK_PUPPETEER to the existing Puppeteer tooling folder');
const require = createRequire(path.join(process.env.HALLMARK_PUPPETEER, 'noop.js'));
const puppeteer = require('puppeteer-core');
const base = process.env.BASE_URL || 'http://127.0.0.1:8001/prototype/';
const review = path.resolve(import.meta.dirname, '../review');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
const reports = [];
const visit = async (mode = 'normal') => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const remote = [];
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (new URL(request.url()).origin === new URL(base).origin || /^(data:|about:)/.test(request.url())) request.continue();
    else { remote.push(request.url()); request.abort(); }
  });
  if (mode === 'no-js') await page.setJavaScriptEnabled(false);
  if (mode === 'reduce') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument(mode => {
    window.portraitChanges = [];
    new MutationObserver(records => {
      for (const record of records) if (record.attributeName === 'data-rendered') window.portraitChanges.push({ rendered: record.target.hasAttribute('data-rendered'), time: performance.now() });
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-rendered'] });
    if (mode === 'canvas-missing') HTMLCanvasElement.prototype.getContext = () => null;
    if (mode === 'canvas-error') HTMLCanvasElement.prototype.getContext = () => { throw new Error('Canvas unavailable'); };
    if (mode === 'decode-error') HTMLImageElement.prototype.decode = () => Promise.reject(new Error('Decode unavailable'));
    if (mode === 'save-data') Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
    if (mode === 'change-motion') {
      window.queuedFrames = new Map();
      let nextFrame = 0;
      window.requestAnimationFrame = callback => { window.queuedFrames.set(++nextFrame, callback); return nextFrame; };
      window.cancelAnimationFrame = id => window.queuedFrames.delete(id);
    }
  }, mode);
  await page.goto(base.replace(/\/$/, '') + '/index.html', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(remote, [], `${mode}: no third-party requests`);
  return page;
};
const staticPortrait = async (page, mode) => {
  assert(await page.$eval('[data-glyph-portrait] img', image => image.complete && image.naturalWidth === 780 && image.naturalHeight === 777 && getComputedStyle(image).opacity === '1'), `${mode}: complete static portrait visible`);
  assert(await page.$eval('[data-glyph-portrait] canvas', canvas => canvas.hidden && canvas.getAttribute('aria-hidden') === 'true'), `${mode}: inactive canvas hidden from screen readers`);
  assert.equal(await page.$$eval('#command-help a', links => links.filter(link => link.getBoundingClientRect().height >= 44).length), 6, `${mode}: six accessible command rows`);
};
try {
  const page = await visit();
  await page.waitForFunction(() => window.portraitChanges.length === 2 && !document.querySelector('[data-glyph-portrait]').hasAttribute('data-rendered'));
  const changes = await page.evaluate(() => window.portraitChanges);
  assert.equal(changes[0].rendered, true); assert.equal(changes[1].rendered, false);
  assert(changes[1].time - changes[0].time >= 160 && changes[1].time - changes[0].time < 500, 'bounded one-time reveal');
  await staticPortrait(page, 'normal');
  for (const width of [320, 390, 640, 768, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert(await page.evaluate(() => {
      if (document.documentElement.scrollWidth > innerWidth) return false;
      return [...document.querySelectorAll('.identity-session, .portrait-visual, .command-row')].every(element => {
        const box = element.getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth && box.height > 0;
      });
    }), `${width}px: portrait, session and reference fit`);
    if (width === 1280) assert(await page.$eval('.identity-actions .action', element => { const box = element.getBoundingClientRect(); return box.top >= 0 && box.bottom < 800; }), 'primary action fits 1280×800 fold');
    if ([390, 1440].includes(width)) {
      await page.screenshot({ path: path.join(review, `index-${width}.png`) });
      await page.screenshot({ path: path.join(review, `index-${width}-full.png`), fullPage: true });
      await (await page.$('.identity-session')).screenshot({ path: path.join(review, `identity-session-${width}.png`) });
      await (await page.$('.command-reference')).screenshot({ path: path.join(review, `command-reference-${width}.png`) });
    }
  }
  assert.equal(await page.evaluate(() => window.portraitChanges.length), 2, 'resizing never restarts motion');
  await page.$eval('input[name="command"]', input => { input.value = 'help'; });
  await page.$eval('[data-command-form]', form => form.requestSubmit());
  assert.equal(await page.evaluate(() => document.activeElement.id), 'command-help', 'help moves keyboard focus to permanent command reference');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '#overview', 'next Tab enters command links');
  reports.push('One-time reveal, seven responsive widths including 640px reflow, no resize replay, command help focus: passed');
  await page.close();
  for (const mode of ['reduce', 'no-js', 'canvas-missing', 'canvas-error', 'decode-error', 'save-data']) {
    const fallback = await visit(mode);
    await staticPortrait(fallback, mode);
    if (mode !== 'no-js') assert.equal(await fallback.evaluate(() => window.portraitChanges.length), 0, `${mode}: animation never starts`);
    if (mode === 'reduce') await fallback.screenshot({ path: path.join(review, 'identity-reduced-motion-1440.png') });
    if (mode === 'no-js') await fallback.screenshot({ path: path.join(review, 'identity-no-js-1440.png') });
    reports.push(`${mode}: static portrait and command links passed without third-party requests`);
    await fallback.close();
  }
  const changing = await visit('change-motion');
  await changing.waitForSelector('[data-glyph-portrait][data-rendered]');
  await changing.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await changing.waitForFunction(() => !document.querySelector('[data-glyph-portrait]').hasAttribute('data-rendered'), { polling: 50 });
  await staticPortrait(changing, 'motion preference changed');
  assert.equal(await changing.evaluate(() => window.queuedFrames.size), 0, 'changed preference cancels pending frame');
  await changing.close();
  reports.push('Reduced motion switched on mid-reveal: pending frame canceled and static portrait restored');
  fs.writeFileSync(path.join(review, 'identity-checks.json'), JSON.stringify({ result: 'pass', reports }, null, 2) + '\n');
  console.log(reports.join('\n'));
} finally { await browser.close(); }
