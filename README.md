# Shantanu Garg — Portfolio

A minimal, accessible portfolio for Shantanu Garg, published as a zero-build GitHub Pages site.

## Public routes

- `index.html` — homepage and selected work
- `work.html` — five approved project stories
- `about.html` — experience, education, leadership, earlier activities, and contact

The former `projects.html`, `about-me.html`, and `contact-me.html` routes remain as redirects.

## Local preview

From the repository root:

```powershell
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

## Validation

```powershell
node scripts/check-site.mjs
```

The validator checks the public files, internal links, metadata, privacy constraints, approved content boundaries, and project-specific attribution rules without third-party dependencies.

## Editing

- `docs/site-content.md` is the editorial source of truth.
- `docs/implementation-tickets.md` records the rebuild checkpoints.
- `AGENTS.md` defines content, privacy, design, and deployment guardrails.
- Shared presentation and behavior live in `assets/css/site.css` and `assets/js/site.js`.

No build step, package manager, framework, CMS, runtime API, or database is required.
