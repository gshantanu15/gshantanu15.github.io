(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const patches = [...document.querySelectorAll('[data-patch]')];
  const ns = 'http://www.w3.org/2000/svg';
  function marks(path, group, spacing, length, tilt) {
    const total = path.getTotalLength();
    const count = Math.floor(total / spacing);
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const distance = (i + .5) * total / count;
      const point = path.getPointAtLength(distance);
      const before = path.getPointAtLength(Math.max(0, distance - .5));
      const after = path.getPointAtLength(Math.min(total, distance + .5));
      const angle = Math.atan2(after.y - before.y, after.x - before.x) + tilt;
      const dx = Math.cos(angle) * length / 2, dy = Math.sin(angle) * length / 2;
      const line = document.createElementNS(ns, 'line');
      for (const [key,value] of Object.entries({x1:point.x-dx,y1:point.y-dy,x2:point.x+dx,y2:point.y+dy})) line.setAttribute(key,value);
      group.append(line); nodes.push(line);
    }
    return nodes;
  }
  const states = patches.map(patch => {
    marks(patch.querySelector('.bound-edge'), patch.querySelector('.rim-fibers'), 4, 7, Math.PI / 2 + .18);
    marks(patch.querySelector('.seam-guide'),patch.querySelector('.stitches'),9,5.6,-.12);
    const assembly = document.createElement('div');
    assembly.className = 'patch-assembly';
    assembly.setAttribute('aria-hidden', 'true');
    const front = document.createElement('div');
    front.className = 'patch-art peel-front';
    front.append(...patch.childNodes);
    const back = front.cloneNode(true);
    back.className = 'patch-art peel-back';
    back.querySelectorAll('strong, .stitches, .static-seam, .seam-guide').forEach(node => node.remove());
    assembly.append(front, back);
    patch.append(assembly);
    const edge = front.querySelector('.bound-edge');
    const edgePoints = Array.from({length:80},(_,i)=>edge.getPointAtLength(edge.getTotalLength()*i/80));
    return { patch, front, back, edgePoints, stitches: [...front.querySelectorAll('.stitches line')], progress:0, output:patch.closest('.specimen').querySelector('output') };
  });
  function paint(state, progress) {
    state.progress = progress;
    // Moving diagonal clipping and reflected backing, inspired by bsehovac's
    // Sticker Peel CSS Effect v2: https://codepen.io/bsehovac/pen/gvejKK
    const peel = Math.min(1, progress / .92);
    const angle = (46 - 8 * peel) * Math.PI / 180;
    const nx = Math.cos(angle), ny = Math.sin(angle);
    const projections = state.edgePoints.map(point => nx * point.x + ny * point.y);
    const nearEdge = Math.min(...projections) - 8;
    const farEdge = Math.max(...projections) + 8;
    const distance = nearEdge + (farEdge - nearEdge) * (.46 + .54 * peel);
    const polygon = side => {
      const rectangle = [[-10,-10],[370,-10],[370,250],[-10,250]];
      const result = [];
      for (let i=0; i<rectangle.length; i++) {
        const a=rectangle[i], b=rectangle[(i+1)%rectangle.length];
        const da=nx*a[0]+ny*a[1]-distance, db=nx*b[0]+ny*b[1]-distance;
        if (da*side<=0) result.push(a);
        if ((da<0)!==(db<0)) {
          const t=da/(da-db);
          result.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);
        }
      }
      return 'polygon('+result.map(([x,y])=> (x/3.6)+'% '+(y/2.4)+'%').join(',')+')';
    };
    state.front.style.clipPath = peel===1 ? 'none' : polygon(1);
    state.back.style.clipPath = polygon(-1);
    state.back.style.opacity = peel===1 ? '0' : '1';
    const scale = state.patch.clientWidth / 360;
    state.back.style.transform = 'matrix('+[1-2*nx*nx,-2*nx*ny,-2*nx*ny,1-2*ny*ny,2*distance*nx*scale,2*distance*ny*scale].join(',')+')';
    const sewn = Math.floor(progress * state.stitches.length);
    state.stitches.forEach((stitch,i) => {
      const x=(Number(stitch.getAttribute('x1'))+Number(stitch.getAttribute('x2')))/2;
      const y=(Number(stitch.getAttribute('y1'))+Number(stitch.getAttribute('y2')))/2;
      const landed = peel===1 || nx*x+ny*y < distance-10;
      stitch.style.opacity = i < sewn && landed ? '1' : '0';
    });
    state.patch.dataset.peel = String(peel);
    state.patch.dataset.progress = String(progress);
    state.output.value = `${Math.round(progress * 100)}%`;
  }
  states.forEach(state => state.patch.classList.add('has-stitches'));
  function resetPreference() {
    states.forEach(state => paint(state, preference.matches ? 1 : state.progress));
  }
  let previousY = scrollY, frame = 0;
  function updateScroll() {
    frame = 0;
    if (scrollY === previousY) return;
    previousY = scrollY;
    if (preference.matches) return;
    const height = innerHeight;
    states.forEach(state => {
      const rect = state.patch.getBoundingClientRect();
      // At 100%, the patch bottom is 28% above the viewport bottom.
      // Progress only changes in response to a changed document scroll position.
      const progress = Math.max(0, Math.min(1, (height - rect.top) / (rect.height + height * .28)));
      paint(state, Math.max(state.progress, progress));
    });
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateScroll); }, {passive:true});
  preference.addEventListener('change', resetPreference);
  // Resizing changes reflection distances, but never advances the sewing.
  addEventListener('resize', () => states.forEach(state => paint(state, state.progress)));
  resetPreference();
})();
