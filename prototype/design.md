# Design: Shantanu Garg, Studio showcase

This system applies only to the branch prototype. Production remains governed by the root instructions until this design is approved.

## System

- Genre: editorial.
- Shape: a personal nameplate followed by an open project index; detailed Work stories and an About record.
- Theme: Studio, selected from Hallmark's three-theme deal.
- Material: cool paper, blue-black ink, serif headlines, square controls, and one orange action.
- Signature: the oversized Shantanu Garg nameplate.
- Scope: Home, Work, and About share these tokens and chrome.

## Tokens

The source of truth is `assets/tokens.css`.

- Paper: `#f0f4f5`; secondary paper: `#e4ebed`; strongest neutral: `#d5dfe2`.
- Ink: `#142129`; body ink: `#344750`; muted: `#50616a`.
- Rule: `#bbc8cc`.
- Accent: `#f28a3c`, paired with ink; focus: `#a54313`.
- Display: Palatino Linotype, Book Antiqua, Palatino, Georgia, serif.
- Body: Segoe UI, system sans.
- Code only: Consolas, monospace.
- Content width: 1120px, centered and capped.
- Columns: 40px gap on desktop; stacked on small screens.
- Radius: 4px. No shadows, gradients, generated art, or decorative mockups.

## Controls and access

- Primary: orange fill, ink text, 48px minimum height.
- Secondary: ink outline with transparent paper.
- All interactive elements have an instant focus ring.
- Existing mobile menu supports Escape and restores trigger focus.
- Original hardware carousels retain their controls and live position announcements.
- Video uses native controls and a static poster; playback is user initiated.
- Navigation and content remain available without JavaScript.

## Motion

Only brief interface transitions, 180ms. Reduced motion disables them. No entrance or scroll animation.

## Adaptations

System fonts keep the site offline-capable. The theme's ornamental measuring guides, dot grid, and crop marks are omitted. Existing headings and substantive copy remain intact; decorative punctuation and label casing are normalized. The source portrait has a circular cutout, displayed within a square frame.

## Exports

The three pages consume `assets/site.css`, which imports `tokens.css` and `base.css`. There is no build step or third-party runtime dependency.
