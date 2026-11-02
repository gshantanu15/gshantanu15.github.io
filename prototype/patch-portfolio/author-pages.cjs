const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/known/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('url');
const root=process.cwd(),out=path.join(root,'prototype/patch-portfolio');
const { footer, contactLinks }=require('./footer-template.cjs');
const map={'voice-agent':'voice-agent-lab','counsel':'counsel','demola-ar':'demola-ar','expense-api':'expense-tracker-api','flipoff':'flipoff','satellites':'satellites'};
function patch(id,motion=true){if(id==='graduate-2026') return `<button disabled type="button" class="patch-frame portrait-patch" data-patch-source="assets/patches/graduate-2026.svg" data-portrait-peel aria-label="Peel portrait patch" aria-pressed="false"><img src="assets/patches/graduate-2026.svg" width="420" height="640" alt="Shantanu Garg, Graduate, 2026" fetchpriority="high"></button>`;return `<div class="patch-frame${id==='graduate-2026'?' portrait-patch':''}"${motion?' data-patch-source="assets/patches/'+(map[id]||id)+'.svg"':''}><img src="assets/patches/${map[id]||id}.svg" width="${id==='graduate-2026'?420:640}" height="${id==='graduate-2026'?640:420}" alt="${id==='graduate-2026'?'Shantanu Garg, Graduate, 2026':''}" ${id==='graduate-2026'?'fetchpriority="high"':'loading="lazy"'}></div>`;}

