# Terminal portfolio prototype

Branch: `showcase/hallmark-studio` (retained as requested).

The earlier editorial design has been replaced with a terminal-style portfolio: dark phosphor colours, locally served monospace type, a simple identity record, a working command field, and expandable project records. A generic glyph banyan develops curved aerial roots in the outer gutter as the visitor reads. The portrait, identity panel, and permanent command-reference rows have been removed at the user’s request.

## Preview

From the repository root, run:

```powershell
python -m http.server 8000
```

Open `http://127.0.0.1:8000/prototype/`. The review page is `prototype/review.html`.

## Information architecture

The overview conveys the six requested subjects directly: Shantanu’s identity; Tampere University graduation in 2026; all six projects; email, LinkedIn and GitHub; TaSciEn chairperson and treasurer roles with their responsibilities; and the published thesis alongside education.

Project and Background pages retain the complete public-safe records, media, attribution, professional experience, earlier activities, and original hardware galleries. The thesis stays under Education. No new personal facts or unverified dates were added.

## Verification

The browser checker runs with temporary Puppeteer tooling outside the repository:

```powershell
$env:HALLMARK_PUPPETEER = 'C:\path\to\tool-install'
$env:BASE_URL = 'http://127.0.0.1:8000/prototype/'
node prototype/scripts/check-prototype.mjs
node prototype/scripts/check-terminal-art.mjs
```

Override `CHROME_PATH` if Chrome is installed elsewhere. The website itself has no package manager, build step, framework, or third-party runtime dependency.

Checks cover all three pages at 320px, 390px, 768px, and 1440px; overflow and image loading; local links and fragments; metadata and safe external links; known commands, help, invalid input and focus; mobile Escape behavior; reduced motion; no-JavaScript access; native project disclosures; hardware galleries; and retained substantive records.

Hallmark’s source lint and browser render results are saved in `review/hallmark-static.txt` and `review/hallmark.txt`. Browser results and screenshots are in `review/`. Studio screenshots retained there are historical comparison evidence only.

Hallmark’s final source and browser sweeps report zero FAIL and zero WARN. Gate 77 is waived for the compact, complete real-world records, and gate 44c for compact Work and About document introductions; original wording and document length remain copy notes. Independent final visual review returned ship. External destinations are preserved but their remote availability was not retested.

Expanded-project regression checks also cover heading separation, distinct tag boundaries and wrapping at all four widths. Colored tags meet at least 11:1 text contrast in the saved browser measurement (`review/tag-contrast.json`). Close-up screenshots of Voice Agent Lab and Demola and full expanded desktop/mobile records are in `review/`.

Art checks cover seven widths from 320px to 1920px; root growth at the top, midpoint and bottom; content separation; pointer and focus exclusion; no root replay on upward scrolling or resizing; the finite cursor; no-JavaScript, reduced-motion, save-data, missing/throwing/lost canvas and failed-data fallbacks. They block and assert the absence of third-party requests. Results are in `review/terminal-art-checks.json`.

## Banyan and cursor

`assets/banyan-glyph.json` describes an original, deterministic tree made of Martian Mono characters and the eight Terminal glyph colors. The static `assets/banyan-glyph.webp` uses the same data. This is a generic illustration, not a photograph or personal image.

On wide screens, the decorative tree lives outside the portfolio’s reading column. Below 1440px, it follows all portfolio content as a compact end mark. It never captures clicks, receives focus, moves text, or hijacks scrolling. Aerial roots grow in staggered order along curved paths as the visitor approaches the bottom; scrolling back up does not erase or restart them. The reduced-motion and no-JavaScript versions show a complete static tree.

The heading cursor blinks five times over 4.5 seconds, then holds. Reduced motion shows it stationary. There is no continuous blinking animation.

To regenerate the art using the existing external verification tooling, run `node prototype/scripts/make-banyan.mjs`. This optional local authoring operation is not needed to serve the site and loads no external service or image. Older portrait and session screenshots remain historical review evidence only.

## Font

Martian Mono is self-hosted under the [SIL Open Font License](https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/OFL.txt). The original license accompanies the font in `assets/fonts/`. No third-party font service is contacted by visitors.

## Approval boundary

The repository requires prototype approval before root production edits. This revision stays under `prototype/`, apart from Hallmark’s design log and preflight cache. Nothing was pushed or deployed, and GitHub Pages settings were not changed.
