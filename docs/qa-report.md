# Portfolio QA Report

Validated locally on 17 September 2026 against the production files served by a static HTTP server.

## Automated static checks

`node scripts/check-site.mjs` passes with no failures. It verifies:

- required pages, assets, redirects, metadata, canonical URLs, `robots.txt`, and `sitemap.xml`;
- internal links, fragment targets, referenced assets, image alternative text, and safe external-link attributes;
- the six-project Work allowlist in its approved order, four Home project cards, content exclusions, privacy constraints, and absence of phone, contact-form, framework, and resume content;
- public-safe Counsel and Demola treatment, Voice Agent provider/demo evidence, and FlipOff fork attribution.
- the Satellites fragment, starter-code attribution, private-source treatment, MP4 and poster references, and the distinct Home and Work playback behavior.

## PORT-012 Satellites production extension

The approved Satellites project was checked on the production Home and Work pages at 320, 390, 768, and 1440 pixels.

- Work contains six case studies in the approved order; Satellites is item `06` and resolves at `work.html#satellites`.
- Home contains four equally prominent project cards in a two-column desktop grid and a one-column mobile layout. Its section action uses the future-proof wording “View all projects.”
- Every tested width has one `h1`, no horizontal overflow, and no broken local media reference.
- The silent H.264 comparison is 8.53 seconds and approximately 535 KB; its WebP poster is approximately 35 KB.
- Home starts the muted loop only near the viewport when reduced motion is not requested, pauses it off-screen, and returns to the poster at time zero when reduced motion is enabled.
- Work exposes native playback controls and does not autoplay. With JavaScript disabled, Home remains readable, navigation remains visible, and the poster remains available without autoplay.
- At 390 pixels, the mobile menu opens, closes with Escape, updates `aria-expanded`, and returns focus to its trigger.
- Production screenshots for Home and Work at 390 and 1440 pixels are stored under the ignored `output/playwright/production/` directory.

The media labels use results from three comparable local runs with seed 42, 64 satellites, and a 1920-by-1024 render size. Median total frame latency was 1,009 ms for the supplied sequential reference path and 88 ms for the OpenMP/OpenCL implementation. The OpenCL device was reported as `gfx90c`; the public caption identifies the device and notes that performance varies by hardware. The original parallel implementation also reported zero early-frame pixel-comparison errors during capture.

## Browser matrix

Playwright tested Home, Work, About, and 404 at widths of 320, 390, 768, and 1440 pixels.

- No tested page had horizontal overflow or broken images.
- Home, Work, and About retained the expected primary heading at every width.
- At 390 pixels, each mobile menu opened, closed with Escape, updated `aria-expanded`, and returned focus to its trigger.
- The Voice Agent demo audio loaded successfully with a 155-second duration.
- The standard browser matrix produced no console or page errors.
- With reduced motion enabled, interactive transitions reduce to effectively zero duration.
- With the site script intentionally blocked, the 390-pixel Home page remained readable and its navigation remained visible; the single logged network error was the intentional script abort.
- Live navigation confirmed `projects.html` redirects to `work.html`, `about-me.html` to `about.html`, and `contact-me.html` to `about.html#contact`.

## Lighthouse

Lighthouse 13.4.1 reports 100 for Performance, Accessibility, Best Practices, and SEO on Home, Work, and About. The temporary portrait is served as a 34 KB WebP display asset while the original PNG remains available for Open Graph metadata and future replacement.

## Review evidence

Production desktop and mobile screenshots for Home, Work, and About are stored under the ignored `output/playwright/production/` directory for the final approval checkpoint.

## Early hardware extension

The approved About extension was tested at 320, 390, 768, and 1440 pixels.

- All 13 original hardware photographs load across three manual carousels.
- Cycling every photograph leaves both the 4:3 media frames and complete card dimensions unchanged.
- Counters wrap correctly, no tested width has horizontal overflow, and no image is broken.
- The grid resolves to one, two, and three columns at mobile, tablet, and desktop widths respectively.

## About information panel

The approved `At a glance` panel was checked at 320, 390, 768, 1018, and 1440 pixels.

- It uses two hero columns at the annotated 1018-pixel desktop width and stacks without overlap at narrower widths.
- Every tested width has one `h1`, no broken images, no panel/content overlap, and no horizontal overflow.
- Mobile navigation still opens, closes with Escape, updates `aria-expanded`, and returns focus to its trigger.
- Reduced-motion transitions collapse to effectively zero duration and standard execution produces no console or page errors.
- With JavaScript blocked, the panel remains readable, all three first carousel images remain visible, carousel controls remain hidden, and navigation wraps without overflow at 320, 390, and 768 pixels.
- The final extended About page retains Lighthouse scores of 100 for Performance, Accessibility, Best Practices, and SEO.

## PORT-011 copy and responsive portrait feedback

The Home and Work feedback pass was checked at 320, 390, 759, 768, 980, 981, and 1440 pixels.

- The Home portrait and caption are centered throughout the stacked layout up to and including 980 pixels; the two-column desktop composition resumes at 981 pixels.
- No tested width has horizontal overflow or a broken image.
- The Home contact invitation names both email and LinkedIn, and the FlipOff lead begins by identifying the project as a forked implementation.
- At 390 pixels, the mobile menu still opens, closes with Escape, updates `aria-expanded`, and returns focus to its trigger.
- The browser pass produced no console errors.
