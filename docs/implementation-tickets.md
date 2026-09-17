# Portfolio Rebuild Tickets

These tickets keep the approved rebuild atomic and reviewable. Each production ticket is completed in its own commit.

## PORT-001 — Approved prototype checkpoint

**Status:** Complete

- Preserve the approved Home and Work mockups under `prototype/`.
- Include the circular portrait treatment and consented Voice Agent audio demo.
- Keep generated browser screenshots out of Git with `output/` ignored.
- Do not change existing production pages.

## PORT-002 — Shared production foundation

**Status:** Complete

- Create the shared production stylesheet and minimal navigation script.
- Add production-ready image and audio assets.
- Implement the approved Nordic editorial tokens, responsive rules, and accessibility behavior.

## PORT-003 — Public content pages

**Status:** Complete

- Replace `index.html` with the approved Home page.
- Add `work.html` with all six approved project stories.
- Add `about.html` with experience, education, thesis, leadership, earlier activities, and contact.
- Use `docs/site-content.md` as the copy source of truth.

## PORT-004 — Compatibility and discovery

**Status:** Complete

- Replace legacy pages with accessible redirects.
- Add a useful `404.html`, `robots.txt`, and `sitemap.xml`.
- Add canonical and Open Graph metadata to public pages.

## PORT-005 — Static validation and browser QA

**Status:** Complete

- Add `scripts/check-site.mjs` without runtime dependencies.
- Validate links, assets, metadata, image alternatives, privacy rules, and the content exclusion list.
- Test 320px, 390px, 768px, and 1440px layouts, keyboard behavior, audio loading, and console output.
- Record the completed checks in `docs/qa-report.md`.

## PORT-006 — Deployment-ready audit

**Status:** Complete

- Compare production against the approved prototype and content source.
- Remove the prototype from the publishing tree after its checkpoint is preserved in Git history.
- Remove superseded, unreferenced legacy styles and images in the same Git-recoverable cleanup.
- Document the zero-build preview and validation workflow in `README.md`.
- Meet the approved Lighthouse targets on all three core pages.
- Confirm the branch is clean, production-ready, and not deployed without explicit approval.

## PORT-007 — Continuous static validation

**Status:** Complete

- Run `node scripts/check-site.mjs` on every GitHub push and pull request.
- Use an explicit Node.js version and read-only repository permissions.
- Keep the workflow dependency-free beyond official checkout and Node setup actions.

## PORT-008 — About portrait and thesis access

**Status:** Complete

- Remove the repeated portrait from About and retain it only in the Home hero.
- Link the thesis card to the public Tampere University Trepo record.
- Extend static validation to protect the approved thesis URL.

## PORT-009 — Early hardware content gate

**Status:** Complete

- Recover the three hardware projects and their evidence from the legacy portfolio.
- Draft concise, evidence-based card copy without presenting school work as professional experience.
- Restore and optimize every approved legacy photograph for fixed-size, manually controlled carousels.
- Add the cards to About without expanding the six-project selected Work allowlist.

## PORT-010 — About hero information panel

**Status:** Complete

- Fill the former portrait column with an approved `At a glance` editorial panel.
- Reuse only approved profile, education, technical-interest, and sustainability content.
- Keep the panel responsive without adding decorative imagery or unsupported claims.
- Keep the no-JavaScript mobile navigation visible without horizontal overflow.

## PORT-011 — Copy and responsive portrait feedback

**Status:** Complete

- Lead the FlipOff summary with its forked implementation status.
- Name both email and LinkedIn in the Home contact invitation.
- Center the Home portrait and caption when the hero stacks on tablet and mobile layouts.
- Keep the header monogram unchanged until a separate visual choice is approved.

## PORT-012 — Satellites parallel-computing case study

**Status:** Complete

- Add Satellites as the sixth approved Work story and fourth equal Home project card.
- Attribute the individual course exercise to its Tampere University-provided starter-code foundation without publishing source or executables.
- Publish a measured sequential-versus-parallel comparison with hardware-qualified wording, an H.264 demo, and a reduced-motion poster fallback.
- Extend static validation and browser QA for the new content, assets, playback behavior, and project counts.
