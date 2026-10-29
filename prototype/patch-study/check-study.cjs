// Development-only capture/check utility; not loaded by the mockups.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { createRequire } = require('node:module');
const assert = require('node:assert/strict');
const runtime = process.env.STUDY_NODE_MODULES;
assert(runtime, 'Set STUDY_NODE_MODULES to the bundled node_modules directory');
const { chromium } = createRequire(path.join(runtime, '../study-loader.cjs'))('playwright');
(async () => {
 const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true});
 const out = path.join(__dirname,'review'); fs.mkdirSync(out,{recursive:true});
 const checks=[];
 for(const name of ['index','work','background','patches']) {
  for(const width of [320,390,768,1280,1440,1920]) {
   const page = await browser.newPage({viewport:{width,height:width===390?844:900}, reducedMotion:'reduce', javaScriptEnabled:false});
   await page.goto(pathToFileURL(path.join(__dirname,name+'.html')).href);
   const report=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    escaped:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width && (r.left < -1 || r.right > innerWidth+1)}).map(e=>e.className),
    headings:document.querySelectorAll('h1').length,
    images:[...document.images].every(i=>i.complete&&i.naturalWidth>0&&i.hasAttribute('alt')),
    refs:[...document.querySelectorAll('[href],[src]')].map(e=>e.getAttribute('href')||e.getAttribute('src'))
   }));
   assert(!report.overflow && !report.escaped.length,`${name} overflow at ${width}: ${report.escaped}`);
   assert.equal(report.headings,1); assert(report.images);
   for(const ref of report.refs){if(/^(https?:|mailto:)/.test(ref))continue;const [file,anchor]=ref.split('#');const target=path.resolve(__dirname,file||name+'.html');assert(fs.existsSync(target),`Missing ${ref}`);if(anchor&&target.endsWith('.html'))assert(fs.readFileSync(target,'utf8').includes(`id="${anchor}"`),`Missing anchor ${ref}`);}
   await page.keyboard.press('Tab');
   assert(await page.locator('.skip').evaluate(e=>e===document.activeElement),'Skip link is first focus');
   await page.keyboard.press('Tab');
   if(width===390||width===1440){await page.locator('body').click({position:{x:2,y:2}});await page.screenshot({path:path.join(out,`${name}-${width}.png`),fullPage:true});}
   checks.push({page:name,width,overflow:false,images:true,links:true,skipLink:true,javaScript:false,reducedMotion:true});await page.close();
  }
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto(pathToFileURL(path.join(__dirname,'background.html')).href);
 await page.locator('#contact').screenshot({path:path.join(out,'contact-1440.png')});
 fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(checks,null,2));
 await browser.close();console.log(`${checks.length} viewport checks passed; 9 screenshots captured.`);
})().catch(e=>{console.error(e);process.exit(1)});
