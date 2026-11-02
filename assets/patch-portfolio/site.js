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
    let animation = 0, held = false, target = 1, last = 0;
    const box=state.box;
    box.disabled=false;
    function move(to) {
      if(preference.matches) { paint(state,1); return; }
      target=to;
      if(animation)return;
      last=performance.now();
      function step(now) {
        animation=0;
        const follow=1-Math.exp(-Math.min(now-last,50)/35);last=now;
        const next=state.progress+(target-state.progress)*follow;
        paint(state,Math.abs(target-next)<.001?target:next);
        if(state.progress!==target && !document.hidden) animation=requestAnimationFrame(step);
      }
      animation=requestAnimationFrame(step);
    }
    box.addEventListener('pointermove',event=>{
      if(held || event.pointerType==='touch' || preference.matches) return;
      // Invert the patch rotation: its screen bounding box is not its local corner.
      const rect=box.getBoundingClientRect(),matrix=new DOMMatrix(getComputedStyle(box).transform).inverse();
      const point=new DOMPoint(event.clientX-rect.left-rect.width/2,event.clientY-rect.top-rect.height/2).matrixTransform(matrix);
      const x=point.x+box.offsetWidth/2,y=point.y+box.offsetHeight/2;
      const proximity=clamp(1-((box.offsetWidth-x)+(box.offsetHeight-y))/(Math.min(box.offsetWidth,box.offsetHeight)*.65));
      move(1-.42*proximity);
    });
    box.addEventListener('pointerleave',()=>{if(!held)move(1);});
    box.addEventListener('click',()=>{if(preference.matches)return;held=!held;box.setAttribute('aria-pressed',String(held));move(held ? .58 : 1);});
    box.addEventListener('blur',()=>{held=false;box.setAttribute('aria-pressed','false');move(1);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){held=false;box.setAttribute('aria-pressed','false');move(1);}});
    preference.addEventListener('change',()=>{cancelAnimationFrame(animation);animation=0;target=1;held=false;box.disabled=preference.matches;box.setAttribute('aria-pressed','false');paint(state,1);});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(animation);animation=0;target=1;held=false;box.setAttribute('aria-pressed','false');paint(state,1);}});
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
/* Stagger individual reading items once; their parent sections stay still. */
(() => {
  if(!('IntersectionObserver' in window) || typeof Element.prototype.animate!=='function')return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const active=new Set();
  const selector='h2,h3,h4,p,dt,dd,li,figcaption,summary,a.text-link,.section-action,.hardware-controls';
  const targets=[...document.querySelectorAll('main '+selector.split(',').join(',main '))].filter(target=>!target.closest('.hero,.project-jump')&&!target.parentElement.closest(selector));
  const observer=new IntersectionObserver(entries=>entries.filter(entry=>entry.isIntersecting).forEach((entry,index)=>{
    if(!entry.isIntersecting)return;
    observer.unobserve(entry.target);
    if(preference.matches)return;
    const animation=entry.target.animate([{transform:'translateY(18px)',opacity:.45},{transform:'none',opacity:1}],{duration:280,delay:Math.min(index,3)*65,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
    active.add(animation);animation.finished.then(()=>active.delete(animation)).catch(()=>active.delete(animation));
  }),{threshold:.15,rootMargin:'0px 0px -20px 0px'});
  targets.forEach(target=>{target.dataset.contentEntrance='';observer.observe(target);});
  function settle(){active.forEach(a=>a.cancel());active.clear();}
  preference.addEventListener('change',()=>{if(preference.matches)settle();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
  addEventListener('beforeprint',settle);
  document.addEventListener('focusin',event=>active.forEach(animation=>{if(animation.effect.target.contains(event.target)){animation.cancel();active.delete(animation);}}));
})();
/* Fit the static ASCII density gradient to the footer; no idle render loop. */
(() => {
  const footer=document.querySelector('.ascii-footer'),field=footer?.querySelector('pre');
  if(!field)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)'),ramp=' .:-=+*#';
  let original=field.textContent,rows=original.split('\n'),columns=270,pending=0,point=null;
  function fit(){
    cancelAnimationFrame(pending);pending=0;
    const style=getComputedStyle(field),context=document.createElement('canvas').getContext('2d');
    if(!context)return;
    context.font=style.font;
    columns=Math.ceil(footer.clientWidth/Math.max(1,context.measureText('M').width));
    const height=Math.ceil(footer.clientHeight/parseFloat(style.lineHeight));
    rows=Array.from({length:height},(_,y)=>Array.from({length:columns},(_,x)=>{
      const u=x/Math.max(1,columns-1),v=y/Math.max(1,height-1);
      const density=.08+.48*u+.26*v+.18*(.5+.5*Math.sin(u*Math.PI*2+v*3));
      return ramp[Math.min(ramp.length-1,Math.floor(density*7))];
    }).join('').trimEnd());
    original=rows.join('\n');field.textContent=original;
  }
  fit();
  if('ResizeObserver' in window){const observer=new ResizeObserver(fit);observer.observe(footer);addEventListener('pagehide',()=>observer.disconnect(),{once:true});}
  footer.addEventListener('pointermove',event=>{
    if(preference.matches || event.pointerType==='touch')return;
    const r=field.getBoundingClientRect();point={x:(event.clientX-r.left)/r.width*columns,y:(event.clientY-r.top)/r.height*rows.length};
    if(pending)return;
    pending=requestAnimationFrame(()=>{pending=0;field.textContent=rows.map((row,y)=>[...row].map((char,x)=>Math.hypot(x-point.x,(y-point.y)*2)<7?ramp[(x+y+Math.floor(point.x))%ramp.length]:char).join('')).join('\n');});
  });
  function restore(){cancelAnimationFrame(pending);pending=0;field.textContent=original;}
  footer.addEventListener('pointerleave',restore);preference.addEventListener('change',restore);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)restore();});
})();
