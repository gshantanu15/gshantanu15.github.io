# Approved name integration and component review

29 October 2026. Prototype only.

## Approval

The user approved the isolated ASCII name demo: “Great implement name-text demo into protoype, record as approved.” This approves the name treatment and prototype integration. Footer improvements and portrait correction were requested in the same message and are available for review. Production and deployment remain separate gates.

`../name-text-demo/APPROVED.json` records reference/integrated script hashes. The demo is preserved. The React Bits source was user-supplied; no React, packages or build step were added.

## Hallmark pre-flight and choices

- System: DESIGN.md sections 8 and 14–16; assets/tokens.css; white, ink, Arial and approved patches.
- Audience/action: recruiters/collaborators finding work and making contact. Editorial type and restrained playful detail.
- Material: existing identity, qualification, portrait and public contacts. No invented claims or new imagery.
- Files: prototype markup, shared footer template/styles/script, Home-only ASCII engine, authoring helper, tests and notes. No production changes.
- Preserve: content, evidence, destinations, contact anchor, navigation, SVG hashes, scroll sewing and static fallbacks.
- Before: small footer identity with texture behind qualification text. After: larger identity, separate texture and equal mobile contact targets.

## Reproduction

`assets/ascii-name.js` adapts the approved demo for `[data-ascii-name]` and two-line hero sizing. Fonts/colors come from tokens.css. Canvas is decorative; the h1 contains the real name. Pause/Resume labels/pressed state track rendering. Rendering caps near 30fps and DPR 1.5 and suspends offscreen/hidden. Print/reduced motion retain HTML text. The old particle block is removed.

`footer-template.cjs` and `assets/footer.css` separate identity, contacts and an ASCII contour. Static author-time characters have pointer-local changes and no idle loop. Labels, destinations, focus states and minimum 44px targets remain. Home/About move their existing contact row into the footer; no contact copy or anchors are removed.

Portrait coordinates translate around the button center and pass through its inverse CSS transform. Local lower-right proximity controls existing clipping/reflection. One frame loop follows the target with a 35ms time constant and stops within .001 progress. Keyboard/touch toggles a .58-progress pose. Exit, Escape, blur, hide and reduced motion restore progress 1. SVG artwork and project scroll mapping stay unchanged.

`author-pages.cjs` reproduces hero hooks, Home-only script and shared footer. It is an optional authoring helper, not a build dependency.

## Verification and Hallmark audit

- `check-approved-components.cjs`: actual Chrome pointer center/corner/exit/re-entry/keyboard; ASCII rendering/pause; single contact row, targets, separate text/texture and no overflow at 320, 390, 520, 768, 788, 1024, 1280, 1440 and 1920px; reduced motion, no WebGL and no JavaScript. Pass.
- `check-components.cjs`: footer interaction, Work alternation, readability, console and fallback regressions. Updated to assert the approved ASCII treatment. Pass.
- `check-prototype.cjs`: full responsive, navigation, carousel, link and accessibility checks. Pass. Production static checks also pass.
- Before/after evidence and checks.json: `review/refinement/`. Full Home 1440px/390px captures remain in review/.
- Hallmark `sloplint --scope component --render`: **0 FAIL, 0 open REFLEX, 3 Finish warnings**. Arial is waived as the approved system face. F19 reports inherited page-wide font-weight variety; retained within this component scope. Title punctuation remains an inherited metadata note. Fifteen render screenshots produced.

Visual review: mobile/desktop footer text stays separate from texture and labels remain clear. The portrait corner responds consistently to real pointers, so removal is unnecessary. No further material is needed.

Coverage is installed Chrome. Other engines and GPU/battery benchmarking remain unverified. No deployment/publishing changes.

## 30 October feedback: current behavior

This requested revision supersedes the Pause/Resume, idle-drift and separate footer-contour descriptions above. The original approved demo remains preserved.

- Home removes the Pause button and idle drift. Intro and pointer/ripple responses remain; a stationary pointer no longer sustains rendering.
- Individual headings, paragraphs, list items, definitions, captions, disclosure summaries and isolated actions receive one 280ms translate/opacity entrance. A 65ms visible-batch stagger caps at 195ms; containing sections stay stationary. Focus, reduced motion, printing and hidden documents settle active entrances. No text splitting or layout animation.
- The footer's ASCII density gradient fills its whole background, including behind text/icons. Low-opacity ink (.16) preserves contrast; real text and links remain selectable/accessible. ResizeObserver fits rows/columns to the actual footer. Only resizing or pointer events redraw; there is no idle loop. Without JavaScript, author-time ASCII remains visible.
- The existing authoring helper reproduces the removed control and expanded footer. The prototype script hash in the approval record is updated with the explicit feedback date; reference demo hashes remain unchanged.

`check-granular-motion.cjs` verifies three routes and 320/390/768/1440/1920px; actual per-item entrances/stagger and stationary parent sections; full background coverage and target sizes; pointer-local changes without mutating labels; hero intro/interaction settling; reduced motion and no-JavaScript. Evidence: review/granular/. Footer treatment remains a requested experiment for review, not production approval.


## Prototype approval, 2 November 2026

The user approved the current prototype, including the ASCII hero without a pause control, granular content entrances and full-footer ASCII treatment. This supersedes the pending-review status of section 18. The approved source snapshot is recorded with SHA-256 hashes in prototype/patch-portfolio/APPROVED.json. Production implementation and deployment remain separate steps; no production files or publishing settings changed.
