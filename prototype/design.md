# Design: Shantanu Garg, Terminal

This replaces the previous Studio prototype system at the user’s explicit request. It applies to the prototype on `showcase/hallmark-studio`; root production files are unchanged.

## System

- Theme: Hallmark Terminal, requested by the user.
- Genre: atmospheric; material: monospace terminal output.
- Shape: Session Ledger, with a persistent command directory and readable document outputs.
- Signature: a generic glyph banyan spanning the page background, with curved aerial roots developing as the visitor reads. Identity and portfolio records remain the main visual path.
- Navigation: overview, projects, background; direct section links remain available without JavaScript.
- Overview order: simple identity, optional command navigation, and facts; education and published thesis; six projects; experience; TaSciEn; contact. There is no identity session panel, portrait, or descriptive command-reference section.
- Project catalogue: six independent records with native disclosures, original media, attribution, and public links.
- Background order: profile; education and thesis; TaSciEn; experience; earlier activities and hardware; contact.

## Tokens

`assets/tokens.css` is the source of truth. All page colours and typography consume its role tokens.

- Ground: near-black with a green cast, `oklch(12.5% 0.012 150)`.
- Raised surfaces: `oklch(16% 0.016 150)` and `oklch(20.5% 0.022 150)`.
- Ink: pale phosphor, `oklch(94% 0.03 140)`.
- Body ink: `oklch(82% 0.05 142)`; muted: `oklch(64% 0.06 145)`.
- Signal and focus: `oklch(87% 0.2 142)`; paired dark signal ink.
- Type: self-hosted Martian Mono, variable width and weight. Its SIL Open Font License is retained in `assets/fonts/OFL.txt`.
- Content width: 1120px, centered and capped. A 176px desktop directory sits beside the document.
- Tags: blue tool/platform chips, amber practice chips, and green principle chips. These restrained secondary hues were added at the user’s request; labels remain meaningful without color.
- Project detail headings use consistent spacing across flat content groups; public actions have a separate link row.
- Corners: square. No shadows, gradients, decorative browser windows, or scanlines. Only a small heading caret blinks, five times, then holds.

## Interaction

- `whoami`, `education`, `projects`, `experience`, `tascien`, and `contact` navigate to real sections.
- `help` reveals a compact set of section links within the optional command form; unknown input produces an accessible error message. The permanent section directory works without JavaScript.
- Commands use a fixed mapping. There is no shell, network request, or dynamic code execution.
- Valid commands focus their destination and update the fragment.
- The mobile directory closes with Escape and returns focus to its button.
- Project stories and the earlier-work archive use native details/summary controls.
- Hardware photographs retain their manual controls and position announcements.
- Media playback is user initiated; reduced motion disables interface transitions.
- The banyan is an original deterministic glyph drawing: a broad canopy, arched limbs, twisted trunk, and staggered cubic aerial roots. No personal photo, stock image, external converter, camera or upload is involved.
- At every viewport, the tree fills a fixed background layer behind the entire page. Content and navigation occupy a higher stacking layer. Opacity is 10% on desktop, 8% on tablet, and 6.5% on mobile; there is no side rail, footer end mark, or extra document height. It is hidden from assistive technology and printing, has no focusable elements, and never intercepts pointers.
- A static WebP is visible by default. Supported browsers load the local glyph data and paint newly reached root characters once, in order along the curves, using passive scroll events coalesced into animation frames. There is no horizontal wipe, scroll hijacking, text movement, erasing when scrolling up, or continuing animation while reading pauses.
- Reduced motion, save-data, disabled JavaScript, missing canvas, lost canvas context or failed glyph data retain the complete static tree. Changing the motion preference immediately restores the static image.
- The CSS caret uses five 900ms cycles (4.5 seconds total), then stays visible. Reduced motion shows the stationary caret immediately. Its occupied width never changes during blinking.
- `scripts/make-banyan.mjs` is an optional local authoring tool, not a build step. It generates the point data and matching static WebP from the self-hosted Martian Mono font and the Terminal glyph tokens.

## Content and evidence

Facts, public destinations, and original media are retained. Overview copy is condensed and reorganized under the user’s six priorities. Demola contribution wording is narrowed to the approved Tripo3D integration, manual E2E testing, teamwork, and delivery scope.

No new dates, qualification names, metrics, private screenshots, or resume link are introduced. The verified graduation date is the year 2026; no month is supplied.

## Exports

`assets/site.css` imports `tokens.css` and `base.css`. All pages share `assets/site.js`. The runtime remains buildless HTML, CSS, and vanilla JavaScript.
