# Portfolio Rebuild Instructions

## Mission

Rebuild `gshantanu15.github.io` as a modern, minimal portfolio for recruiters and as a durable record of Shantanu Garg's approved work, education, and experience.

Read this file before making any change. Do not infer new content, projects, claims, links, or design features.

## Stack and public routes

- Use semantic HTML, CSS, and minimal vanilla JavaScript only.
- Do not add a framework, package manager, build step, runtime API, CMS, database, analytics, or third-party form.
- Production routes are `index.html`, `work.html`, and `about.html`.
- Preserve legacy URLs with redirects:
  - `projects.html` to `work.html`
  - `about-me.html` to `about.html`
  - `contact-me.html` to `about.html#contact`
- Keep internal links relative so the site works locally and on GitHub Pages.

## Approved content

The editorial source of truth is `docs/site-content.md`. Production copy must match its latest user-approved version.

Approved Work entries:

1. Voice Agent Lab
2. Counsel
3. AI-assisted Object Recognition in AR (Demola)
4. Smart Expense Tracker API
5. FlipOff

The bachelor's thesis belongs under Education, not Work.

Approved professional experience:

- 8Bit Arcade
- PHZ Full Stack Oy

Approved leadership and earlier activities:

- TaSciEn chairperson and treasurer
- User-approved Fairtrade, SDG/sustainability, and service activities
- Early hardware work: Solar-Powered Induction Cooktop, Full-Wave Bridge Rectifier, and Raspberry Pi Robotic Car

The three early hardware projects belong only on About, not in the selected Work allowlist. Their image carousels may use only the original project photographs preserved in repository history.

Never add or mention NBA Analysis, Finland Live, Beopardy, 2D-to-3D Generator, Personal Knowledge Assistant, Student Finance Tracker, the Tampere University research traineeship, or MGIRED in production pages.

## Privacy, truth, and attribution

- Never publish a phone number, contact form, secret, credential, private screenshot, internal URL, private repository link, or unsupported outcome.
- Contact options are email, LinkedIn, and GitHub only.
- Keep Counsel and Demola descriptions high-level. Do not expose their internal architecture or implementation details.
- Describe Demola as a team project and limit Shantanu's contribution to the approved Tripo3D API integration, manual end-to-end testing, teamwork, and delivery language.
- Describe FlipOff as an enhanced fork and retain clear attribution.
- Do not publish a resume link in the launch version.
- Do not invent metrics, dates, roles, technologies, client names, awards, or project outcomes.

## Design system

- Direction: Nordic editorial, light theme only.
- Colors:
  - Background: `#F4F2ED`
  - Surface: `#FCFBF8`
  - Ink: `#171A1D`
  - Muted: `#62696F`
  - Accent: `#315C78`
  - Border: `#D7D4CD`
- Use a system sans-serif stack with restrained monospace accents.
- Use a maximum content width of 1120px, generous whitespace, 12px corners, thin borders, and minimal shadows.
- Limit motion to 160-200ms interface transitions and honor `prefers-reduced-motion`.
- Do not add gradients, scroll-triggered animation, dark mode, skill bars, logo walls, loaders, decorative stock imagery, or generated artwork.
- Use meaningful visuals only. Counsel must not use a private screenshot. Demola imagery requires explicit approval.

## Accessibility and implementation rules

- Use semantic landmarks, one descriptive `h1` per page, a skip link, visible focus states, and `aria-current` navigation.
- The site must remain readable without JavaScript.
- Mobile navigation must manage `aria-expanded`, close on Escape, and return focus to its trigger.
- Every informative image needs meaningful alt text. Decorative images must use empty alt text.
- External links opened in a new tab must use `rel="noopener noreferrer"`.
- Avoid duplicated scripts and styles. Production uses one shared stylesheet and one small script.

## Approval gates

Work on one gate at a time and stop for user approval after each gate:

1. Content: update `docs/site-content.md` and present the complete copy in chat.
2. Prototype: build only under `prototype/`; show functional Home and Work pages plus 1440px and 390px screenshots.
3. Production: implement the approved content and visual system in root pages; show screenshots and a diff summary.
4. Deployment: push to the publishing branch only after explicit final approval.

Do not modify production pages during the content or prototype gates. Do not deploy, push, or alter GitHub Pages settings without explicit approval.

## Local verification

- Preview: `python -m http.server 8000`
- Static validation, once added: `node scripts/check-site.mjs`
- Check layouts at 320px, 390px, 768px, and 1440px.
- Verify keyboard navigation, reduced motion, internal links, external-link safety, metadata, alt text, and absence of horizontal overflow.
- Before reporting completion, inspect `git diff` and confirm that no unrelated or unapproved content changed.

## Change discipline

- Keep content, prototype, production, QA, and optional legacy cleanup in separate commits.
- Make the smallest change necessary to address feedback.
- Preserve user changes and repository history.
- Do not delete legacy assets until the production site passes validation; any cleanup must be separate and reviewable.
