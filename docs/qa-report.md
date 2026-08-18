# Portfolio QA Report

Validated locally on 18 August 2026 against the production files served by a static HTTP server.

## Automated static checks

`node scripts/check-site.mjs` passes with no failures. It verifies:

- required pages, assets, redirects, metadata, canonical URLs, `robots.txt`, and `sitemap.xml`;
- internal links, fragment targets, referenced assets, image alternative text, and safe external-link attributes;
- the approved project allowlist, content exclusions, privacy constraints, and absence of phone, contact-form, framework, and resume content;
- public-safe Counsel and Demola treatment, Voice Agent provider/demo evidence, and FlipOff fork attribution.

## Browser matrix

Playwright tested Home, Work, About, and 404 at widths of 320, 390, 768, and 1440 pixels.

- No tested page had horizontal overflow or broken images.
- Home, Work, and About retained the expected primary heading at every width.
- At 390 pixels, each mobile menu opened, closed with Escape, updated `aria-expanded`, and returned focus to its trigger.
- The Voice Agent demo audio loaded successfully with a 155-second duration.
- The standard browser matrix produced no console or page errors.
- With reduced motion enabled, interactive transitions reduce to effectively zero duration.
- With the site script intentionally blocked, the 390-pixel Home page remained readable and its navigation remained visible; the single logged network error was the intentional script abort.

## Review evidence

Production desktop and mobile screenshots for Home, Work, and About are stored under the ignored `output/playwright/production/` directory for the final approval checkpoint.
