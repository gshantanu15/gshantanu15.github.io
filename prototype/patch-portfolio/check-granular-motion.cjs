const {chromium}=require('C:/Users/known/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const base='http://127.0.0.1:8000/prototype/patch-portfolio/',out=path.join(__dirname,'review/granular');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});fs.mkdirSync(out,{recursive:true});const errors=[];
 try{
  const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{window.entrances=[];const animate=Element.prototype.animate;Element.prototype.animate=function(frames,options){if(this.hasAttribute('data-content-entrance'))window.entrances.push({tag:this.tagName,text:this.textContent.trim().slice(0,60),delay:options.delay,duration:options.duration});return animate.call(this,frames,options);};});
  for(const route of ['index','work','about']){
   await p.setViewportSize({width:1440,height:900});await p.goto(base+route+'.html');await p.waitForTimeout(700);
   assert(await p.locator('[data-content-entrance]').count()>10,route+': granular targets missing');
   assert.equal(await p.locator('section[data-content-entrance],.section-heading[data-content-entrance],.education-layout[data-content-entrance],.experience-entry[data-content-entrance]').count(),0,'whole section must stay still');
   const group=route==='index'?'.education-layout':route==='work'?'#counsel .case-heading':'.education-summary';
   await p.evaluate(()=>window.entrances=[]);await p.locator(group).scrollIntoViewIfNeeded();await p.waitForTimeout(80);
   const calls=await p.evaluate(()=>window.entrances);assert(calls.length>=2,route+': individual content did not enter');assert(calls.every(c=>c.duration===280));assert(calls.some(c=>c.delay>0),route+': stagger missing');
   await p.screenshot({path:path.join(out,`${route}-entrance.png`)});await p.waitForTimeout(600);
   const count=await p.evaluate(()=>window.entrances.length);await p.evaluate(()=>scrollBy(0,60));await p.waitForTimeout(70);await p.locator(group).scrollIntoViewIfNeeded();await p.waitForTimeout(500);
   assert.equal(await p.locator(group).evaluate(e=>e.getAnimations().length),0,'parent must not animate');
   for(const w of [320,390,768,1440,1920]){
    await p.setViewportSize({width:w,height:900});await p.locator('footer').scrollIntoViewIfNeeded();await p.waitForTimeout(150);
    const footer=p.locator('footer'),field=footer.locator('.ascii-field'),pre=field.locator('pre'),box=await footer.boundingBox(),r=await field.boundingBox();
    assert(Math.abs(r.y-box.y)<=1&&Math.abs(r.x-box.x)<=1&&Math.abs(r.width-box.width)<=1&&Math.abs(r.height-box.height)<=2,`${route}@${w}: field must cover entire footer`);
    const coverage=await pre.evaluate(e=>{const r=e.getBoundingClientRect(),host=e.parentElement.getBoundingClientRect();return r.width>=host.width&&r.height>=host.height;});assert(coverage,'ASCII grid must fill field');
    assert.equal(await footer.locator('.icon-link').count(),3);for(const link of await footer.locator('.icon-link').all()){const b=await link.boundingBox();assert(b.width>=44&&b.height>=44);}
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if([390,1440].includes(w))await footer.screenshot({path:path.join(out,`footer-${route}-${w}.png`)});
   }
  }
  await p.setViewportSize({width:1280,height:800});await p.goto(base+'index.html');await p.waitForTimeout(1800);assert.equal(await p.locator('#pause,[data-name-controls]').count(),0);
  const canvas=p.locator('.hero-name canvas');assert.equal(await p.locator('[data-ascii-name]').getAttribute('data-renderer'),'webgl2');let frames=await canvas.getAttribute('data-frames');await p.waitForTimeout(250);assert.equal(await canvas.getAttribute('data-frames'),frames,'idle render loop remains');
  const name=await p.locator('.hero-name').boundingBox();await p.mouse.move(name.x+name.width*.45,name.y+name.height*.4);await p.waitForTimeout(150);assert(Number(await canvas.getAttribute('data-frames'))>Number(frames),'pointer response lost');await p.waitForTimeout(1300);frames=await canvas.getAttribute('data-frames');await p.waitForTimeout(200);assert.equal(await canvas.getAttribute('data-frames'),frames,'stationary pointer must settle');
  const button=await p.locator('.hero .button-primary').boundingBox();assert(button.y+button.height<800);
  await p.mouse.move(1,1);await p.waitForTimeout(1200);await p.screenshot({path:path.join(out,'home-1280.png')});
  const f=p.locator('footer');await f.scrollIntoViewIfNeeded();await p.waitForTimeout(150);const pre=f.locator('pre'),before=await pre.textContent(),labels=await f.locator('.footer-inner').innerText(),r=await f.boundingBox();await p.mouse.move(r.x+r.width*.6,r.y+r.height*.5);await p.waitForTimeout(70);assert.notEqual(await pre.textContent(),before);assert.equal(await f.locator('.footer-inner').innerText(),labels);await p.mouse.move(1,1);await p.waitForTimeout(70);assert.equal(await pre.textContent(),before);
  await p.emulateMedia({reducedMotion:'reduce'});await p.goto(base+'index.html');await p.evaluate(()=>window.entrances=[]);await p.locator('.education-layout').scrollIntoViewIfNeeded();await p.waitForTimeout(400);assert.equal((await p.evaluate(()=>window.entrances)).length,0);assert.equal(await p.locator('.ascii-name-label').evaluate(e=>getComputedStyle(e).opacity),'1');
  const plain=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await plain.goto(base+'index.html');assert.equal(await plain.locator('h1').innerText(),'Shantanu Garg.');assert.equal(await plain.locator('#pause').count(),0);await plain.locator('footer').scrollIntoViewIfNeeded();assert.equal(await plain.locator('footer .icon-link').count(),3);await plain.locator('footer').screenshot({path:path.join(out,'footer-no-js-390.png')});
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({routes:['index','work','about'],widths:[320,390,768,1440,1920],granularTargets:true,stagger:true,parentSectionsStationary:true,fullFooterCoverage:true,footerLabelsStable:true,heroIdleAndStationaryPointerSettle:true,pauseRemoved:true,reducedMotion:true,noJavaScript:true,errors},null,2));console.log('Granular entrances, full-footer ASCII, bounded hero and responsive checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
