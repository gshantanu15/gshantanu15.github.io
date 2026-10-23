# Terminal portfolio prototype

Branch: `showcase/hallmark-studio` (retained as requested).

The earlier editorial design has been replaced with a terminal-style portfolio: dark phosphor colours, locally served monospace type, a glyph portrait beside an identity session, command-reference rows, a working command field, and expandable project records. The portrait uses the original approved photograph; the prior Studio layout and styling are gone.

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
node prototype/scripts/check-identity.mjs
```

Override `CHROME_PATH` if Chrome is installed elsewhere. The website itself has no package manager, build step, framework, or third-party runtime dependency.

Checks cover all three pages at 320px, 390px, 768px, and 1440px; overflow and image loading; local links and fragments; metadata and safe external links; known commands, help, invalid input and focus; mobile Escape behavior; reduced motion; no-JavaScript access; native project disclosures; hardware galleries; and retained substantive records.

Hallmark’s source lint and browser render results are saved in `review/hallmark-static.txt` and `review/hallmark.txt`. Browser results and screenshots are in `review/`. Studio screenshots retained there are historical comparison evidence only.

Hallmark’s final source and browser sweeps report zero FAIL and zero WARN. Gate 77 is waived for the compact, complete real-world records, and gate 44c for the compact Work and About document introductions; original wording and document length remain copy notes. Independent final visual review returned ship. External destinations are preserved but their remote availability was not retested.

Expanded-project regression checks also cover heading separation, distinct tag boundaries and wrapping at all four widths. Colored tags meet at least 11:1 text contrast in the saved browser measurement (`review/tag-contrast.json`). Close-up screenshots of Voice Agent Lab and Demola and full expanded desktop/mobile records are in `review/`.

Identity-specific checks cover seven widths from 320px to 1920px, 640px reflow, the 1280×800 primary-action fold, bounded one-time motion, no animation replay on resizing, command-reference keyboard focus, no-JavaScript and reduced-motion modes, missing/throwing canvas, decoding failure, save-data, and changing the motion preference mid-reveal. They also block and assert the absence of third-party requests. Results are in `review/identity-checks.json`.

## Glyph portrait

`assets/portrait-glyph.webp` is a static, locally generated rendering of the existing approved `../assets/images/profile.webp`. It uses 130 columns, 70 rows, characters from Shantanu’s identity text, the self-hosted Martian Mono font, and the eight Terminal glyph colors. It remains visible without JavaScript and links to the original photograph. The optional canvas adds only a single 180ms reveal; reduced motion and save-data skip it.

To regenerate the asset using the same external verification tooling, run `node prototype/scripts/make-glyph-portrait.mjs`. This optional authoring operation is not needed to serve the site. No image is uploaded, no webcam is accessed, and no external converter, API, font, or script is loaded. [Glyph Matrix Image Maker](https://github.com/quintenvandamme/glyph-matrix-image-maker) was a reference for local processing; its code and Nothing-branded assets are not dependencies.

## Font

Martian Mono is self-hosted under the [SIL Open Font License](https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/OFL.txt). The original license accompanies the font in `assets/fonts/`. No third-party font service is contacted by visitors.

## Approval boundary

The repository requires prototype approval before root production edits. This revision stays under `prototype/`, apart from Hallmark’s design log and preflight cache. Nothing was pushed or deployed, and GitHub Pages settings were not changed.
