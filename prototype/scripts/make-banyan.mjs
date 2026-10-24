// Optional authoring tool: the site serves its local output without a build step.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

assert(process.env.HALLMARK_PUPPETEER, 'Set HALLMARK_PUPPETEER to the existing Puppeteer tooling folder');
const require = createRequire(path.join(process.env.HALLMARK_PUPPETEER, 'noop.js'));
const puppeteer = require('puppeteer-core');
const root = path.resolve(import.meta.dirname, '../..');
const source = fs.readFileSync(path.join(root, 'prototype/artwork/banyan-source-v2.png')).toString('base64');
const font = fs.readFileSync(path.join(root, 'prototype/assets/fonts/martian-mono.ttf')).toString('base64');
const tokens = fs.readFileSync(path.join(root, 'prototype/assets/tokens.css'), 'utf8');
const colors = Array.from({ length: 8 }, (_, level) => tokens.match(new RegExp(`--glyph-${level}:\\s*([^;]+);`))?.[1]);
assert(colors.every(Boolean), 'All eight Terminal glyph tokens must be available');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
try {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', request => /^(data:|about:)/.test(request.url()) ? request.continue() : request.abort());
  const result = await page.evaluate(async ({ source, font, colors }) => {
    const face = new FontFace('Martian Mono', `url(data:font/ttf;base64,${font})`);
    document.fonts.add(await face.load());
    const image = new Image(); image.src = 'data:image/png;base64,' + source; await image.decode();
    const width = 1800, height = 1200, columns = 300, rows = 108;
    if (Math.abs(image.naturalWidth / image.naturalHeight - width / height) > .001) throw new Error('Source aspect must match the botanical master; crop deliberately instead of stretching');
    const sample = document.createElement('canvas'); sample.width = columns; sample.height = rows;
    const sampleContext = sample.getContext('2d');
    sampleContext.drawImage(image, 0, 0, columns, rows);
    const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
    // Separate hanging bark/roots from foliage and the central trunk. Each root family
    // has its own timing; the actual curved outline comes from the botanical source.
    const rootFamilies = [
      [.075, .135, .62, .90, .04], [.19, .255, .55, .94, .12],
      [.275, .325, .60, .93, .07], [.335, .435, .52, .94, .17],
      [.63, .70, .47, .91, .10], [.71, .775, .54, .89, .21],
      [.79, .86, .60, .94, .06]
    ];
    const points = [];
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const offset = (row * columns + col) * 4;
      const [r, g, b, a] = pixels.slice(offset, offset + 4);
      const alpha = a / 255;
      if (alpha < .13) continue;
      const luminance = (.2126 * r + .7152 * g + .0722 * b) / 255;
      const tone = Math.max(0, Math.min(1, (luminance - .055) / .62));
      const brightness = Math.pow(tone, .88) * Math.sqrt(alpha);
      if (brightness < .055) continue;
      const level = Math.min(7, Math.floor(brightness * 8));
      const x = (col + .5) / columns, y = (row + .5) / rows;
      const isLeaf = g > r * 1.04 && g > b * 1.10;
      const family = !isLeaf && rootFamilies.find(([left, right, top]) => x >= left && x <= right && y >= top);
      let born = -1;
      if (family) {
        const [, , top, bottom, delay] = family;
        const t = Math.max(0, Math.min(1, (y - top) / (bottom - top)));
        const eased = t * t * (3 - 2 * t);
        born = Number((delay + (.985 - delay) * eased).toFixed(4));
      }
      points.push([Math.round(x * width), Number((y * height).toFixed(1)), level, born]);
    }
    const text = 'shantanu.garg/tampere/computer.science/projects/';
    const glyphs = Array.from(text, (_, index) => text[(index * 17) % text.length]).join('');
    const asset = { version: 2, width, height, columns, rows, glyphs, points };
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d'); context.textAlign = 'center'; context.textBaseline = 'middle';
    points.forEach(([x, y, level], index) => {
      context.fillStyle = colors[level];
      context.font = `400 ${level < 3 ? 6.8 : 11}px "Martian Mono"`;
      context.fillText(glyphs[index % glyphs.length], x, y, 5.3);
    });
    return { asset, webp: canvas.toDataURL('image/webp', .8).split(',')[1] };
  }, { source, font, colors });
  const { asset } = result;
  assert.equal(asset.width / asset.height, 1.5, 'Master artwork must retain its landscape botanical proportions');
  assert(asset.points.length > 4000 && asset.points.length < 32400, 'Botanical silhouette has meaningful detail and negative space');
  const growing = asset.points.filter(point => point[3] >= 0);
  assert(growing.length > 500 && new Set(growing.map(point => point[3])).size > 100, 'Independent aerial roots develop progressively');
  assert(asset.points.every(([x, y, level, born]) => [x, y, level, born].every(Number.isFinite) && x >= 0 && x < asset.width && y >= 0 && y < asset.height && level >= 0 && level <= 7 && born >= -1 && born <= 1));
  fs.writeFileSync(path.join(root, 'prototype/assets/banyan-glyph.json'), JSON.stringify(asset));
  fs.writeFileSync(path.join(root, 'prototype/assets/banyan-glyph.webp'), Buffer.from(result.webp, 'base64'));
  console.log(`Botanical glyph master: ${asset.width}x${asset.height}, ${asset.points.length} glyphs, ${growing.length} progressive aerial-root glyphs`);
} finally { await browser.close(); }
