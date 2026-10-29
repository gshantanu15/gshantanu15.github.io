# Sewn portfolio: full prototype

User-authorized full prototype following approval of all seven individual patches and the diagonal scroll peel/sewing direction. This is the prototype approval gate; root production pages, publishing branch and Pages settings are untouched.

Preview from the repository root with `python -m http.server 8000`, then open `/prototype/patch-portfolio/index.html`. Routes: `index.html`, `work.html`, `about.html`; About retains `#thesis` and `#contact`. All six Work fragments are preserved. Direct file viewing shows complete static patches; HTTP enables the optional scroll enhancement.

## Saved design and implementation

- Approved design snapshot: commit `64730f7`, including SVG source artwork, generation source, reproduction documents and approval hashes.
- `assets/patches/` contains unchanged copies of those seven approved SVGs.
- `assets/tokens.css`, `assets/site.css` and `assets/site.js` provide one shared system and one runtime script for all pages.
- `author-pages.cjs` is a development-only authoring utility used to preserve root content and references while composing the new pages. It is not a website build requirement; generated HTML is the actual deliverable.
- `../patch-study/MOTION-SPEC.md` preserves the exact approved motion study; `../../DESIGN.md` records the shared system and this full-prototype phase.

## Composition

Home opens with readable identity, one qualification sentence, two real actions and the approved vertical portrait patch. The portrait is static. The full biography follows as stationary prose. Four selected work entries pair patches with factual summaries and links to full project stories. Experience, education/thesis and contact are direct editorial sections.

Work retains six project entries in their approved order. Each has a patch, full title, status/context, summary, and contribution details in native disclosures. Voice Agent Lab retains the consented Sarvam audio evaluation and distinguishes it from the Retell integration. FlipOff retains its real screenshot, public demo/source links and enhanced-fork attribution. Satellites retains the real comparison video, poster image, reference/starter-code attribution and the previously verified hardware-qualified benchmark caption. All media playback is user controlled. Counsel remains high level; Demola has no private project media or internal implementation diagram.

About is a stationary record: biography, at-a-glance facts, professional experience, education and thesis, TaSciEn leadership, earlier activities, original manual hardware photo carousels and contact. No repeated portrait or decorative scroll animations.

## Motion and performance

Only project patch artwork peels. Static full images are present in markup; enhancement is installed only after its local SVG loads and parses. Failed loading, JavaScript disabled, file viewing or initial reduced motion retain the complete images. No content prose is hidden.

The moving diagonal clip and reflected plain backing follow retained scroll progress. Stitches appear only on landed areas. The peel completes at 92% progress and the seam finishes at the established endpoint. For normal screens completion occurs when the patch bottom reaches 72% of viewport height; shorter screens adapt that endpoint so completion remains reachable without pinning or extra document height. Focus or pointer activation of a project link finishes its decorative motion immediately. The biography and reading content do not move.

Intersection observers lazily prepare nearby patches and skip offscreen updates. A passive scroll listener schedules at most one pending animation frame and schedules nothing while scrolling is idle. Geometry and stitch coordinates are cached; stitch DOM styles change only when visibility changes. There is no continuous requestAnimationFrame loop, forced media playback, external runtime service, font download or framework dependency. Approved backing surfaces contain only face/binding/fibers; logos, illustrations, text and images stay on the front. Paint is contained inside the artwork box to protect adjacent headings.

The asset collection is about 550 KiB uncompressed in total. Only the relevant patches load on each page; About loads none. This is an implementation and payload review, not a Lighthouse score or a network-speed benchmark.

## Copy and retained evidence

Root production HTML supplied existing identity, facts, links, media and original photographs. The editorial source still says approval pending; this prototype does not resolve production content approval. Copy changes are recorded in `QA.md`. No new outcomes, dates, institutions, private links or metrics were invented.

## Verification

See `QA.md`, `review/hallmark.txt`, `review/motion-checks.json` and the final six desktop/mobile captures. Run `BASE_URL=http://127.0.0.1:8000/prototype/patch-portfolio node check-prototype.cjs` with the platform-appropriate environment syntax, plus `node check-motion.cjs` for the focused HTTP animation/zoom checks. These authoring checks use installed Playwright and Chrome paths in their source. No packages are needed to view the website.

The next step is user review of this complete prototype. Production implementation and deployment remain separate gates.
