# Patch motion review: diagonal peel and sewing

This revision supersedes the half-fold/unfurl prototype. It remains a standalone component review; full portfolio and production pages are outside scope.

## Inspiration and adaptation

The reference is bsehovac's [Sticker Peel CSS Effect v2](https://codepen.io/bsehovac/pen/gvejKK). Its key idea is angled clipping with a transformed backing surface. This implementation uses newly written half-plane clipping and reflection geometry over the existing patch shapes; it does not import the Sass mixins, runtime code, hover interaction, external assets or dependencies. Source attribution is also linked in the review page.

The stationary patch face is progressively exposed by a moving diagonal boundary. The unplaced portion reflects across that boundary and shows a plain colored backing. Unlike the previous prototype, there is no fixed centre crease, hinged half, rotateX animation or 3D perspective. A modest change in peel angle as it travels gives a less mechanical application. Existing bound rims, fine edge threads and running stitches remain.

## Coordinating sewing with placement

One retained scroll-progress value drives both effects. Progress still starts at viewport entry and finishes when the patch bottom reaches 72% of viewport height. Stopping scroll freezes both effects; going back retains completed work. Neither mouse movement nor elapsed time advances anything.

The peel completes at 92% progress, leaving the final 8% to finish sewing. Stitch appearance follows the existing perimeter order but is additionally gated by placement: a stitch must be behind the peel boundary by at least ten SVG units before it can appear. This prevents the backing from carrying stitches or the seam from fastening an area that has not landed.

Each shape's actual bound-edge contour sets its peel travel extent, rather than assuming all silhouettes fill their rectangular layout box. Stable outer measurements keep reflection and clipping from feeding back into scroll progress. Resize updates the geometry at the existing progress, without advancing it.

## Fallbacks and design limits

Reduced-motion and print show complete, flat patches. The JavaScript-disabled markup retains the complete original face and static seam. Decorative duplicated artwork is hidden from assistive technology; stationary external headings identify the examples.

The peel is deliberately graphic: a reflected backing and a moving diagonal edge, not a fabric/adhesive physics simulation. No gradients or broad shadows are required. Retained slight rotations give the collection freeform placement while captions stay upright.

For the eventual portfolio, use the effect selectively. Keep long descriptions and project evidence outside the decorative surface. The 72% endpoint still needs evaluation on short landscape viewports and in the real Work grid. The scroll gaps and percentage readouts remain review-only.

## Checks

`check-motion.cjs` checks scroll-only progress, paused sewing, delayed completion after full visibility, the 72% endpoint, retained progress, reduced motion, no-JavaScript fallback and widths 320/390/768/1440.

`check-peel.cjs` captures three shapes at 18%, 35%, 65%, 88% and 100% progress, checks partial and completed peel values, verifies transforms remain unchanged during pauses and mouse movement, and checks reduced-motion and active mobile layouts. Evidence is in `review/peel-checks.json` and `review/peel-*.png`. Tests use installed Chrome through Playwright; other browser engines remain unverified.

Hallmark static lint and screenshot-render attempt are recorded in `review/motion-lint.txt`. Its renderer is unavailable because Puppeteer is not resolved; Playwright provides the actual captures. Earlier fold captures are historical artifacts and no longer represent the live example.
