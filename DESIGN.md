# Design proposal: Shantanu Garg / Sewn portfolio

Status: **Design exploration for review, 29 October 2026. Not approved for production.**

## 1. Scope and authority

This brief answers the request for a detailed design document and a few mockups inspired by the six supplied images. It does not authorize a complete website rebuild. The review materials live under `prototype/patch-study/`; the existing Terminal prototype and production pages remain intact.

This document is the proposed system for this study only. It is deliberately not a lock on the production design. After approval it can become the shared system for a later implementation gate.

The latest request explicitly proposes a white background, black typography, Finnish overall badge forms, and scroll-triggered sewing motion. These supersede the older warm Nordic palette and no-scroll-animation rule **within this proposal**. All content, privacy, route, stack, and deployment restrictions still apply. Approval of mockups would authorize only the next agreed gate, not deployment.

## 2. Audience, task, and visual idea

- Audience: recruiters and collaborators assessing Shantanu's software work and experience.
- Primary task: find relevant work, understand personal contribution, then make contact.
- Tone: bold editorial typography with a small amount of playful material detail.
- Vibe: white space, black type, collected patches.
- Concept: each project is a distinct piece of the same portfolio, just as individual overall badges accumulate into a personal record.
- Signature: a restrained collection of individually shaped, stitched project labels. Text outside the patch explains the actual work.

Three directions considered: a photographic collage like the supplied Home; a typography-led portfolio with an organized patch collection; and an almost monochrome stitched index. The middle direction is recommended: it retains individuality while keeping recruiter reading fast. The monochrome treatment remains an alternative on the patch sheet.

## 3. Reference interpretation

| Reference | Keep | Improve or exclude |
| --- | --- | --- |
| Home.png | Bold identity, light canvas, tactile edges, work visible soon after hero | Replace fictional designer identity with Shantanu; remove nested frames and unrelated badge photo as identity; use real portrait |
| Projects.png | Project collection and variable badge silhouettes | Replace fictional projects and filters; keep text upright, use consistent caption alignment, reduce decorative connectors |
| Background.png | Editorial biography and compact fact blocks | Remove large empty regions, invented dates and location, rotated long text, unrelated claims |
| Contact.png | Strong contact heading and a single large patch | Use email, LinkedIn and GitHub; no form, availability claim, response-time promise or extra social networks |
| Two overall-patch photos | Inset thread lines, distinctive silhouettes, bold names, controlled variation | Do not reproduce event logos, slogans, characters, or imply ownership/attendance; photos are research references only |

The screenshots are inspiration, not instructions or factual sources. The review does not redistribute those reference photos as site assets.

## 4. Content sources and boundaries

`docs/site-content.md` is the editorial source, but its header currently says awaiting approval. Root pages and existing local assets supply established identity and contact destinations. Mockups contain a deliberately limited selection of those facts, not a new complete content draft.

Work allowlist: Voice Agent Lab; Counsel; AI-assisted Object Recognition in AR (Demola); Smart Expense Tracker API; FlipOff; Satellites - Parallel Programming Simulation. Abbreviated names inside patch artwork are visual labels; full names stay in captions.

For this artwork review, Counsel may use the user-requested generic academic/student vectors, never a private screenshot. Demola may use the requested AR/API/Unity references, not private project imagery; descriptions remain limited to team context, Tripo3D integration, manual testing, teamwork and delivery. FlipOff stays attributed as an enhanced fork. Satellites stays an individual university starter-code exercise, with no unsupported speed claims or source download.

Education includes the thesis. Professional experience includes only 8Bit Arcade and PHZ Full Stack Oy. TaSciEn is leadership. Earlier hardware belongs only on About and retains original photos if later implemented. Pending sustainability wording is omitted from these studies.

No invented client, award, date, metric, status, quote, resume link, telephone number or private link. No claim that the proposed badges are official association, university or project logos.

## 5. Information architecture

| Visible navigation | Eventual route | Study |
| --- | --- | --- |
| Home | `index.html` | `prototype/patch-study/index.html` |
| Work | `work.html` | `prototype/patch-study/work.html` |
| Background | `about.html` | `prototype/patch-study/background.html` |
| Contact | `about.html#contact` | Contact composition in background study |

