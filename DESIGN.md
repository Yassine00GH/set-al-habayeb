# Design Brief

## Direction

Safran & Terracotta — a warm Tunisian editorial restaurant site that pairs elegant serif display type with a modern sans body on a cream, saffron, terracotta and olive palette.

## Tone

Refined warm maximalism — an artistic, curated dining experience that feels like a crafted object, not a template, echoing Tunisian hospitality and craft.

## Differentiation

Signature arched "keyhole" motif (rounded-arch radii) evoking Tunisian architecture, paired with warm terracotta→safran gradients and a subtle grain texture across surfaces.

## Color Palette

| Token      | OKLCH        | Role                                   |
| ---------- | ------------ | -------------------------------------- |
| background | 0.965 0.02 78| warm cream canvas                       |
| foreground | 0.22 0.035 45| deep warm espresso text                 |
| card       | 0.99 0.012 80| elevated warm surface                   |
| primary    | 0.5 0.13 32  | terracotta — CTAs, links, active        |
| accent     | 0.64 0.14 72 | safran — highlights, badges, gradients  |
| secondary  | 0.86 0.045 120| olive — supporting surfaces             |
| muted      | 0.93 0.02 78 | soft section backgrounds                |

## Typography

- Display: Fraunces (serif) — hero, section headings, restaurant name
- Body: General Sans (sans) — paragraphs, UI labels, nav
- Scale: hero `text-5xl md:text-7xl font-display tracking-tight`, h2 `text-3xl md:text-5xl font-display`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Warm layered surfaces: elevated cards cast soft warm `shadow-elevated`, subtle `shadow-subtle` on interactive elements, gradients and grain add depth without flat fills.

## Structural Zones

| Zone    | Background           | Border   | Notes                                |
| ------- | -------------------- | -------- | ------------------------------------ |
| Header  | bg-card/80 backdrop-blur | border-b | fixed, translucent warm glass        |
| Content | bg-background        | —        | alternate bg-muted/30 sections       |
| Footer  | bg-muted/40          | border-t | warm olive-tinted close              |

## Spacing & Rhythm

Spacious editorial rhythm — `py-24 md:py-32` section gaps, generous `gap-8` grids, tight tracking on display headings, comfortable line-height on body.

## Component Patterns

- Buttons: primary terracotta `rounded-full` with warm gradient hover lift; secondary outline olive
- Cards: `rounded-3xl` warm card bg, `shadow-elevated`, hover translate-y + shadow
- Badges: `rounded-full` safran-tinted with uppercase tracking label

## Motion

- Entrance: `fade-up` on scroll, staggered 0.7s ease-out
- Hover: smooth `transition-smooth` lift + shadow on interactive elements
- Decorative: gentle `float` on hero motif, gradient shimmer on accents

## Constraints

- All copy in French (lang="fr")
- Responsive mobile-first via sm/md/lg breakpoints
- Token-only styling — no raw hex/rgb literals in components
- Do NOT build online reservation or takeaway ordering (out of scope)

## Signature Detail

The arched "keyhole" motif and warm terracotta→safran gradient text make the restaurant's identity unmistakable and distinctly Tunisian.
