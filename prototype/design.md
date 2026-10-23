# Design: Shantanu Garg, Terminal

This replaces the previous Studio prototype system at the user’s explicit request. It applies to the prototype on `showcase/hallmark-studio`; root production files are unchanged.

## System

- Theme: Hallmark Terminal, requested by the user.
- Genre: atmospheric; material: monospace terminal output.
- Shape: Session Ledger, with a persistent command directory and readable document outputs.
- Signature: a working `whoami` command field followed by the actual identity record.
- Navigation: overview, projects, background; direct section links remain available without JavaScript.
- Overview order: identity; education and published thesis; six projects; experience; TaSciEn; contact.
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
- Corners: square. No shadows, gradients, decorative browser windows, scanlines, or blinking text.

## Interaction

- `whoami`, `education`, `projects`, `experience`, `tascien`, and `contact` navigate to real sections.
- `help` reveals the command links; unknown input produces an accessible error message.
- Commands use a fixed mapping. There is no shell, network request, or dynamic code execution.
- Valid commands focus their destination and update the fragment.
- The mobile directory closes with Escape and returns focus to its button.
- Project stories and the earlier-work archive use native details/summary controls.
- Hardware photographs retain their manual controls and position announcements.
- Media playback is user initiated; reduced motion disables interface transitions.

## Content and evidence

Facts, public destinations, and original media are retained. Overview copy is condensed and reorganized under the user’s six priorities. Demola contribution wording is narrowed to the approved Tripo3D integration, manual E2E testing, teamwork, and delivery scope.

No new dates, qualification names, metrics, private screenshots, or resume link are introduced. The verified graduation date is the year 2026; no month is supplied.

## Exports

`assets/site.css` imports `tokens.css` and `base.css`. All pages share `assets/site.js`. The runtime remains buildless HTML, CSS, and vanilla JavaScript.