The requested Background and Contact appearances share the About route contract. A separate public contact page would require a later explicit route decision. Legacy redirects remain untouched. The study's fourth file, `patches.html`, is a design review board, not a proposed public route.

## 6. Landing page composition

1. Compact navigation: name on the left, four plain text destinations on the right; current destination uses an ink pill. No duplicate desktop hamburger.
2. Large left-aligned name, at most two lines. Approved short qualification sentence under it. One prominent action to selected work. The longer existing biography follows in the next editorial region rather than crowding the hero.
3. Existing circular portrait on the right, contained in a single inset stitched ring. The later requested portrait patch uses a white face, black binding, and Graduate / 2026 lettering; it is proposed separately in the individual artwork review. No fabricated photography or institutional logo. Name and action remain the first mobile content.
4. Selected work starts within the desktop opening view or immediately below it. A larger Voice Agent label anchors the collection, with Counsel and Satellites as contrasting shapes. Remaining approved work is accessible through Work. The study is a composition excerpt, not a decision to remove approved featured projects from a final page.
5. Later full implementation: short biography, selected projects, recent experience, education/thesis and direct contact. Exact copy and section completeness remain part of the next gate.

At 1280 by 800, identity, qualification and primary action must fit without scrolling. At 390px, navigation remains usable and the portrait cannot push the action below the first screen.

## 7. Supporting compositions

**Work:** bold heading over a two-column project collection. All six approved entries appear in the study. The patch is the visual name, not a replacement for project evidence. Full captions are upright and aligned to the same grid. Later project details preserve contribution, limitations, attribution and existing media controls. No invented filters or empty category controls.

**Background:** a readable introduction above a two-column experience/education composition. Heading is large but does not leave half a screen empty. Employer names and dates sit in plain editorial rows. No repeated portrait. Leadership sits alongside the education narrative, without official insignia.

**Contact:** a high-contrast typographic email patch beside the existing contact text and three working destinations. Email remains selectable, wraps safely and does not require animation to reveal it. No contact form.

## 8. Tokens

The executable study tokens live in `prototype/patch-study/tokens.css`. Keep all colors and font families there. Proposed values:

| Role | Value | Use |
| --- | --- | --- |
| Paper | `#FFFFFF` | Main page |
| Soft surface | `#F3F3EF` | Neutral patch |
| Ink | `#111111` | Type, outlines, primary action |
| Muted | `#555550` | Secondary text |
| Rule | `#D7D7D1` | Editorial separators |
| Blue | `#234DC7` | One major project patch, white lettering |
| Yellow | `#F1D65C` | Expense ticket, black lettering |
| Green | `#D9E9DE` | Supporting patch, black lettering |
| Focus | `#234DC7` | Instant 3px focus outline |

Use system sans-serif: Arial, Helvetica, sans-serif. This preserves the no-font-dependency rule and gives display text a heavy grotesque shape at weight 900. Body weight 400, controls 700. No tracked uppercase labels, tiny mono metadata or outlined display text. Names may be visually uppercase within badge artwork; accessible captions retain normal spelling.

Type scale: display 96px desktop / 52px mobile; section 44px / 32px; project 24px; body 18px; navigation/captions 15–16px. Display tracking -0.065em, body normal. Body line-height 1.55; display 0.94. Text measure 52–65ch.

Layout: maximum width 1120px; desktop gutters at least 32px, mobile 20px; 24px collection gap; spacing rhythm 8, 12, 16, 24, 32, 48, 64, 96px. Rectangular content corners 12px; round badge silhouettes and capsule labels are intentional exceptions. No gradients or broad shadows.

## 9. Patch construction

Two lines communicate material: a 2px solid outer boundary and a 1.5–2px dashed inset seam, separated by 7–10px. There is no fabric background texture, embossing or photorealistic thread. A seam belongs to a badge, not every paragraph or navigation item.

Keep long text outside the silhouette. Badge text is short, high contrast and centered optically. Main captions remain horizontal. Badge-only rotation is limited to about 2 degrees on desktop; no rotation on narrow screens. Click targets remain rectangular and stable, even when a silhouette is round or hexagonal.

