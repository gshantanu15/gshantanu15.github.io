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
- Add `work.html` with all five approved project stories.
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
