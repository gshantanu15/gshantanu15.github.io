const {chromium}=require('C:/Users/known/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const base='http://127.0.0.1:8000/prototype/patch-portfolio/';
const output=path.join(__dirname,'review/refinement');
const wait=p=>p.waitForTimeout(250);
// Map a real local point through the same CSS rotation as the visible artwork.
async function point(locator,x,y){return locator.evaluate((e,[x,y])=>{const r=e.getBoundingClientRect(),p=new DOMPoint(e.offsetWidth*x-e.offsetWidth/2,e.offsetHeight*y-e.offsetHeight/2).matrixTransform(new DOMMatrix(getComputedStyle(e).transform));return{x:r.left+r.width/2+p.x,y:r.top+r.height/2+p.y};},[x,y]);}
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 fs.mkdirSync(output,{recursive:true});const errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const width of [320,390,520,768,788,1024,1280,1440,1920]){
   await page.setViewportSize({width,height:900});await page.goto(base+'index.html');
   await page.waitForFunction(()=>document.querySelector('[data-ascii-name]').dataset.renderer==='webgl2');
   await page.waitForFunction(()=>!document.querySelector('[data-portrait-peel]').disabled);
   const portrait=page.locator('[data-portrait-peel]');await portrait.scrollIntoViewIfNeeded();
   const center=await point(portrait,.5,.5);await page.mouse.move(center.x,center.y);await wait(page);
   assert.equal(await portrait.getAttribute('data-progress'),'1',`${width}: center must remain flat`);
   const corner=await point(portrait,.97,.97);await page.mouse.move(corner.x,corner.y,{steps:12});await wait(page);
   assert(Number(await portrait.getAttribute('data-progress'))<.75,`${width}: real pointer must peel the visible corner`);
   if(width===788)await portrait.screenshot({path:path.join(output,'portrait-hover-788.png')});
   await page.mouse.move(1,1);await wait(page);assert.equal(await portrait.getAttribute('data-progress'),'1',`${width}: leaving must restore`);
   await page.mouse.move(corner.x,corner.y);await wait(page);assert(Number(await portrait.getAttribute('data-progress'))<.75,`${width}: re-entry must work`);
   await portrait.focus();await page.keyboard.press('Enter');await wait(page);assert.equal(await portrait.getAttribute('aria-pressed'),'true');
   await page.keyboard.press('Escape');await wait(page);assert.equal(await portrait.getAttribute('data-progress'),'1');
   await page.mouse.move(1,1);await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});await page.waitForTimeout(1600);
   assert.equal(await page.locator('h1').innerText(),'Shantanu Garg.');
   if(width===1280){const action=await page.locator('.hero .button-primary').boundingBox();assert(action.y+action.height<800,'primary hero action must fit 1280x800');}
   if([390,788,1440].includes(width))await page.screenshot({path:path.join(output,`hero-${width}.png`)});
   assert.equal(await page.locator('#pause').count(),0);
   const frames=await page.locator('.hero-name canvas').getAttribute('data-frames');await wait(page);assert.equal(await page.locator('.hero-name canvas').getAttribute('data-frames'),frames,'hero must stop without a pause control');
   for(const route of ['index','work','about']){
    if(route!=='index')await page.goto(base+route+'.html');
    const footer=page.locator('footer');await footer.scrollIntoViewIfNeeded();await wait(page);
    assert.equal(await page.locator('.icon-links a').count(),3,`${route}: single contact row`);
    for(const link of await footer.locator('.icon-link').all()){
     const r=await link.boundingBox();assert(r.width>=44&&r.height>=44,`${route}: contact target`);
     assert(r.x>=0&&r.x+r.width<=width+1,`${route}: contact fits viewport`);
    }
    const box=await footer.boundingBox(),field=await footer.locator('.ascii-field').boundingBox();assert(Math.abs(field.y-box.y)<=1&&Math.abs(field.height-box.height)<=2,`${route}: ASCII must fill footer`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route}@${width}: overflow`);
    if(route==='index'){
     const frameCount=await page.locator('.hero-name canvas').getAttribute('data-frames');await wait(page);
     assert.equal(await page.locator('.hero-name canvas').getAttribute('data-frames'),frameCount,'offscreen ASCII must stop rendering');
    }
    if([390,1440].includes(width))await footer.screenshot({path:path.join(output,`footer-${route}-${width}.png`)});
   }
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'index.html');await wait(page);
  assert.equal(await page.locator('.ascii-name-label').evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await page.locator('[data-name-controls]').count(),0);
  assert(await page.locator('[data-portrait-peel]').isDisabled());
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('.ascii-name-label').evaluate(e=>getComputedStyle(e).opacity),'1');
  const fallback=await browser.newPage();await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args)};});await fallback.goto(base+'index.html');
  assert.equal(await fallback.locator('[data-ascii-name]').getAttribute('data-renderer'),'fallback');assert.equal(await fallback.locator('.ascii-name-label').evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await fallback.locator('[data-name-controls]').count(),0);
  const plain=await browser.newPage({javaScriptEnabled:false});await plain.goto(base+'index.html');assert.equal(await plain.locator('h1').innerText(),'Shantanu Garg.');assert.equal(await plain.locator('[data-name-controls]').count(),0);assert.equal(await plain.locator('.icon-links a').count(),3);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify({widths:[320,390,520,768,788,1024,1280,1440,1920],realPointerCorner:true,restoreAndReentry:true,keyboard:true,asciiName:true,boundedHero:true,footerTargets:true,fullFooterTexture:true,singleContactRow:true,reducedMotion:true,noWebgl:true,noJavaScript:true,pageErrors:errors},null,2));
  console.log('Approved name, real-pointer portrait and responsive footer checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
