# Reproducing the approved motion direction

The user accepted the diagonal peel/sewing direction before requesting individual patch artwork. This records that direction; it does not approve portfolio content or production deployment.

## Files and behavior

- `motion.html`: three isolated motion specimens with stable outer boxes.
- `motion.css`: shared patch tokens, rim/thread treatments, slightly rotated assembly, front/back layers and static fallbacks.
- `motion.js`: SVG thread generation, scroll progress, diagonal clipping, reflected backing and landed-stitch gating.
- `check-motion.cjs`, `check-peel.cjs`: behavioral checks and sampled screenshots.
- `MOTION-AUDIT.md`: rationale, CodePen attribution, constraints and evidence.

The original half-fold and `rotateX` hinge were discarded. Do not reproduce them from old `fold-*` screenshots. The reference for the replacement is [bsehovac's Sticker Peel CSS Effect v2](https://codepen.io/bsehovac/pen/gvejKK). The implementation is newly written geometry inspired by its clipped front/reflected back approach; it has no imported library or hover trigger.

## Exact progress mapping

Let `H` be viewport height, `t` the top of the stable patch box, and `h` its height, all in CSS pixels:

`candidate = clamp((H - t) / (h + 0.28 * H), 0, 1)`

`progress = max(previousProgress, candidate)`

Update only when `scrollY` changes, using a passive scroll listener coalesced into one animation frame. This is not an animation loop. It has no duration, autoplay, momentum tail or mouse/pointer activation. Completed work stays in place while scrolling backward. Resize repaints at existing progress rather than advancing it. At completion, the patch bottom is at `0.72 * H`; first full visibility alone does not finish sewing.

## Peel geometry

- Coordinates: SVG design space 360 by 240.
- `peel = min(1, progress / 0.92)`.
- Peel normal angle in radians: `(46 - 8 * peel) * PI / 180`.
- Normal vector: `n = (cos(angle), sin(angle))`.
- Sample 80 points from the actual bound-edge path. Project each onto `n`; subtract/add 8 units from their minimum/maximum to include the rim.
- Boundary distance: `d = near + (far - near) * (0.46 + 0.54 * peel)`.
- Clip the front to `dot(n, point) <= d` and the back to the opposite half-plane, using a rectangle extending from (-10, -10) to (370, 250).
- Reflect the backing through that line. CSS matrix coefficients are `1-2nx², -2nxny, -2nxny, 1-2ny², 2dnx*s, 2dny*s`, where `s = renderedPatchWidth / 360`.
- Keep the backing plain and color-matched; remove the title, guide and stitches from its duplicate. At `peel == 1`, expose the whole front and hide the back.
- Resting rotations: Voice -2 degrees, Demola +1.5 degrees, Satellites -1 degree. These affect the artwork, not the box used to measure scroll progress.

## Stitch construction and synchronization

The static bound rim represents the manufactured patch. It remains complete throughout. The inset seam represents attachment to the page.

The motion sample generates rim fibers every approximately 4 SVG units, length 7, tangent angle plus `PI/2 + 0.18`; inset stitches approximately every 9 units, length 5.6, tangent angle minus 0.12 radians. Both are line segments with rounded caps, derived from the original contour rather than a dashed rectangle.

For stitch index `i` among `N` stitches, expose it only if `i < floor(progress * N)` **and** its midpoint lies behind the peel boundary by at least 10 SVG units. At full peel, bypass the spatial gate. This prevents sewing a raised region. The peel is flat at 92%; the final 8% of scroll finishes the seam.

## Fallbacks, limits and future artwork integration

Reduced motion and printing show the fully placed and sewn patch. Without JavaScript the original full SVG/HTML and static seam remain visible. Moving duplicate faces are decorative; external headings provide readable names throughout.

The endpoint assumes a patch can fit inside the upper 72% of the viewport. Review short landscape screens before applying it to a real portfolio grid. Avoid enormous patches or a minimum-height requirement that makes full visibility impossible.

The new individual SVG artwork is **not yet wired into this motion example**. It uses a 640 by 420 coordinate space, so an eventual adapter must preserve the artwork's aspect ratio and scale the normal, contour, margin, reflection and stitch constants accordingly. Do not paste 360 by 240 geometry over it unchanged. Logo/portrait/image areas belong in the front only; the backing remains blank. Keep caption and attribution outside the animated artwork.

Run from the repository root: `node prototype/patch-study/check-motion.cjs` and `node prototype/patch-study/check-peel.cjs`. Current authoring checks use bundled Playwright and installed Chrome paths recorded in those scripts. The public examples need only HTML, CSS and vanilla JavaScript, with no build or dependencies.

## Full prototype integration

The approved artwork is now integrated into prototype/patch-portfolio/. Its shared script reads each original SVG viewBox (640 by 420), uses actual edge/stitch geometry, and namespaces SVG IDs for repeated front/back layers. Static image markup is preserved until successful enhancement. The portrait remains static. The short-screen endpoint uses `max(0.72*H, min(patchHeight+16, H))` for the target bottom; ordinary screens retain the original 72% endpoint. A visible-entry callback catches up only after recognized scrolling, avoiding missed updates while assets are prepared. See the new prototype README and QA report for performance and keyboard behavior. The isolated study remains the reproduction reference rather than the full-site runtime.
