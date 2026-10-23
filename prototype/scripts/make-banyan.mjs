// Deterministic authoring tool for the Terminal banyan glyph. It is never run by the site.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

assert(process.env.HALLMARK_PUPPETEER, 'Set HALLMARK_PUPPETEER to the existing Puppeteer tooling folder');
const require = createRequire(path.join(process.env.HALLMARK_PUPPETEER, 'noop.js'));
const puppeteer = require('puppeteer-core');
const root = path.resolve(import.meta.dirname, '../..');
const width = 480, height = 1421, cols = 80, rows = 128;
const cellW = width / cols, cellH = height / rows;
const marks = new Map();
const key = (x, y) => `${Math.round(x)},${Math.round(y)}`;
function mark(x, y, level, born = -1) {
  const gx = Math.max(0, Math.min(cols - 1, Math.round(x)));
  const gy = Math.max(0, Math.min(rows - 1, Math.round(y)));
  const k = key(gx, gy);
  const old = marks.get(k);
  // Static canopy/branch cells remain the base layer; progressive roots never punch holes in them.
  if (!old || (old[3] >= 0 && level >= old[2])) marks.set(k, [gx * cellW + cellW / 2, gy * cellH + cellH / 2, level, born]);
}
function curve(points, level, bornFn = () => -1, radius = 0) {
  for (let s = 0; s <= 100; s++) {
    const t = s / 100;
    const seg = Math.min(Math.floor(t * ((points.length - 1) / 3)), Math.floor((points.length - 1) / 3) - 1);
    const local = (t * ((points.length - 1) / 3)) - seg;
    const a = points[seg * 3], b = points[seg * 3 + 1], c = points[seg * 3 + 2], d = points[seg * 3 + 3];
    const m = 1 - local;
    const x = m ** 3 * a[0] + 3 * m ** 2 * local * b[0] + 3 * m * local ** 2 * c[0] + local ** 3 * d[0];
    const y = m ** 3 * a[1] + 3 * m ** 2 * local * b[1] + 3 * m * local ** 2 * c[1] + local ** 3 * d[1];
    mark(x, y, level, bornFn(t));
    if (radius) { mark(x + radius, y, level, bornFn(t)); mark(x - radius, y, level, bornFn(t)); }
  }
}
// Dense, irregular umbrella canopy made from overlapping elliptical foliage lobes.
const lobes = [[40, 16, 35, 12], [16, 21, 14, 10], [64, 21, 14, 10]];
for (let y = 5; y <= 32; y++) for (let x = 4; x <= 76; x++) {
  const hit = lobes.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);
  const dither = (x * 17 + y * 31 + x * y * 3) % 11;
  if (hit && dither > 1) mark(x, y, dither < 4 ? 0 : 1 + (dither % 3));
}
// Arched limbs and a thick, gently twisted central trunk.
const branches = [
  [[40, 31], [31, 31], [21, 34], [10, 37]], [[40, 31], [49, 31], [61, 34], [73, 35]],
  [[38, 34], [27, 35], [17, 43], [7, 50]], [[42, 34], [54, 35], [66, 41], [77, 47]],
  [[39, 30], [35, 28], [35, 26], [39, 24]], [[41, 30], [45, 28], [48, 26], [51, 25]]
];
branches.forEach((p, i) => curve(p, 3 + (i % 2), () => -1, 0.5));
curve([[40, 25], [37, 34], [42, 49], [39, 64], [40, 82], [37, 105], [38, 127]], 4, () => -1, .8);
curve([[43, 29], [40, 42], [44, 56], [40, 72], [42, 92], [39, 112], [41, 127]], 3, () => -1, .6);
// Aerial roots: each curve has a different birth delay and a slight sideways curl.
for (let i = 0; i < 28; i++) {
  const startX = 9 + i * 2.18 + Math.sin(i * 1.4) * 2;
  const startY = 30 + (i % 5) * 3;
  const endX = Math.max(7, Math.min(72, startX + Math.sin(i * 2.1) * 7 + (i % 3 - 1) * 3));
  const endY = 112 + (i % 6) * 2.4;
  const bend = Math.max(6, Math.min(74, startX + Math.sin(i * 1.7) * 8));
  const delay = 0.08 + (i % 7) * 0.07;
  const sway = Math.sin(i * 2.3) * 5;
  curve([[startX, startY], [bend, startY + 8], [startX - sway, startY + 20], [endX + sway, endY - 27], [endX - sway * .5, endY - 12], [endX + sway * .25, endY - 5], [endX, endY]], 1 + (i % 4), t => delay + (1 - delay) * t, i % 3 === 0 ? .35 : 0);
}
// Flared anchors and a few merging root junctions.
for (let i = 0; i < 13; i++) curve([[18 + i * 3.6, 116], [16 + i * 3.8, 121], [14 + i * 4, 125], [14 + i * 4, 127]], 3, t => .985 + .015 * t, .55);
const points = [...marks.values()].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
assert(points.length > 700 && points.length < 5000, `Unexpected point count: ${points.length}`);
assert(points.filter(point => point[3] >= 0).length > 500, 'Aerial roots must contain progressive glyphs');
assert(new Set(points.filter(point => point[3] >= 0).map(point => point[3])).size > 100, 'Roots must grow along their paths, not appear as a single block');
for (const [x, y, level, born] of points) assert(Number.isFinite(x + y) && x >= 0 && x <= width && y >= 0 && y <= height && level >= 0 && level <= 7 && born >= -1 && born <= 1);
const asset = { width, height, points };
fs.writeFileSync(path.join(root, 'prototype/assets/banyan-glyph.json'), JSON.stringify(asset));

const tokens = fs.readFileSync(path.join(root, 'prototype/assets/tokens.css'), 'utf8');
const colors = Array.from({ length: 8 }, (_, level) => tokens.match(new RegExp(`--glyph-${level}:\\s*([^;]+);`))?.[1]);
assert(colors.every(Boolean), 'All eight glyph tokens must be available');
const font = fs.readFileSync(path.join(root, 'prototype/assets/fonts/martian-mono.ttf')).toString('base64');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
try {
  const page = await browser.newPage();
  const png = await page.evaluate(async ({ asset, colors, font }) => {
    const face = new FontFace('Martian Mono', `url(data:font/ttf;base64,${font})`); document.fonts.add(await face.load());
    const c = document.createElement('canvas'); c.width = asset.width; c.height = asset.height;
    const ctx = c.getContext('2d'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const glyphs = 'banyan/roots/branches/leaves/';
    asset.points.forEach((p, i) => { const level = p[2]; ctx.fillStyle = colors[level]; ctx.font = `400 ${level < 3 ? 6.8 : 10}px "Martian Mono"`; ctx.fillText(glyphs[i % glyphs.length], p[0], p[1], 5.3); });
    return c.toDataURL('image/webp', .92).split(',')[1];
  }, { asset, colors, font });
  fs.writeFileSync(path.join(root, 'prototype/assets/banyan-glyph.webp'), Buffer.from(png, 'base64'));
} finally { await browser.close(); }
console.log(`Generated banyan glyph: ${points.length} points, ${fs.statSync(path.join(root, 'prototype/assets/banyan-glyph.webp')).size} bytes`);
