# Name text review

An isolated review of **Shantanu Garg.** using the ASCIIText component source supplied by the user. The portfolio pages and their current hero remain unchanged.

## Adaptation

- Vanilla JavaScript and WebGL2; no React, packages, remote fonts, or build step.
- White background, dark glyphs, restrained chromatic accents, pointer tilt and scramble, and click/tap ripple.
- Intro runs once; Replay repeats it. Pause freezes rendering. Turning Idle drift off lets the effect settle until another interaction.
- The name wraps into two lines below 600px. The semantic heading always contains the exact text, including the period.
- Rendering is capped near 30fps and device pixel ratio 1.5, and suspended offscreen or in a hidden tab.
- Reduced motion, unavailable/lost WebGL, JavaScript disabled, and printing retain a readable HTML heading.

The source guide's React installation instructions were treated as reference material. Its glyph atlas, shader, and interaction approach were adapted to the repository's existing stack. No portfolio integration is included or implied by this demo.

## Review

Preview from the repository's existing local server:

`http://127.0.0.1:8000/prototype/name-text-demo/`

Review the name's legibility, glyph density, movement strength, and whether idle drift is desirable before integration. The surrounding controls are only for comparing the text behavior.

## Verification

Run `node prototype/name-text-demo/check-demo.cjs` with the local server running. The test uses the existing bundled Playwright and installed Chrome. It checks widths 320, 390, 788, and 1440px, pause, idle settling, keyboard ripple, reduced motion, no JavaScript, and no WebGL. Captures and results are in `review/`.
