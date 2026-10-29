# Individual patch artwork: review edition

Seven standalone designs requested for manual review. These are proposals, not approved production assets. No complete portfolio or motion integration was made during this step.

## Review

Open `content-review.html`. Each image links to its individual SVG in `content-patches/`. The SVGs are self-contained: official wordmark data, existing portrait and demo crop are embedded. All seven have a descriptive title and description; their names and notes remain readable in the review page.

| File | Design decision |
| --- | --- |
| `voice-agent-lab.svg` | Blue rounded patch; bold title, waveform, microphone, small official white Sarvam wordmark |
| `counsel.svg` | Neutral rounded patch; open book, student figures and checked academic planner |
| `demola-ar.svg` | Pale green hexagon; AR corner frame around an object outline; AR, API and Unity text references |
| `expense-tracker-api.svg` | Yellow rectangular patch; euro symbol, ledger lines, API braces and FastAPI name |
| `flipoff.svg` | Dark rectangular patch; seven individually hinged letter cells, warm white and orange cues, enhanced-fork label |
| `satellites.svg` | Dark circular patch; enlarged actual simulation crop filling most of the face; Satellites and OpenMP / OpenCL text over the image |
| `graduate-2026.svg` | Vertically elongated white rectangular patch; black binding and stitching, large portrait above lighter Graduate and 2026 lettering |

The palette, typography, bound rims and inset stitches retain the current patch identity. Artwork remains graphic: no fabric texture, embossing, photorealistic thread, broad shadows, fake screenshots or rendered 3D objects. The student/book, microphone and AR object are deliberately simple vectors requested for this artwork round.

## Sources and attribution

- **Sarvam:** official white wordmark downloaded unchanged from `https://web.sarvam.dev/assets/brand/logos/sarvam-wordmark-white.svg`, linked from [Sarvam's brand guidelines](https://web.sarvam.dev/brand-guidelines). Original retained as `content-patches/sarvam-wordmark-white.svg`. It identifies the provider used for published conversation evaluations, not endorsement and not the separate Retell Python integration. The user requested a brief logo presence; it is subordinate to the project title.
- **Counsel:** newly drawn generic academic symbols. No private screens, names, records or implementation details.
- **Demola:** newly drawn generic AR frame and cube, with technology names requested by the user. “Unity” is a text reference, not an imitation logo. This is a team-project identity, not a diagram of architecture or a statement that Shantanu owned every technology shown. Public contribution wording remains limited by AGENTS.md.
- **FastAPI:** informative technology name, generic API braces and ledger/currency symbols. The euro is an expense cue, not a newly claimed currency-conversion feature. No invented transactions or balances.
- **FlipOff:** inspected `assets/images/flipoff.png`, the existing screenshot used by the site's Work entry. The split cells, center hinges, warm white letters and orange indicator echo that real interface. No quote from the screenshot is reproduced. Retain enhanced-fork and original-project attribution in surrounding portfolio copy.
- **Satellites:** embedded crop of `assets/media/satellites-comparison-poster.webp`, from the existing published comparison. Only the simulation area is shown; performance values and labels are excluded. This is actual project imagery, not an invented simulation. Keep individual university course/starter-code attribution outside the patch; no source/executable is exposed.
- **Portrait:** existing `assets/images/profile.webp`. No image retouching, invented qualification or institutional crest. Graduate and 2026 are user-requested elements consistent with existing content.

The supplied public Work URLs were attempted through the web reader but could not be fetched there; the matching local Work entries and local media were inspected directly. The Sarvam guideline source and wordmark were fetched from its official site. No third-party logo aggregator was used.

## Reproduction

Source: `make-content-patches.cjs`. Run from the repository root with `node prototype/patch-study/make-content-patches.cjs`. It uses the installed bundled Playwright path and local Chrome executable listed in the source. It has no runtime role and introduces no package manager or website build step.

The source lists all seven shapes, texts, drawings, image crops and color tokens. It measures SVG paths in a browser to emit complete rim fibers and inset stitch lines. The saved SVGs do not require JavaScript, external fonts or network requests. The manifest is generated beside them.

Design space: 640 by 420. Maximum outer path extent: 14–626 horizontally, 14–406 vertically. The Satellites patch is centered at (320, 210), outer radius 196, seam radius 176; its image radius is now 164. The portrait uses its own 420 by 640 design space: a 392 by 612 rounded rectangle from (14, 14) to (406, 626), with a 328-unit circular photo centered at (210, 222). Graduate uses weight 610, matching the root portfolio heading rule; 2026 uses weight 400. Rim stroke 14; fibers approximately every 5 units with 10-unit lengths; inset running stitches approximately every 10 units with 6.5-unit lengths. The drawing and typography use role tokens in the embedded SVG style block.

The Satellites source image is placed inside a circular clip using a nested viewBox crop (135, 160, 210, 180). This excludes comparison labels while preserving actual imagery. The enlarged portrait is circularly clipped from the existing image within the vertically elongated white rectangular face, retaining its original appearance. The official Sarvam wordmark is embedded without redrawing or distortion.

## Validation and approval boundary

`check-content.cjs` checks seven standalone SVGs, decoded review images, text bounds, one page heading, absence of page errors, and overflow at 320, 390, 768 and 1440px. Review screenshots and `content-checks.json` live in `review/`. Every individual screenshot is visually inspected, including the embedded logo and photos. These are render/layout checks, not editorial approval.

The existing peel implementation is documented in `MOTION-SPEC.md` and `MOTION-AUDIT.md`. Its live sample remains separate. The next step is the user's manual review of the seven designs. Integrating them into Home, Work, the portrait hero or the peel example requires a subsequent agreed step.

Independent visual review inspected all seven final assets and found no clipping, overlaps or missing requested elements. The reviewer marked them ready for manual review. Demola intentionally uses the Unity text reference rather than an official Unity mark. All artwork remains awaiting the user's approval.

## Manual review corrections

The browser feedback requested a larger Satellites crop with text over the imagery, and an elongated portrait patch with more photo area and lighter typography. Both changes are implemented in the source generator and regenerated SVGs. Satellites uses a 328-unit image window and a thin dark outline behind light lettering for contrast. The portrait uses the current root portfolio heading weight (610) rather than the prior badge weight 900. Other five artwork designs are unchanged. Screenshots and four-width checks were regenerated; review remains pending approval.

Latest review correction: the portrait rectangle is vertical, not horizontal. The large photograph occupies the upper portion, Graduate and 2026 are centered underneath, and the black binding/white face and lighter weights are retained. The generator, standalone SVG, review dimensions and viewport/text-bound checks were updated.

## Approval recorded

The user approved all seven final designs and authorized saving them and using them in the full portfolio prototype. `content-patches/APPROVED.json` records SHA-256 fingerprints of the approved SVGs. Prior pending-review wording above describes earlier stages. The saved source and approved SVGs are retained as the reproduction baseline.
