# Patch design study

Static, partial visual mockups for review. Not a complete website implementation or approved production design. Start with `../../DESIGN.md`.

## Review files

- `index.html`: landing-page composition with the existing portrait.
- `work.html`: six approved project names in a patch collection.
- `background.html`: experience, education, leadership and contact composition excerpts.
- `patches.html`: six colored badge proposals and three monochrome comparisons.
- `review/`: desktop (1440px) and mobile (390px) screenshots, contact close-up and check results.

Open HTML locally, or from the repository preview server at `/prototype/patch-study/`. Links to project stories intentionally lead to existing root Work entries; this study does not rebuild them. The patch comparison board is a review artifact, not a public route.

## Material and preflight

- `../../docs/site-content.md:3` marks editorial content awaiting approval. These excerpts do not resolve that status.
- `../design.md:1` defines the earlier Terminal prototype. It is preserved.
- `../../index.html:45` supplies the identity; line 55 uses the existing portrait; line 170 supplies public contact destinations.
- The user's four page references supply appearance, not copy. The two overall photographs supply shape/seam inspiration, not production imagery or an assertion of badge ownership.
- Introduced: white/black type system, modest accent colors, geometric patch proposals. Motion is specified only in the brief.
- No missing image placeholders. No photo generation or external font download. Existing portrait is reused without retouching.

## Validation

`check-study.cjs` uses the bundled Playwright package and installed Chrome. It is an authoring check, not a site build step or runtime dependency. Set `STUDY_NODE_MODULES` to the bundled node_modules directory, then run `node prototype/patch-study/check-study.cjs` from the repository root.

24 page/viewport combinations pass at 320, 390, 768, 1280, 1440 and 1920px: no horizontal overflow or off-screen main content; one h1; loaded images and alt attributes; existing local link destinations and fragments; keyboard skip link first. All are checked with JavaScript disabled and reduced motion enabled. Every page has a global immediate focus-visible outline. There are no runtime animations or mobile menu scripts to test at this stage.

All nine final screenshots were visually inspected. The mobile action precedes the portrait; captions wrap without clipping; contact remains selectable and readable. This is not a complete screen-reader or cross-browser certification.

Hallmark static lint: 0 FAIL, 0 open REFLEX, 8 white-surface findings explicitly waived because the user requested white. Two advisory warnings reviewed: equal columns belong to a comparison specimen board; the nine-word Background heading preserves the existing factual heading. Date separators are expanded to “to” without changing dates. Project descriptions are excerpts, not replacements for complete approved copy.

Hallmark's render tier was attempted twice: first its dependency was unavailable, then an existing Puppeteer installation was located but its browser launch failed. `lint.txt` and `lint-render.txt` preserve those results. Playwright's successful captures and checks are the visual validation evidence; no Hallmark render pass is claimed.

Production files, the earlier prototype, editorial content, routes and publishing settings are unchanged. Only `DESIGN.md` and this directory are new. No commit or push performed.

## Independent visual review

Hallmark finish review requested two corrections: label the three-item monochrome comparison as a sample, and reduce Background headline scale. Both were applied and captures regenerated. The recommendation to preserve clear paths to project evidence is already met by the linked project names/patches; expanded evidence belongs to a later approved prototype. No full-site implementation was started. A separate hero-first review was not performed because these are limited composition studies, not a staged page build.

## Current artwork review

Seven independent proposed designs are at `content-review.html`, with individual SVGs in `content-patches/`. See `PATCH-CONTENT.md` for sources and reproduction. `MOTION-SPEC.md` records the accepted peel/sew strategy and exact geometry. Artwork is awaiting manual review and is not yet integrated into motion or page layouts.
