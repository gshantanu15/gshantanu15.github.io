// Optional local authoring tool. The site serves its output without running this script.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

assert(process.env.HALLMARK_PUPPETEER, 'Set HALLMARK_PUPPETEER to the existing Puppeteer tooling folder');
const require = createRequire(path.join(process.env.HALLMARK_PUPPETEER, 'noop.js'));
const puppeteer = require('puppeteer-core');
const root = path.resolve(import.meta.dirname, '../..');
const photo = fs.readFileSync(path.join(root, 'assets/images/profile.webp')).toString('base64');
const font = fs.readFileSync(path.join(root, 'prototype/assets/fonts/martian-mono.ttf')).toString('base64');
const tokens = fs.readFileSync(path.join(root, 'prototype/assets/tokens.css'), 'utf8');
const colors = Array.from({ length: 8 }, (_, level) => tokens.match(new RegExp(`--glyph-${level}:\\s*([^;]+);`))?.[1]);
assert(colors.every(Boolean), 'All eight Terminal glyph color tokens must be available');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
try {
  const page = await browser.newPage();
  // No remote page, upload service, camera, or third-party renderer is involved.
  await page.setRequestInterception(true);
  page.on('request', request => /^(data:|about:)/.test(request.url()) ? request.continue() : request.abort());
  const data = await page.evaluate(async ({ photo, font, colors }) => {
    const face = new FontFace('Portrait Mono', `url(data:font/ttf;base64,${font})`);
    document.fonts.add(await face.load());
    const image = new Image();
    image.src = 'data:image/webp;base64,' + photo;
    await image.decode();
    const cols = 130, rows = 70, cellWidth = 6, cellHeight = 11.1;
    const sample = document.createElement('canvas');
    sample.width = cols; sample.height = rows;
    const sampleContext = sample.getContext('2d');
    sampleContext.drawImage(image, 0, 0, cols, rows);
    const pixels = sampleContext.getImageData(0, 0, cols, rows).data;
    const canvas = document.createElement('canvas');
    canvas.width = 780; canvas.height = 777;
    const context = canvas.getContext('2d');
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const text = 'shantanu.garg/tampere/computer.science/ai/web/apis/';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = (row * cols + col) * 4;
        if (pixels[i + 3] < 128) continue;
        const luminance = (.2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2]) / 255;
        const brightness = Math.max(0, Math.min(1, (luminance - .035) / .88));
        if (brightness < .035) continue;
        const level = Math.min(7, Math.floor(brightness * 8));
        context.fillStyle = colors[level];
        context.font = `400 ${level < 3 ? 6.8 : 11}px "Portrait Mono"`;
        context.fillText(text[(row * cols + col) % text.length], (col + .5) * cellWidth, (row + .5) * cellHeight, cellWidth * .88);
      }
    }
    return canvas.toDataURL('image/webp', .94).split(',')[1];
  }, { photo, font, colors });
  const output = path.join(root, 'prototype/assets/portrait-glyph.webp');
  fs.writeFileSync(output, Buffer.from(data, 'base64'));
  console.log(`Generated approved portrait locally: ${fs.statSync(output).size} bytes, 130 columns, 70 rows`);
} finally { await browser.close(); }