| Project/section | Shape | Treatment and rationale |
| --- | --- | --- |
| Voice Agent Lab | Wide rounded label | Blue with white text; short name has space and reads first |
| Counsel | Rounded nameplate | Neutral paper and ink; discretion suits private work in development |
| Demola | Hexagonal label | Pale green with text only; distinct shape without suggesting a delivered AR image |
| Smart Expense Tracker API | Ticket rectangle | Yellow with aligned text; references a record without fake transactions |
| FlipOff | Wide black rectangle | White text; split horizontal rule echoes the real display; enhanced-fork attribution outside |
| Satellites | Circular badge | Black and white; typographic circle, no invented orbit data or simulation visualization |
| Education | Plain editorial panel | University and thesis names carry the content; no invented institutional crest |
| Contact | Oversized rounded label | Selectable email, direct links nearby |

`patches.html` compares colored and monochrome options. These are proposed UI identities, not final brand assets. The portrait and project imagery are not retouched. Existing FlipOff and Satellites evidence can be paired with their labels later, but should not be made illegible by a badge crop.

## 10. Scroll-controlled motion review

Updated following user feedback: the standalone motion study now ties individual stitch appearance directly to document scroll position. The earlier timed settle-and-four-segment sequence is superseded.

- Begin at the patch entering the viewport. Finish only when its bottom reaches 72% of viewport height, after full visibility. Patches must fit within that region; the study uses bounded responsive dimensions.
- No timer, autoplay, easing tail or time-driven completion. When scrolling stops, stitch progress stops. Stitches already sewn remain when scrolling back.
- The latest motion-only review replaces the half-fold with a moving diagonal peel inspired by bsehovac’s Sticker Peel CSS Effect v2 (https://codepen.io/bsehovac/pen/gvejKK). Angled clipping and a reflected plain backing follow scroll progress; the face lands by 92% progress. Sewing appears only behind the peel boundary, with final stitches completing at the established endpoint. No mouse trigger or timed completion. Resting rotations remain -2, +1.5 and -1 degrees. External headings remain stationary.
- Use a graphic bound rim with short perpendicular thread marks, an inset guide, and rounded slightly angled stitches. No photorealistic fabric, shadows, needle or copied provider logo.
- Reduced motion and printing show complete seams. Without JavaScript, a static seam remains visible. Percentage labels belong only to the review mockup.
- Review lives only in prototype/patch-study/motion.html. This does not authorize a full portfolio implementation.

## 11. Responsive and accessible behavior

- Above 900px: split hero and two-column Work grid. Between 600 and 900px: reduce display size and hero gap. Below 600px: single-column content.
- The study uses a wrapping, always-visible navigation; a later menu is optional and must have aria-expanded, Escape close and focus return. With scripting off, links remain visible.
- Use semantic landmarks, one descriptive h1, ordered headings, skip link and aria-current. Every link gets immediate focus indication and at least a 44px target.
- Body contrast >=4.5:1; large text and focus indicators >=3:1. Shape and captions must identify entries without color.
- Repeated visual badge lettering is hidden from assistive technology when the adjacent caption already names the entry. Portrait alt text identifies Shantanu.
- SVG silhouette and seam layers, if used, are decorative and cannot receive focus. Do not rasterize body text.
- No horizontal overflow at 320, 390, 768, 1440 or 1920px. Check zoom and natural heading wrapping. Do not mask layout problems with hidden overflow.

## 12. Implementation and review contract

Keep semantic HTML, shared CSS and optional small vanilla JavaScript. No package manager, framework, runtime API or production build. Mockup rendering tools are development-only. The static study uses one stylesheet and tokens, no runtime script.

Review deliverables: Home desktop and mobile; Work desktop and mobile; Background/contact study; colored/monochrome patch board; recorded checks. These are partial visual studies, not complete content-preserving replacement pages. Links to full stories may open the existing production pages for context.

Before another gate: choose the patch direction, confirm the white/black system, review whether the proposed motion is desirable, and reconcile the draft content approval status. Then build only the agreed functional prototype. Production changes and deployment remain separate approval gates.

Quality review: inspect every screenshot; verify relative links, image loads, headings, keyboard focus, contrast and widths. Run Hallmark lint where supported, record tool limitations honestly, and review the final diff for changes outside this study. No push, commit or deployment is implied.

## 13. Motion record and individual patch artwork

The user accepted the diagonal peel direction and requested documentation for reproduction. Its exact mapping, clipping/reflection geometry, stitch generation, endpoint, fallbacks, source inspiration and integration limits are recorded in [MOTION-SPEC.md](prototype/patch-study/MOTION-SPEC.md). [MOTION-AUDIT.md](prototype/patch-study/MOTION-AUDIT.md) records the current review evidence; old fold captures are superseded.

The next authorized step is individual artwork design only. [PATCH-CONTENT.md](prototype/patch-study/PATCH-CONTENT.md) records sources, design decisions, tokens, generation and checks. Review all seven designs at [content-review.html](prototype/patch-study/content-review.html); standalone self-contained SVGs are under prototype/patch-study/content-patches/. These assets remain pending manual approval. They have not been inserted into the prior mockups, motion example or production.

Requested content: Voice Agent Lab uses waveform/microphone and a small official Sarvam wordmark; Counsel uses book/student/planner symbols; Demola uses an AR object frame plus API/Unity text; Expense Tracker uses currency/ledger/API braces and FastAPI text; FlipOff uses split-flap cells and original-interface colors; Satellites uses actual demo imagery; the portrait uses a white/black Graduate 2026 patch. All retain flat graphic surfaces, bound rims and inset thread marks. The user-requested simple vectors are scoped exceptions to the earlier typography-only proposal. No photorealistic fabric or generated product screens.

### Artwork review correction: image emphasis

Satellites now expands the real simulation crop to radius 164 within its circular seam (radius 176), with the title and OpenMP / OpenCL lettering over the image. The Graduate 2026 portrait changes to an elongated white rounded rectangle with black binding; its enlarged portrait fills most of the face height on the left, while lighter text sits on the right. Graduate weight 610 follows the current portfolio heading style and 2026 weight 400. These proposals supersede the earlier small simulation window and circular portrait patch; production and motion samples remain unchanged.

Portrait orientation correction: the Graduate 2026 patch is vertically elongated (420 by 640 design space), with a large photo above centered lighter text. This supersedes the horizontal left-photo/right-text arrangement.

## 14. Full prototype authorized

The user approved all seven final SVG designs and the diagonal peel/sew strategy. Approved asset hashes are recorded in prototype/patch-study/content-patches/APPROVED.json. The next phase implements Home, Work and About under prototype/patch-portfolio/, preserving root production pages and the earlier studies. Project artwork is paired with summaries and real evidence. Biography, education and experience remain stationary. Responsive layout, keyboard behavior, reduced motion, no-JavaScript and media playback are verified before the prototype approval gate. This supersedes the earlier artwork-only scope; content and deployment approvals remain separate.

## 15. Full prototype implementation record

The complete Home, Work and About pages now live in prototype/patch-portfolio/. Shared runtime files are assets/tokens.css, assets/site.css and assets/site.js; approved art copies match the original SHA-256 records. Home uses a static vertical portrait patch and four selected project patches with summaries. Work uses all six patches with native contribution disclosures, user-controlled real demos and source links. About retains static editorial reading and manual original-photo carousels.

The integrated scroll adapter reads each native SVG viewBox and edge contour, excludes text/images/symbols from the plain backing, and contains its paint inside the artwork box. Lazy observers prepare nearby assets, offscreen states are skipped, and scroll work is coalesced with no continuous animation loop. Short landscape screens have an adapted reachable completion point. Focus and pointer activation finish decoration without delaying links.

Full responsive, accessibility and motion results, content deltas, advisory Hallmark findings and before/after evidence are recorded in prototype/patch-portfolio/QA.md and README.md. Independent hero and finish reviewers both returned ship. Production remains at the prior approved gate until this complete prototype is reviewed.

## 16. User-requested interactive component revision

The latest annotated feedback authorizes local interaction on the portrait, particle treatment on the hero name, brief introductions of static content, a restrained ASCII footer and labelled glass-like contact icons. It supersedes earlier static-portrait and strictly stationary-content rules only for these effects. Reading content settles after a one-time 180ms translate/opacity entrance; it is not repeatedly scrubbed by scroll. The project patch peel/sew behavior remains scroll-controlled.

The portrait stays fully readable at rest and uses a native button for a small pointer/keyboard/touch corner peel. The h1 remains real HTML with at most 1,800 decorative particles during a bounded 800ms assembly/pointer response. Reduced motion, printing and no-JavaScript preserve complete content. The footer uses an author-time monochrome ASCII wave and pointer-local character changes, with no idle render loop; contact links have 24px SVGs, 44px surfaces, visible labels and focus states. Duplicate contact rows are omitted on Home/About. Work alternates patch/summary sides above 760px while retaining patch-first mobile order.

Full reference links, interpretation, source files, reproduction steps, performance bounds, screenshots and Hallmark audit findings are recorded in prototype/patch-portfolio/COMPONENT-REFINEMENTS.md. The footer/component audit returned ship; the page-level render audit has zero hard failures and zero open Reflex findings. These are prototype changes only.

## 17. Approved ASCII name and component corrections

On 29 October 2026 the user approved the isolated `prototype/name-text-demo/` treatment and explicitly authorized its prototype integration. This supersedes the particle name in section 16. The original demo is preserved; its APPROVED.json records approval and reference/integration SHA-256 hashes.

Home renders the exact semantic h1 **Shantanu Garg.** through the supplied React Bits ASCIIText shader adapted to vanilla JavaScript and fitted to the two-line hero. Its glyph density, chromatic accents, tilt, scramble, intro, ripple and idle behavior follow the approved demo. Pause/Resume stops rendering. Reduced motion, printing, unavailable WebGL2 and JavaScript disabled retain an HTML name. Rendering is capped near 30fps and DPR 1.5 and stops offscreen/hidden. Only Home loads assets/ascii-name.js; particles are removed.

The footer retains existing identity, qualification and destinations. Larger identity and three labelled contact links sit above a separate ASCII contour. Home/About move their existing contact row to this shared footer; each page has one row. Existing contact headings, copy and anchors remain. Desktop uses two columns, stacking at 760px with three equal mobile contact targets.

Portrait hover measures the lower-right corner in the rotated patch's own coordinates and uses one frame loop instead of restarting on every pointer event. The center stays complete. Exit, blur, Escape, reduced motion and hidden documents restore the patch. Keyboard/touch toggle remains. Approved SVG artwork, seams and project scroll motion are unchanged.

These are prototype integrations/corrections, not production or deployment approval. Reproduction, evidence and audit findings: prototype/patch-portfolio/APPROVED-NAME-INTEGRATION.md.

## 18. Item-level entrances and full-footer ASCII review

30 October 2026 feedback supersedes the pause-control and separate-contour choices in section 17 within the prototype. Home removes the Pause control. The ASCII name retains its intro, pointer tilt/scramble and click ripple, with idle drift disabled and no render loop for a stationary pointer. Intro/interaction rendering is bounded, with the existing reduced-motion, no-JavaScript, no-WebGL and print fallbacks.

Reading content enters by individual heading, paragraph, list item, definition, caption, disclosure summary or isolated action. Parent sections remain stationary. One shared observer runs each item's 280ms translate/opacity entrance once, with 65ms stagger capped at 195ms per visible batch. No text splitting or layout-property animation; patch peel/sewing remains separate. Focus cancels animation around the focused control, and reduced motion, print and hidden documents settle active entrances.

The requested footer experiment expands the monochrome ASCII density gradient across the full footer, including behind real text and labelled contact icons. It uses low-opacity ink at .16 over white, preserving readable opaque text. A ResizeObserver fits the character grid to the footer; no idle animation loop. Pointer-local scrambling remains optional; no-JavaScript uses author-time ASCII. This is a review experiment, not a production approval.

Checks and captures are in prototype/patch-portfolio/review/granular/. The focused checker verifies three routes, item-level stagger, stationary parents, full-footer coverage at 320/390/768/1440/1920px, no overflow, name settling with/without a stationary pointer, reduced motion and no-JavaScript. Production remains unchanged.


## Prototype approval, 2 November 2026

The user approved the current prototype, including the ASCII hero without a pause control, granular content entrances and full-footer ASCII treatment. This supersedes the pending-review status of section 18. The approved source snapshot is recorded with SHA-256 hashes in prototype/patch-portfolio/APPROVED.json. Production implementation and deployment remain separate steps; no production files or publishing settings changed.
