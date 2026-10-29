document.documentElement.classList.add('js');
const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.site-nav');
function closeMenu(restoreFocus = false) {
  if (!toggle || !navigation) return;
  toggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (restoreFocus) toggle.focus();
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation?.classList.contains('is-open')) closeMenu(true); });
window.addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); });
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const current = carousel.querySelector('[data-carousel-current]');
  const controls = carousel.querySelector('.hardware-controls');
  if (slides.length < 2 || !previous || !next || !current || !controls) return;
  let active = 0;
  controls.hidden = false;
  function show(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide,i) => { slide.hidden = i !== active; });
    current.textContent = String(active + 1);
  }
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
});
// Approved peel: reflected backing and landed-stitch gating, inspired by
// https://codepen.io/bsehovac/pen/gvejKK. Progress comes only from scrolling.
(() => {
  if (!('IntersectionObserver' in window) || location.protocol === 'file:') return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const frames = [...document.querySelectorAll('[data-patch-source]')];
  const states = new Map();
  const loading = new Set();
  let serial = 0, previousY = scrollY, frameRequest = 0;
  const clamp = value => Math.max(0, Math.min(1,value));
  function namespace(svg, prefix) {
    svg.querySelectorAll('[id]').forEach(node => {
      const old = node.id;
      svg.querySelectorAll('[clip-path]').forEach(e => { if (e.getAttribute('clip-path') === `url(#${old})`) e.setAttribute('clip-path',`url(#${prefix}${old})`); });
      node.id = prefix + old;
    });
    svg.removeAttribute('aria-labelledby');
    svg.setAttribute('aria-hidden','true');
  }
  function paint(state, progress) {
    const { box,front,back,width,height,points,stitches } = state;
    state.progress = progress;
    const peel = Math.min(1, progress / .92);
    const angle = (46 - 8 * peel) * Math.PI / 180;
    const nx = Math.cos(angle), ny = Math.sin(angle);
    const projections = points.map(point => nx * point.x + ny * point.y);
    const near = Math.min(...projections) - 8;
    const far = Math.max(...projections) + 8;
    const distance = near + (far - near) * (.46 + .54 * peel);
    function polygon(side) {
      const rect=[[-10,-10],[width+10,-10],[width+10,height+10],[-10,height+10]], result=[];
      for(let i=0;i<4;i++) {
        const a=rect[i],b=rect[(i+1)%4],da=nx*a[0]+ny*a[1]-distance,db=nx*b[0]+ny*b[1]-distance;
        if(da*side<=0) result.push(a);
        if((da<0)!==(db<0)) { const t=da/(da-db); result.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]); }
      }
      return 'polygon('+result.map(([x,y])=>`${x/width*100}% ${y/height*100}%`).join(',')+')';
    }
    front.style.clipPath = peel === 1 ? 'none' : polygon(1);
    back.style.clipPath = polygon(-1);
    back.style.opacity = peel === 1 ? '0' : '1';
    const scale=box.clientWidth/width;
    back.style.transform='matrix('+[1-2*nx*nx,-2*nx*ny,-2*nx*ny,1-2*ny*ny,2*distance*nx*scale,2*distance*ny*scale].join(',')+')';
    const sewn = Math.floor(progress * stitches.length);
    stitches.forEach(({node,x,y,visible},i) => {
      const show=state.portrait || (i<sewn && (peel===1 || nx*x+ny*y<distance-10));
      if(show!==visible) { node.style.opacity=show?'1':'0'; stitches[i].visible=show; }
    });
    box.dataset.progress=String(progress);
  }
  function finish(state) { paint(state,1); }
  async function enhance(box) {
    if (states.has(box) || loading.has(box) || preference.matches) return;
    loading.add(box);
    try {
      const response=await fetch(box.dataset.patchSource);
      if(!response.ok) return;
      const parsed=new DOMParser().parseFromString(await response.text(),'image/svg+xml');
      const svg=parsed.documentElement;
      if(svg.localName!=='svg' || parsed.querySelector('parsererror') || preference.matches) return;
      const width=svg.viewBox.baseVal.width,height=svg.viewBox.baseVal.height;
      const assembly=document.createElement('div');assembly.className='patch-assembly';assembly.setAttribute('aria-hidden','true');
      const front=document.createElement('div');front.className='patch-front';
      const back=document.createElement('div');back.className='patch-back';
      const frontSVG=document.importNode(svg,true),backSVG=document.importNode(svg,true);
      const edge=frontSVG.querySelector('#edge');
      const prefix='patch-'+(++serial)+'-';namespace(frontSVG,prefix+'front-');namespace(backSVG,prefix+'back-');
      [...backSVG.children].forEach(node=>{if(node.localName!=='style' && !node.matches('.face,.rim') && !node.id.endsWith('fibers')) node.remove();});
      backSVG.style.setProperty('--face','var(--backing)');
      front.append(frontSVG);back.append(backSVG);assembly.append(front,back);box.append(assembly);
      const length=edge.getTotalLength();
      const points=Array.from({length:80},(_,i)=>edge.getPointAtLength(length*i/80));
      const stitches=[...frontSVG.querySelectorAll('.stitch')].map(node=>({node,x:(Number(node.getAttribute('x1'))+Number(node.getAttribute('x2')))/2,y:(Number(node.getAttribute('y1'))+Number(node.getAttribute('y2')))/2,visible:true}));
      const state={box,front,back,width,height,points,stitches,progress:0,visible:true,portrait:box.hasAttribute('data-portrait-peel')};
      states.set(box,state);
      // 640 by 420 artwork uses the same physical scroll strategy as the study.
      paint(state, state.portrait ? 1 : box.dataset.seenScroll==='true' ? candidate(box) : 0);
      box.classList.add('patch-enhanced');
      if(state.portrait) setupPortrait(state); else visibility.observe(box);
      const link=box.closest('a');
      link?.addEventListener('focus',()=>finish(state));
      link?.addEventListener('pointerdown',()=>finish(state));
    } catch {
      box.querySelector('.patch-assembly')?.remove();box.classList.remove('patch-enhanced');states.delete(box);
    } finally { loading.delete(box); }
  }
  function setupPortrait(state) {
    let animation = 0, held = false;
    const box=state.box;
    box.disabled=false;
    function move(to) {
      cancelAnimationFrame(animation);
      if(preference.matches) { paint(state,1); return; }
      const from=state.progress, start=performance.now();
      function step(now) {
        const t=Math.min(1,(now-start)/180), eased=1-Math.pow(1-t,3);
        paint(state,from+(to-from)*eased);
        if(t<1 && !document.hidden) animation=requestAnimationFrame(step);
      }
      animation=requestAnimationFrame(step);
    }
    box.addEventListener('pointermove',event=>{
      if(held || event.pointerType==='touch' || preference.matches) return;
      const rect=box.getBoundingClientRect();
      const distance=Math.hypot(rect.right-event.clientX,rect.bottom-event.clientY);
      move(distance<150 ? .76+.2*distance/150 : 1);
    });
    box.addEventListener('pointerleave',()=>{if(!held)move(1);});
    box.addEventListener('click',()=>{if(preference.matches)return;held=!held;box.setAttribute('aria-pressed',String(held));move(held ? .74 : 1);});
    box.addEventListener('blur',()=>{held=false;box.setAttribute('aria-pressed','false');move(1);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){held=false;box.setAttribute('aria-pressed','false');move(1);}});
    preference.addEventListener('change',()=>{cancelAnimationFrame(animation);held=false;box.disabled=preference.matches;box.setAttribute('aria-pressed','false');paint(state,1);});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(animation);paint(state,1);}});
  }
  function candidate(box) {
    const rect=box.getBoundingClientRect();
    // For short screens, use the reachable lower endpoint; no pinning or extra scroll.
    const endBottom=Math.max(innerHeight*.72, Math.min(rect.height+16,innerHeight));
    return clamp((innerHeight-rect.top)/(rect.height+innerHeight-endBottom));
  }
  const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{const state=states.get(entry.target);if(state) { state.visible=entry.isIntersecting; if(!state.portrait && state.visible && entry.target.dataset.seenScroll==='true' && !preference.matches) paint(state,Math.max(state.progress,candidate(state.box))); }}),{rootMargin:'80px'});
  const loader=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting) enhance(entry.target);}),{rootMargin:'320px'});
  frames.forEach(box=>loader.observe(box));
  function update() {
    frameRequest=0;
    if(scrollY===previousY) return;
    previousY=scrollY;
    if(preference.matches) return;
    frames.forEach(box=>{box.dataset.seenScroll='true';});
    states.forEach(state=>{if(!state.portrait && state.visible && state.progress<1) paint(state,Math.max(state.progress,candidate(state.box)));});
  }
  addEventListener('scroll',()=>{if(!frameRequest) frameRequest=requestAnimationFrame(update);},{passive:true});
  addEventListener('resize',()=>states.forEach(state=>paint(state,state.progress)));
  preference.addEventListener('change',()=>{if(preference.matches)states.forEach(finish);else frames.forEach(enhance);});
  addEventListener('beforeprint',()=>states.forEach(finish));
})();
/* Brief, one-shot introductions. Resting HTML is always fully visible. */
(() => {
  if(!('IntersectionObserver' in window) || typeof Element.prototype.animate!=='function')return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const active=new Set();
  const targets=document.querySelectorAll('.bio-note,.section-heading,.timeline-preview article,.education-layout,.contact-inner,.about-hero-copy,.about-at-glance,.experience-entry,.education-summary,.thesis-card,.leadership-grid article,.activity-panel,.hardware-heading,.hardware-card,.case-heading,.voice-demo,.case-image,.satellites-demo,.case-footer,.project-story');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    observer.unobserve(entry.target);
    if(preference.matches)return;
    const animation=entry.target.animate([{transform:'translateY(10px)',opacity:.72},{transform:'none',opacity:1}],{duration:180,easing:'cubic-bezier(.2,0,0,1)'});
    active.add(animation);animation.finished.then(()=>active.delete(animation)).catch(()=>active.delete(animation));
  }),{threshold:.12});
  targets.forEach(target=>observer.observe(target));
  function settle(){active.forEach(a=>a.cancel());active.clear();}
  preference.addEventListener('change',()=>{if(preference.matches)settle();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
  addEventListener('beforeprint',settle);
})();
/* Particle-letter treatment: a short assembly, then real HTML text at rest. */
(() => {
  const heading=document.querySelector('.hero-name');
  if(!heading)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches || !document.createElement('canvas').getContext('2d'))return;
  const label=document.createElement('span');label.className='hero-name-text';label.textContent=heading.textContent;heading.replaceChildren(label);
  const canvas=document.createElement('canvas');canvas.className='hero-particles';canvas.setAttribute('aria-hidden','true');heading.append(canvas);
  let points=[],animation=0,start=0,pointer=null;
  const context=canvas.getContext('2d');
  function sample(){
    const rect=heading.getBoundingClientRect(),style=getComputedStyle(heading);
    const mask=document.createElement('canvas');mask.width=Math.ceil(rect.width);mask.height=Math.ceil(rect.height);
    canvas.width=mask.width;canvas.height=mask.height;
    const ink=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
    const c=mask.getContext('2d');c.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;c.fillStyle=ink;c.textBaseline='top';
    const node=label.firstChild;if(!node)return;
    for(let i=0;i<node.length;i++){
      const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const r=range.getBoundingClientRect();
      c.fillText(node.textContent[i],r.left-rect.left,r.top-rect.top+Number.parseFloat(style.fontSize)*.1);
    }
    const pixels=c.getImageData(0,0,mask.width,mask.height).data;
    points=[];const step=innerWidth<600?5:4;
    for(let y=0;y<mask.height;y+=step)for(let x=0;x<mask.width;x+=step)if(pixels[(y*mask.width+x)*4+3]>120){
      const seed=Math.sin(x*12.9898+y*78.233)*43758.5453;points.push({x,y,dx:(seed%1)*32,dy:Math.cos(seed)*22});
    }
    // Bound canvas work independently of heading size or pixel density.
    if(points.length>1800)points=points.filter((_,i)=>i%Math.ceil(points.length/1800)===0);
    context.fillStyle=ink;
  }
  function finish(){cancelAnimationFrame(animation);animation=0;context.clearRect(0,0,canvas.width,canvas.height);heading.classList.remove('particle-active');}
  function draw(now){
    if(preference.matches || document.hidden){finish();return;}
    const progress=Math.min(1,(now-start)/800),strength=1-progress;
    context.clearRect(0,0,canvas.width,canvas.height);
    for(const point of points){
      let x=point.x+point.dx*strength,y=point.y+point.dy*strength;
      if(pointer){const dx=point.x-pointer.x,dy=point.y-pointer.y,d=Math.hypot(dx,dy);if(d<90&&d>0){x+=dx/d*(90-d)*.35*strength;y+=dy/d*(90-d)*.35*strength;}}
      context.globalAlpha=progress>.8?(1-progress)/.2:1;context.fillRect(x,y,2,2);
    }
    if(progress<1)animation=requestAnimationFrame(draw);else finish();
  }
  function play(position=null){if(preference.matches)return;pointer=position;start=performance.now();heading.classList.add('particle-active');if(!animation)animation=requestAnimationFrame(draw);}
  sample();play();
  heading.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const r=heading.getBoundingClientRect();play({x:event.clientX-r.left,y:event.clientY-r.top});});
  heading.addEventListener('pointerleave',()=>{pointer=null;});
  preference.addEventListener('change',()=>{if(preference.matches)finish();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
  addEventListener('resize',()=>{finish();sample();});addEventListener('beforeprint',finish);
})();
/* ASCII responds only to pointer events; no background render loop. */
(() => {
  const footer=document.querySelector('.ascii-footer'),field=footer?.querySelector('pre');
  if(!field)return;
  const original=field.textContent,rows=original.split('\n'),preference=matchMedia('(prefers-reduced-motion: reduce)');
  let pending=0,point=null;
  footer.addEventListener('pointermove',event=>{
    if(preference.matches || event.pointerType==='touch')return;
    const r=field.getBoundingClientRect();point={x:(event.clientX-r.left)/r.width*rows[0].length,y:(event.clientY-r.top)/r.height*rows.length};
    if(pending)return;
    pending=requestAnimationFrame(()=>{pending=0;const ramp=' .:-=+*#';field.textContent=rows.map((row,y)=>[...row].map((char,x)=>Math.hypot(x-point.x,(y-point.y)*2)<7?ramp[(x+y+Math.floor(point.x))%ramp.length]:char).join('')).join('\n');});
  });
  function restore(){cancelAnimationFrame(pending);pending=0;field.textContent=original;}
  footer.addEventListener('pointerleave',restore);preference.addEventListener('change',restore);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)restore();});
})();
