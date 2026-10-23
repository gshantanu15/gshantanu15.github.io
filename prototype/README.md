# Hallmark Studio showcase

Branch: `showcase/hallmark-studio`.

This is a complete three-page design prototype for the existing static portfolio. It changes presentation while preserving the current portfolio's substantive text, headings, link destinations, metadata, project media, attribution, and hardware photographs. No production page or source content document was changed.

## Preview

From the repository root:

```powershell
python -m http.server 8000
```

Open `http://127.0.0.1:8000/prototype/` for the interactive site, or `http://127.0.0.1:8000/prototype/review.html` for the before/after comparison. These are local previews, not published URLs.

## Design

Cool paper, large serif display typography, blue-black ink, orange actions, open project entries, and a readable professional record. The shared system is documented in `design.md`; the site remains semantic HTML, CSS, and minimal vanilla JavaScript, with no build step.

Presentation-only changes include moving labels below headings, normalizing decorative punctuation and casing, removing placeholder drawings, framing the existing portrait, and replacing automatic video playback with native controls. All substantive details remain present.

## Verification

- `node scripts/check-site.mjs` passes for the unchanged production site.
- `scripts/check-prototype.mjs` verifies preserved content, headings, metadata, links and media; local resources and fragments; all three layouts at 320px, 390px, 768px and 1440px; image loading; menu Escape and focus restoration; no-JavaScript access; reduced motion; and all three hardware carousels.
- Browser verification uses temporary `puppeteer-core` tooling outside this repository. It is not a website dependency. Set `HALLMARK_PUPPETEER` to its install directory and run `node prototype/scripts/check-prototype.mjs` from the repository root. Override `CHROME_PATH` when needed.
- Hallmark's full static and render sweep: zero FAIL, zero WARN. Gate 77 is waived for the real six-article Work index and compact two-role leadership section. Preserved copy length and original dash punctuation are notes under `copy: verbatim`.
- Independent hero review: mobile portrait placement corrected. Independent finish review: ship, with no required fixes.
- Desktop and mobile screenshots for all three pages are in `review/`. `review/checks.json` contains the browser-check results.

External destinations were preserved but their remote availability was not tested. The system font may vary slightly between operating systems. No material slots or replacement images are required.

## Approval boundary

The repository's `AGENTS.md`, under “Approval gates,” requires a functional prototype and screenshots followed by user approval before root production pages are changed. This branch stops at that concrete review point. Nothing was pushed or deployed, and GitHub Pages settings were not changed.
