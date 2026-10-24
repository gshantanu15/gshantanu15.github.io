# Banyan source and glyph conversion

The source is an original generated botanical specimen, not a photograph of a particular real tree. It contains no personal image or private material.

- Mode: built-in `image_gen` with transparent background requested.
- Selected source: `banyan-source-v2.png`, 1536 × 1024 with alpha.
- Website master: `../assets/banyan-glyph.webp`, 1800 × 1200, native 3:2 proportions.
- Glyph data: `../assets/banyan-glyph.json`, 300 columns and 108 rows. The physical cells are approximately 1.85 times taller than wide, as specified by Hallmark Terminal.
- Font: self-hosted Martian Mono; colors: the eight existing Terminal glyph tokens.
- Source conversion: `../scripts/make-banyan.mjs`; optional local authoring only, with no service or package needed by the published website.

The browser never downloads the source PNG. It serves only the glyph fallback and local point data. The runtime retains a fixed 3:2 canvas, with a density capped at 2×. Image and canvas share `object-fit` and crop position: a complete tree on desktop, a natural close crop on portrait screens. Neither layer uses `fill` or stretches its characters independently in each direction.

Hanging bark/root regions have staggered growth timing. Leaf clusters and the main trunk remain stable; the actual outline of each aerial root comes from the botanical source. The glyph sequence is drawn from the existing portfolio text and permuted to avoid readable repeated words competing with page copy.

## Generation prompt

Create a high-resolution botanical PHOTOGRAPHIC asset of one mature banyan tree (Ficus benghalensis), isolated with genuine transparent alpha, landscape composition about 3:2. This will be converted into monochrome character art, so anatomy, readable silhouette and tonal depth matter more than color. Entire tree visible with generous 6% transparent margins, full wide horizontal spreading crown, crown width approximately 2.1 times the tree's complete height. The dense umbrella canopy is irregular and asymmetrical, built of many small natural leaf clusters with subtle holes of negative space and varying tonal density. Under the canopy show a powerful, gnarled, braided main trunk with organic branching limbs spreading horizontally; at least four substantial arching lateral branches visible in negative spaces. Numerous slender aerial roots hang from those actual branches, curling gently down, of staggered lengths and thickness, some becoming secondary prop trunks and some free-hanging; these are a banyan's hanging aerial roots, not underground root tendrils. The whole main tree including roots must remain naturally proportioned, NOT tall/narrow, NOT an upside-down jellyfish, NOT a palm, NOT a symmetrical logo or simplified vector icon. Root tips and flaring foot at the ground must be included but no scenery or soil plane. Natural, realistic texture, grayscale with medium gray leaves, slightly brighter bark/limbs/aerial roots so they separate well when placed on near black; highlights controlled, no glowing edges. No humans, buildings, sky, horizon, other trees, labels, letters, symbols or watermark. Make it look like a careful, lifelike botanical specimen cutout, photorealistic not cartoon. Landscape full-tree framing, do not crop the canopy or roots.
