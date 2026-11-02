# Full patch prototype validation

## Scope and results

Home, Work and About were checked at widths 320, 390, 768, 1024, 1280, 1440 and 1920px; Home was additionally checked at 844 by 390 landscape. A focused animation test checks Work at that landscape size. All three pages were checked at 200% zoom. These are representative responsive checks, not a claim to have tested every possible viewport or browser.

The matrix passes: one h1 per page, image alternatives, local resources and fragments, safe external links, no horizontal overflow, visible navigation/content without JavaScript, no autoplay media and no browser console/page errors. Mobile menu opens with aria-expanded, closes on Escape with focus restored, and closes after following a link. All three original hardware carousels advance manually with position updates, exactly one visible slide and stable media frames.

Normal HTTP motion tests pass: partial progress follows scrolling; pausing or moving the mouse does not change progress; completion is reached; focus settles a linked patch; changing to reduced motion produces finished static artwork; short-screen completion remains reachable. An intersection/scroll ordering issue discovered during landscape testing was fixed: when a prepared patch becomes visible after recognized scrolling, its state catches up to that same scroll position. It does not create a time-driven tail.

Chrome was used through bundled Playwright and Hallmark's Puppeteer renderer. Other browser engines have not been certified. No Lighthouse, battery or CPU benchmark score is claimed.

## Hallmark review

Browser render audit completed successfully and produced 15 captures across 1280/1440/1920 folds plus full desktop/mobile pages. Final result: **0 FAIL, 0 open REFLEX**, 5 advisory warnings, recorded approved-system waivers and retained-copy notes.

Reviewed warnings: the outlined secondary hero action is incorrectly classified as a second filled button; body/display/caption weights support the approved hierarchy; column gaps differ between the portrait hero, project/evidence layouts and long editorial records. These warnings do not correspond to visual defects in the inspected captures.

Waivers document the user's white paper surface and approved illustrated patches; compact identity/index heroes; ruled editorial density; real biography and two leadership roles without invented filler; and zero-sized headings inside native closed details. Long retained prose is recorded as copy material rather than cut to satisfy landing-page word counts. All substantive text remains available through normal HTML and native disclosure controls.

Independent fresh-context hero review: **ship**, no fixes. Independent full finish review: **ship**, no usability, privacy, evidence or responsive blockers. Neither reviewer requested changes to the approved patch artwork.

## Content and behavior differences from root

- Home biography paragraph moves from the hero into a stationary section, preserving its wording. Selected Work heading is made literal. The root hero portrait is replaced by the user-approved Graduate 2026 patch.
- Approved patches replace earlier invented interface/flow illustrations; project text and evidence stay outside the artwork.
- Demola's Home summary and Work story are narrowed to Tripo3D integration, manual end-to-end testing, teamwork and delivery. Personal Vuforia/Unity implementation claims and customer-response wording are removed. Its approved patch includes the user-requested Unity text reference as a project cue, not a claim of individual responsibility.
- The SDG activity sentence is held back because `docs/site-content.md` explicitly marks its exact wording as awaiting confirmation. Fairtrade, service and exchange remain.
- Existing Satellites comparison numbers and device qualification are retained because `docs/qa-report.md` records the three comparable local runs and pixel checks. The source and executable remain unpublished.
- Voice provider distinctions, consented evaluation, media download fallback, public repositories, thesis link, fork attribution and course/starter-code attribution are retained.
- Full project contribution details move into native details/summary controls. Existing project IDs, About thesis/contact anchors and all original hardware image/carousel hooks remain.
- Redundant eyebrow/ordinal labels, decorative arrows and middle-dot metadata separators are removed or converted to ordinary punctuation. Visible Previous/Next controls retain explicit accessible names. No facts are created by those presentation edits.
- Automatic Home video looping is replaced with a patch linking to the real, user-controlled Work video. This implements the requested restrained performance approach.

Production static validation (`node scripts/check-site.mjs`) still passes. Root pages and production assets have no diff. No branch push, deployment or publishing configuration change was performed.

## Evidence

- `review/index-1440.png`, `review/index-390.png`
- `review/work-1440.png`, `review/work-390.png`
- `review/about-1440.png`, `review/about-390.png`
- `review/work-peel-partial.png`, `review/motion-checks.json`
- `review/before-index.png`, `review/before-work.png`, `review/before-about.png`
- `review/hallmark.txt`; `compare.html` for before/after viewing

Preliminary `first-*` screenshots are diagnostic captures, not final review evidence. Approved patch hashes match the saved baseline. Source and QA changes are saved separately from the original design snapshot.

## Annotated component revision

The full responsive checker and focused scroll/zoom checker pass after this revision. `check-components.cjs` additionally passes portrait pointer/keyboard behavior, particle completion, footer scrambling/restoration, six-row mobile ordering, no-JavaScript/reduced-motion fallbacks, page errors and overflow at 320/390/788/1440px. Captures decode lazy images before saving. See review/component-checks.json, component-footer-*.png, component-home-hero-788.png, component-home-particles.png and component-home-portrait.png. The current Hallmark report is review/components-hallmark.txt: 0 FAIL, 0 open REFLEX. Independent footer/component audit returned ship, no fixes.

## Approved ASCII name and responsive component correction

User-approved ASCII name replaces particles on prototype Home. Approval/hashes: ../name-text-demo/APPROVED.json. The footer now has one shared contact row and separate ASCII contour, with no text overlap. Portrait hover uses real rotated coordinates and one frame loop.

Full prototype and existing component checks pass; the focused refinement checker covers 320–1920px, actual corner hover/restore/re-entry/keyboard, name pause, contact targets, fallbacks and overflow. Seven approved SVG hashes still match. Hallmark's component render audit produced 15 captures with 0 FAIL and 0 open REFLEX. Three inherited F19 font-weight Finish advisories are recorded without changing the approved page typography. Details: APPROVED-NAME-INTEGRATION.md; evidence: review/refinement/.

## 30 October granular motion and footer experiment

The hero pause control is removed; its idle loop and stationary-pointer loop are disabled. Content now enters by individual item, once, with a bounded stagger, rather than by whole section. The monochrome ASCII density field spans the entire footer behind real text and links. Focused three-route checks at 320/390/768/1440/1920px pass, including bounded hero rendering, reduced motion, no-JavaScript, coverage and overflow. Evidence: review/granular/checks.json and footer/entrance captures. Existing component/full-prototype regressions are rerun for this revision.
