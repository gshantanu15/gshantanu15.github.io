/* Playwright smoke/accessibility checker for the patch-portfolio prototype.
 * Run from this directory with `node check-prototype.cjs`; set BASE_URL to
 * exercise the HTTP-only motion checks (for example http://127.0.0.1:8000).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/known/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const ROOT = __dirname;
const pages = ['index.html', 'work.html', 'about.html'];
const widths = [320, 390, 768, 1024, 1280, 1440, 1920];
const externalUrl = /^(?:https?:|mailto:|tel:|\/\/)/i;
const localTarget = (name) => process.env.BASE_URL
  ? `${process.env.BASE_URL.replace(/\/$/, '')}/${name}`
  : `file://${path.join(ROOT, name)}`;

function fail(message) { throw new Error(message); }
function assert(condition, message) { if (!condition) fail(message); }

async function checkPage(page, name, width, errors, height = width === 390 ? 844 : 900) {
  await page.setViewportSize({ width, height });
  const consoleErrors = [];
  const onConsole = (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); };
  const onPageError = (error) => consoleErrors.push(error.message);
  page.on('console', onConsole); page.on('pageerror', onPageError);
  await page.goto(localTarget(name), { waitUntil: 'networkidle' });
  const result = await page.evaluate(() => {
    const main = document.querySelector('main');
    const content = main || document.body;
    const external = /^(?:https?:|mailto:|tel:|\/\/)/i;
    const links = [...document.querySelectorAll('[href]')].map((el) => el.href);
    const resources = [...document.querySelectorAll('img[src],source[src],video[src],audio[src],video[poster]')]
      .map((el) => el.getAttribute('src') || el.getAttribute('poster'));
    return {
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1 || document.body.scrollWidth > window.innerWidth + 1,
      contentOverflow: content.getBoundingClientRect().right > window.innerWidth + 1 || content.getBoundingClientRect().left < -1,
      images: [...document.images].map((img) => ({ alt: img.getAttribute('alt'), src: img.getAttribute('src') })),
      links, resources,
      blankUnsafe: [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/\bnoopener\b/.test(a.rel) || !/\bnoreferrer\b/.test(a.rel)).length,
      mediaAutoplay: [...document.querySelectorAll('video[autoplay],audio[autoplay]')].length,
      bodyText: document.body.innerText.trim().length,
      nav: !!document.querySelector('nav'),
      motion: [...document.querySelectorAll('.patch-frame[data-patch-source]')].length,
    };
  });
  assert(result.h1 === 1, `${name}@${width}: expected exactly one h1`);
  assert(!result.overflow && !result.contentOverflow, `${name}@${width}: horizontal overflow`);
  assert(result.images.every((img) => img.alt !== null), `${name}@${width}: image missing alt (${result.images.find((i) => i.alt === null)?.src})`);
  assert(result.blankUnsafe === 0, `${name}@${width}: unsafe target=_blank link`);
  assert(result.mediaAutoplay === 0, `${name}@${width}: autoplay media found`);
  assert(result.nav && result.bodyText > 50, `${name}@${width}: no-JS readable landmarks/content`);
  for (const url of [...result.links, ...result.resources]) {
    if (typeof url !== 'string') continue;
    if (externalUrl.test(url) && (!process.env.BASE_URL || new URL(url).origin !== new URL(process.env.BASE_URL).origin)) continue;
    if (url.startsWith('data:')) continue;
    const parsed = new URL(url, localTarget(name));
    if (parsed.protocol === 'file:') assert(fs.existsSync(parsed.pathname.replace(/^\//, '').replace(/^([A-Z]):/, '$1:')), `${name}: missing local resource ${url}`);
    if (parsed.hash) {
      const fragmentPage = parsed.pathname.split('/').pop();
      const fragment = decodeURIComponent(parsed.hash.slice(1));
      const fragmentPath = path.join(ROOT, fragmentPage || name);
      if (fs.existsSync(fragmentPath)) {
        const html = fs.readFileSync(fragmentPath, 'utf8');
        assert(new RegExp(`(?:id|name)=["']${fragment.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}["']`).test(html), `${name}: missing fragment #${fragment}`);
      }
    }
  }
  if (consoleErrors.length) errors.push(`${name}@${width}: ${consoleErrors.join(' | ')}`);
  page.off('console', onConsole); page.off('pageerror', onPageError);
}

async function checkNoJs(browser, name) {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto(localTarget(name), { waitUntil: 'domcontentloaded' });
  assert((await page.locator('h1').count()) === 1 && (await page.locator('body').innerText()).trim().length > 50, `${name}: no-JS page is not readable`);
  assert(await page.locator('nav').first().isVisible(), `${name}: no-JS navigation is hidden`);
  await context.close();
}

async function checkNavigation(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto(localTarget('index.html'), { waitUntil: 'networkidle' });
  const toggle = page.locator('.nav-toggle');
  if (await toggle.count()) {
    await toggle.click(); assert(await toggle.getAttribute('aria-expanded') === 'true', 'mobile nav did not open');
    await page.keyboard.press('Escape'); assert(await toggle.getAttribute('aria-expanded') === 'false', 'Escape did not close nav');
    assert(await page.evaluate(() => document.activeElement === document.querySelector('.nav-toggle')), 'Escape did not restore focus');
    await toggle.click(); const item = page.locator('#site-nav a').first(); if (await item.count()) { await item.click(); assert(await toggle.getAttribute('aria-expanded') === 'false', 'nav click did not close'); }
  }
  await context.close();
}

async function checkCarousels(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto(localTarget('about.html'), { waitUntil: 'networkidle' });
  for (const carousel of await page.locator('[data-carousel]').all()) {
    const slide = carousel.locator('[data-slide]').first(); const next = carousel.locator('[data-carousel-next]');
    if (!await slide.count() || !await next.count()) continue;
    const before = await carousel.boundingBox(); const current = carousel.locator('[data-carousel-current]'); const beforeCurrent = await current.textContent(); await next.click(); const after = await carousel.boundingBox();
    assert(before && after && before.width === after.width && before.height === after.height, 'carousel frame size changed');
    assert((await current.textContent()) !== beforeCurrent, 'carousel current indicator did not advance');
    assert(await carousel.locator('[data-slide]:not([hidden])').count() === 1, 'carousel does not expose one visible slide');
  }
  await context.close();
}

async function checkMotion(browser) {
  if (!process.env.BASE_URL) return;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage(); await page.goto(localTarget('index.html'), { waitUntil: 'networkidle' });
  const frame = page.locator('.patch-frame[data-patch-source]').first();
  if (await frame.count()) {
    const before = await frame.getAttribute('data-progress'); await page.mouse.move(100, 100); await page.waitForTimeout(250);
    assert(await frame.getAttribute('data-progress') === before, 'reduced-motion frame advanced unexpectedly');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const errors = [];
    for (const name of pages) for (const width of widths) { const page = await browser.newPage(); await checkPage(page, name, width, errors); await page.close(); }
    for (const name of pages) await checkNoJs(browser, name);
    await checkNavigation(browser); await checkCarousels(browser); await checkMotion(browser);
    const landscape = await browser.newPage({ viewport: { width: 844, height: 390 } }); await checkPage(landscape, 'index.html', 844, errors, 390); await landscape.close();
    fs.mkdirSync(path.join(ROOT, 'review'), { recursive: true });
    for (const name of pages) {
      const slug = name.replace('.html', ''); const shot = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); await shot.goto(localTarget(name), { waitUntil: 'networkidle' });
      await shot.evaluate(async () => { for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map((img) => img.decode?.().catch(() => {}))); window.scrollTo(0, document.body.scrollHeight); await new Promise((resolve) => setTimeout(resolve, 150)); window.scrollTo(0, 0); });
      await shot.screenshot({ path: path.join(ROOT, `review/${slug}-1440.png`), fullPage: true }); await shot.setViewportSize({ width: 390, height: 844 }); await shot.screenshot({ path: path.join(ROOT, `review/${slug}-390.png`), fullPage: true }); await shot.close();
    }
    assert(errors.length === 0, errors.join('\n'));
    console.log('Prototype checks passed. Screenshots written to review/home-1440.png and review/home-390.png');
  } finally { await browser.close(); }
})().catch((error) => { console.error(`Prototype checks failed: ${error.message}`); process.exitCode = 1; });