function shell(page,head,main){return `<!doctype html><html lang="en"><head>${head}<link rel="stylesheet" href="assets/site.css"><script src="assets/site.js" defer></script>${page==='index'?'<script src="assets/ascii-name.js" defer></script>':''}</head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="shell header-inner"><a class="brand" href="index.html">Shantanu Garg</a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" class="site-nav" aria-label="Primary navigation">${[['Home','index.html'],['Work','work.html'],['About','about.html'],['Contact','about.html#contact']].map(([n,u])=>`<a href="${u}"${u===page+'.html'?' aria-current="page"':''}>${n}</a>`).join('')}</nav></div></header>${main}${footer(page)}</body></html>`;}
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const p=await browser.newPage();for(const name of ['index','work','about']){await p.goto(pathToFileURL(path.join(root,name+'.html')).href);const doc=await p.evaluate(({name,map})=>{
 const d=document;
 d.querySelectorAll('.eyebrow,.section-index,.case-number,.brand-mark').forEach(e=>e.remove());
 d.querySelectorAll('span[aria-hidden="true"]').forEach(e=>{if(/[↗→]/.test(e.textContent))e.remove();});
 // Retain metadata facts as captions below titles instead of eyebrow labels.
 d.querySelectorAll('.project-meta').forEach(e=>{const h=e.nextElementSibling;if(h&&/^H[1-6]$/.test(h.tagName))h.after(e);});
 if(name==='index'){
  d.querySelector('.hero-intro').remove();
  d.querySelector('.portrait-card').remove();
  d.querySelector('#selected-work-title').textContent='Selected work';
  d.querySelectorAll('.project-card').forEach(card=>{card.querySelector('.project-visual').remove();card.querySelector('.project-meta')?.remove();const h=card.querySelector('h3');if(h)card.prepend(h);});
  d.querySelector('a[href="work.html#demola-ar"] .project-card-copy p').textContent='A collaborative AR project. I contributed Tripo3D API integration and manual end-to-end testing with the team.';
 }
 if(name==='work'){
  d.querySelectorAll('.project-jump a').forEach(a=>a.textContent=a.textContent.replace(/^\d+\s+/,''));
  d.querySelectorAll('.case-study').forEach(article=>{
   const head=article.querySelector('.case-heading');const inner=head.querySelector('div');head.replaceWith(inner);inner.classList.add('case-heading');
   article.querySelectorAll('.case-visual:not(.voice-demo)').forEach(e=>e.remove());
   const audio=article.querySelector('.voice-demo');if(audio){audio.querySelector('.voice-status')?.remove();audio.querySelector('.voice-labels')?.remove();audio.querySelector('.voice-demo-kicker')?.remove();}
   const content=[...article.querySelectorAll(':scope > .case-content,:scope > .case-result,:scope > .star-grid,:scope > .emphasis-block')];
   const details=d.createElement('details');details.className='project-story';const summary=d.createElement('summary');summary.textContent='Read contribution and project details';details.append(summary,...content);article.append(details);
  });
  const ar=d.querySelector('#demola-ar');
  ar.querySelector('.star-grid').innerHTML='<div><h3>Team project</h3><p>The team explored object recognition and tracking for aligned digital twins in augmented reality.</p></div><div><h3>My contribution</h3><p>I integrated the Tripo3D API, performed manual end-to-end testing, and collaborated with the team to identify integration issues and support delivery.</p></div><div><h3>Team delivery</h3><p>The team delivered a shared demonstration through close collaboration and end-to-end testing.</p></div>';
  ar.querySelector('.tag-list').innerHTML='<li>Augmented reality</li><li>Tripo3D API</li><li>Manual E2E testing</li><li>Team delivery</li>';
 }
 if(name==='about'){
  d.querySelectorAll('.activity-list li').forEach(e=>{if(e.textContent.includes('Sustainable Development Goals'))e.remove();});
  d.querySelector('.about-at-glance > .project-meta')?.remove();
 }
 d.querySelectorAll('[data-carousel-prev]').forEach(e=>e.textContent='Previous');
 d.querySelectorAll('[data-carousel-next]').forEach(e=>e.textContent='Next');
 d.querySelectorAll('audio,video').forEach(e=>{e.controls=true;e.preload='none';e.removeAttribute('autoplay');e.removeAttribute('loop');});
 d.querySelectorAll('img').forEach(e=>{if(!e.hasAttribute('width'))e.setAttribute('width',1265);if(!e.hasAttribute('height'))e.setAttribute('height',780);});
 d.querySelectorAll('[src],[poster],[href]').forEach(e=>['src','poster','href'].forEach(attr=>{const v=e.getAttribute(attr);if(v?.startsWith('assets/'))e.setAttribute(attr,'../../'+v);}));
 // Copy cleanup affects punctuation only, not substantive facts.
 const walker=d.createTreeWalker(d.querySelector('main'),NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){node.textContent=node.textContent.replace(/June 2024—February 2025/g,'June 2024 to February 2025').replace(/May—August 2022/g,'May to August 2022').replace(/2024—2025/g,'2024 to 2025').replace(/English–Hindi/g,'English-Hindi').replace(/[↗→]/g,'').replace(/ · /g,', ').replace(/[—–]/g,', ');}
 const head=d.head.cloneNode(true);head.querySelectorAll('script,link[rel="stylesheet"],link[rel="canonical"],meta[property^="og:"],meta[name="twitter:card"]').forEach(e=>e.remove());head.querySelector('meta[name="theme-color"]')?.setAttribute('content','#ffffff');const robots=d.createElement('meta');robots.name='robots';robots.content='noindex';head.append(robots);
 return {head:head.innerHTML,main:d.querySelector('main').outerHTML};
 },{name,map});
 await p.setContent(doc.main);
 if(name==='index'){
 await p.evaluate(patch=>{document.querySelector('.hero h1').outerHTML="<h1 class=\"hero-name\" data-ascii-name><span class=\"ascii-name-label\">Shantanu Garg.</span><canvas aria-hidden=\"true\"></canvas></h1>";document.querySelector('.hero').insertAdjacentHTML('beforeend',patch);document.querySelector('.hero').insertAdjacentHTML('afterend','<section class="bio-note shell" aria-label="Biography"><p>I am a Computer Science graduate with a minor in Machine Learning and Signal Processing. I build practical software across AI, web applications, and APIs, and I value thoughtful teamwork from early product decisions through testing and delivery.</p></section>');},patch('graduate-2026',false));
 for(const id of ['voice-agent','counsel','demola-ar','satellites'])await p.evaluate(({id,html})=>document.querySelector(`a[href="work.html#${id}"]`).insertAdjacentHTML('afterbegin',html),{id,html:patch(id)});
 }else if(name==='work'){
 for(const id of Object.keys(map))await p.evaluate(({id,html})=>{const article=document.getElementById(id),head=article.querySelector('.case-heading');const wrap=document.createElement('div');wrap.className='project-intro';wrap.innerHTML=html;head.before(wrap);wrap.append(head);},{id,html:patch(id)});
 }
 await p.evaluate(links=>{document.querySelectorAll('.contact-links').forEach(e=>e.outerHTML=links);},contactLinks);
 await p.evaluate(()=>{document.querySelectorAll('.contact-band .contact-links').forEach(e=>e.remove());});
 const main=await p.$eval('main',e=>e.outerHTML);fs.writeFileSync(path.join(out,name+'.html'),shell(name,doc.head,main));
 }await browser.close();console.log('Three full patch portfolio pages authored.');})().catch(e=>{console.error(e);process.exit(1)});
