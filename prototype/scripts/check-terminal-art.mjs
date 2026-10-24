import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

assert(process.env.HALLMARK_PUPPETEER, 'Set HALLMARK_PUPPETEER to the existing Puppeteer tooling folder');
const require = createRequire(path.join(process.env.HALLMARK_PUPPETEER, 'noop.js'));
const puppeteer = require('puppeteer-core');
const base = process.env.BASE_URL || 'http://127.0.0.1:8001/prototype/';
const review = path.resolve(import.meta.dirname, '../review');
const asset = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../assets/banyan-glyph.json'), 'utf8'));
assert(Math.abs((asset.height / asset.rows) / (asset.width / asset.columns) - 1.85) < .01, 'Glyph cells retain the Terminal character proportions');
const reports = [];
assert.equal(asset.width, 1800, 'glyph source keeps native 1800px width');
assert.equal(asset.height, 1200, 'glyph source keeps native 1200px height');
assert.equal(asset.width / asset.height, 1.5, 'glyph source is native 3:2');
assert(asset.points.filter(point => point[3] >= 0).length > 500);
assert(new Set(asset.points.filter(point => point[3] >= 0).map(point => point[3])).size > 100, 'growth follows individual root paths');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
const visit = async (mode = 'normal') => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: mode === 'retina' ? 2 : 1 });
  const remote = [];
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (mode === 'asset-error' && request.url().endsWith('banyan-glyph.json')) { request.abort(); return; }
    if (new URL(request.url()).origin === new URL(base).origin || /^(data:|about:)/.test(request.url())) request.continue();
    else { remote.push(request.url()); request.abort(); }
  });
  if (mode === 'no-js') await page.setJavaScriptEnabled(false);
  if (mode === 'reduce') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument(mode => {
    window.treePaints = 0;
    const fillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (...args) { window.treePaints++; return fillText.apply(this, args); };
    if (mode === 'canvas-missing') HTMLCanvasElement.prototype.getContext = () => null;
    if (mode === 'canvas-error') HTMLCanvasElement.prototype.getContext = () => { throw new Error('Canvas unavailable'); };
    if (mode === 'save-data') Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
  }, mode);
  await page.goto(base.replace(/\/$/, '') + '/index.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(remote, [], `${mode}: no third-party requests`);
  return page;
};
const fallback = async (page, mode) => {
  assert(await page.$eval('[data-banyan] img', image => image.complete && image.naturalWidth === 1800 && image.naturalHeight === 1200 && getComputedStyle(image).opacity === '1'), `${mode}: complete static tree keeps native 3:2 source`);
  assert(await page.$eval('[data-banyan] canvas', canvas => canvas.hidden), `${mode}: canvas hidden`);
  assert(await page.$eval('[data-banyan]', tree => tree.getAttribute('aria-hidden') === 'true' && !tree.hasAttribute('data-preparing') && getComputedStyle(tree).pointerEvents === 'none' && !tree.querySelector('a,button,[tabindex]')), `${mode}: decoration never captures focus or pointers or remains blank while preparing`);
};
try {
  const page = await visit();
  assert.equal(await page.$('.identity-session,.command-reference,[data-glyph-portrait]'), null, 'session panel, reference rows and portrait removed');
  await page.waitForSelector('[data-banyan][data-growing]');
  assert(await page.evaluate(() => {
    const art = document.querySelector('[data-banyan]');
    const image = art.querySelector('img');
    const canvas = art.querySelector('canvas');
    const imageStyle = getComputedStyle(image);
    const canvasStyle = getComputedStyle(canvas);
    const imageBox = image.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    const same = (a, b) => Math.abs(a - b) <= 1;
    return image.naturalWidth === 1800 && image.naturalHeight === 1200 &&
      Math.abs(image.naturalWidth / image.naturalHeight - 1.5) < 0.001 &&
      Math.abs(canvas.width / canvas.height - 1.5) < 0.001 &&
      [imageStyle.objectFit, canvasStyle.objectFit].every(value => value === 'contain' || value === 'cover') &&
      [imageStyle.objectFit, canvasStyle.objectFit].every(value => value !== 'fill') &&
      same(imageBox.left, canvasBox.left) && same(imageBox.top, canvasBox.top) &&
      same(imageBox.width, canvasBox.width) && same(imageBox.height, canvasBox.height);
  }), 'image and canvas preserve native 3:2 geometry with consistent positioning; object-fit never stretches');
  const counts = [];
  for (const [name, fraction] of [['top', 0], ['middle', .5], ['bottom', 1]]) {
    await page.evaluate(fraction => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * fraction), fraction);
    if (fraction) await page.waitForFunction(previous => window.treePaints > previous, {}, counts.at(-1));
    if (fraction === 1) await page.waitForFunction(total => window.treePaints === total, {}, asset.points.length);
    counts.push(await page.evaluate(() => window.treePaints));
    await page.screenshot({ path: path.join(review, `banyan-${name}-1600.png`) });
    await (await page.$('[data-banyan]')).screenshot({ path: path.join(review, `banyan-art-${name}.png`) });
  }
  assert(counts[0] < counts[1] && counts[1] < counts[2], 'roots develop progressively');
  assert.equal(counts[2], asset.points.length, 'all roots complete at page bottom');
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  assert.equal(await page.evaluate(() => window.treePaints), counts[2], 'upward scrolling never erases or replays roots');
  let minimumContrast = Infinity;
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1600, 1920]) {
    await page.setViewport({ width, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    assert(await page.evaluate(() => {
      const art = document.querySelector('[data-banyan]');
      const box = art.getBoundingClientRect(), style = getComputedStyle(art);
      const link = document.querySelector('.identity-actions a'), target = link.getBoundingClientRect();
      const hit = document.elementFromPoint(target.left + target.width / 2, target.top + target.height / 2);
      const image = art.querySelector('img');
      const canvas = art.querySelector('canvas');
      const imageStyle = getComputedStyle(image), canvasStyle = getComputedStyle(canvas);
      return document.documentElement.scrollWidth <= innerWidth && box.left === 0 && box.top === 0 && Math.abs(box.width - innerWidth) <= 1 && Math.abs(box.height - innerHeight) <= 1 && style.position === 'fixed' && Number(style.opacity) <= .1 && Number(getComputedStyle(document.querySelector('.terminal-layout')).zIndex) > Number(style.zIndex) && (!hit || hit.closest('a') === link) && image.naturalWidth === 1800 && image.naturalHeight === 1200 && Math.abs(canvas.width / canvas.height - 1.5) < .001 && imageStyle.objectFit !== 'fill' && canvasStyle.objectFit !== 'fill';
    }), `${width}px: full-page background stays beneath content without capturing controls or adding overflow`);
    const contrast = await page.evaluate(() => {
      const context = document.createElement('canvas').getContext('2d');
      const rgb = color => { context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1); return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3); };
      const luminance = color => color.map(channel => { const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      const paper = rgb(getComputedStyle(document.body).backgroundColor);
      const brightest = rgb(getComputedStyle(document.documentElement).getPropertyValue('--glyph-7'));
      const opacity = Number(getComputedStyle(document.querySelector('[data-banyan]')).opacity);
      const background = luminance(paper.map((channel, index) => channel * (1 - opacity) + brightest[index] * opacity));
      return Math.min(...['body', '.identity-lead', '.identity-output dt', '.command-hint', '.directory-end'].map(selector => (luminance(rgb(getComputedStyle(document.querySelector(selector)).color)) + .05) / (background + .05)));
    });
    minimumContrast = Math.min(minimumContrast, contrast);
    assert(contrast >= 4.5, `${width}px: text contrast over the brightest possible tree glyph (${contrast.toFixed(2)}:1)`);
    if ([390, 768, 1024, 1440].includes(width)) {
      await page.screenshot({ path: path.join(review, `index-${width}.png`) });
      await page.screenshot({ path: path.join(review, `index-${width}-full.png`), fullPage: true });
    }
  }
  await page.setViewport({ width: 844, height: 390 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: path.join(review, 'index-844x390-landscape.png') });
  const retina = await visit('retina');
  await retina.waitForSelector('[data-banyan][data-growing]');
  assert(await retina.evaluate(() => {
    const art = document.querySelector('[data-banyan]');
    const image = art.querySelector('img');
    const canvas = art.querySelector('canvas');
    const imageStyle = getComputedStyle(image), canvasStyle = getComputedStyle(canvas);
    return window.devicePixelRatio === 2 && canvas.width === 3600 && canvas.height === 2400 &&
      Math.abs(canvas.width / canvas.height - 1.5) < 0.001 &&
      imageStyle.objectFit === canvasStyle.objectFit && imageStyle.objectPosition === canvasStyle.objectPosition &&
      imageStyle.paddingTop === canvasStyle.paddingTop;
  }), 'DPR2: fresh navigation creates a 3600x2400 3:2 canvas with matching image fit, position and masthead padding');
  await retina.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await retina.screenshot({ path: path.join(review, 'index-1440-dpr2.png') });
  await retina.close();
  assert.equal(await page.evaluate(() => window.treePaints), counts[2], 'resize does not repaint grown roots');
  const caret = await page.$eval('h1', heading => { const style = getComputedStyle(heading, '::after'); return { duration: parseFloat(style.animationDuration), iterations: Number(style.animationIterationCount) }; });
  assert(caret.duration > 0 && caret.duration * caret.iterations <= 5, 'caret stops within five seconds');
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()));
  assert.equal(await page.$eval('h1', heading => getComputedStyle(heading, '::after').opacity), '1', 'caret holds its final state');
  reports.push(`Curved root growth: ${counts.join(' < ')} glyphs at top, midpoint and bottom; no erase/replay on upward scroll or resize`);
  reports.push('320–1920px: tree fills the viewport behind the page at every width, lower opacity on tablet/mobile, no pointer interception or overflow');
  reports.push(`Lowest text contrast over the brightest possible background glyph: ${minimumContrast.toFixed(2)}:1`);
  reports.push('Native 3:2 image and canvas retain matched contain/cover crops and padding; glyph-cell aspect remains approximately 1.85');
  reports.push('Caret blinks five times in 4.5 seconds, then holds');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.waitForFunction(() => !document.querySelector('[data-banyan]').hasAttribute('data-growing'));
  await fallback(page, 'changed motion preference');
  assert.equal(await page.$eval('h1', heading => getComputedStyle(heading, '::after').animationName), 'none', 'reduced motion stops cursor');
  await page.close();
  for (const mode of ['reduce', 'no-js', 'canvas-missing', 'canvas-error', 'asset-error', 'save-data']) {
    const current = await visit(mode);
    await fallback(current, mode);
    if (mode === 'reduce') await current.screenshot({ path: path.join(review, 'banyan-reduced-motion-1600.png') });
    if (mode === 'no-js') await current.screenshot({ path: path.join(review, 'banyan-no-js-1600.png') });
    reports.push(`${mode}: static tree retained without third-party requests`);
    await current.close();
  }
  const mobile = await visit();
  await mobile.setViewport({ width: 390, height: 844 });
  await mobile.waitForSelector('[data-banyan][data-growing]');
  const before = await mobile.evaluate(() => window.treePaints);
  await mobile.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await mobile.waitForFunction(total => window.treePaints === total, {}, asset.points.length);
  await mobile.screenshot({ path: path.join(review, 'banyan-bottom-390.png') });
  await mobile.$eval('[data-banyan] canvas', canvas => canvas.dispatchEvent(new Event('contextlost')));
  await fallback(mobile, 'lost canvas context');
  await mobile.close();
  reports.push(`Mobile background roots complete at page bottom (initial ${before} glyphs); canvas loss restores static tree`);
  fs.writeFileSync(path.join(review, 'terminal-art-checks.json'), JSON.stringify({ result: 'pass', reports }, null, 2) + '\n');
  console.log(reports.join('\n'));
} finally { await browser.close(); }
