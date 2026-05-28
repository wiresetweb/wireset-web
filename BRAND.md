# Wireset Web — Brand Design Guide

> Reference for generating logos, social images, ad creative, and print assets.
> Every value below is pulled directly from the live site (`styles.css`, `index.html`),
> so anything you produce will match the deployed product exactly.

---

## 1. Brand essence

**What it is:** Websites for local service businesses — HVAC, plumbers, auto shops,
restaurants, wellness/clinics. One-time build fee, low monthly hosting, client owns
the site outright.

**Positioning line:** *"Your Google listing gets the click. Your website closes the deal."*

**Personality:** Direct, plain-spoken, anti-jargon, transparent. Blue-collar-friendly
but modern and credible. Confident without hype. "We sell the close, not the click."
"No contracts, no rental traps."

**Voice for copy on assets:**
- Short, declarative sentences. No marketing fluff, no buzzwords.
- Lead with concrete value and dollar comparisons ($49/mo = less than your phone bill).
- Honest about what they *don't* do (no SEO guarantees, no paid ads).
- Talk like a tradesperson talks: practical, no condescension.

---

## 2. Color palette

### Primary — Navy (the brand anchor)
| Role | Hex | Token | Notes |
|------|-----|-------|-------|
| **Brand navy** | `#0b1a2e` | `--navy` | Primary. Header, hero base, footer, logo square. Also the browser `theme-color`. |
| Deep navy | `#081427` | — | Hero gradient bottom; the darkest tone. |
| Navy tint | `#122544` | `--navy-2` | Secondary navy surface. |
| Navy highlight | `#1c365e` | — | Hero radial-glow accent (upper right). |
| Navy mid | `#1d3a66` | — | Card-art gradients. |

### Secondary — Amber (the action/accent color)
| Role | Hex | Token | Notes |
|------|-----|-------|-------|
| **Brand amber** | `#f5a524` | `--accent` | Primary CTA, logo strokes, bullets, eyebrows, underlines. The single pop color. |
| Amber hover | `#ffb83a` | — | Button/link hover state. |
| Amber light | `#ffc14d` | — | Footer billing-link hover. |
| Amber ink | `#6b3d00` | `--accent-ink` | Dark brown text placed *on* amber buttons (never amber text on amber). |

### Neutrals / text
| Role | Hex | Token |
|------|-----|-------|
| Ink (headings, near-black) | `#0f172a` | `--ink` |
| Body text | `#1f2937` | `--body` |
| Muted text | `#64748b` | `--muted` |
| Footer muted | `#8b97aa` | — |
| Light text on navy | `#c9d3e2` / `#d1d8e3` / `#b6c2d3` | — |
| Hairline border | `#e5e7eb` | `--line` |
| Faint border | `#eef2f6` | `--line-2` |
| Background (white) | `#ffffff` | `--bg` |
| Background alt (warm off-white) | `#f7f7f4` | `--bg-alt` |

### Status accents (use sparingly)
| Role | Hex | Token |
|------|-----|-------|
| Positive / check | `#16a34a` | `--green` |
| Negative / cross | `#b91c1c` | `--red` |

### Palette at a glance for asset tools
```
Primary:    #0b1a2e  (navy)
Secondary:  #f5a524  (amber)
Ink:        #0f172a
Off-white:  #f7f7f4
White:      #ffffff
```
**Pairing rule:** Navy + amber is the brand. Amber is ~5% of any composition — a single
accent (one button, one underline, the logo strokes), never a large fill. Body copy is
near-black on white; inverted sections are light-blue-gray text on navy.

---

## 3. Signature gradients & effects

**Hero background** (navy with an upper-right glow):
```css
radial-gradient(1200px 600px at 80% -10%, #1c365e 0%, transparent 60%),
linear-gradient(180deg, #0b1a2e 0%, #081427 100%)
```

**Amber glow** (used as a subtle corner accent on dark cards/banners):
```css
radial-gradient(circle at top right, rgba(245,165,36,.22), transparent 60%)
```

**Header glass:** `rgba(11,26,46,.92)` + `backdrop-filter: blur(8px) saturate(140%)`.

**Shadows:**
- Small: `0 1px 2px rgba(15,23,42,.06)`
- Medium (cards, lifted elements): `0 6px 24px -8px rgba(15,23,42,.18)`

---

## 4. Logo & mark

**Mark concept:** A stylized **"W"** followed by two vertical strokes — reads as "W" plus
signal/wire bars, tying to "Wire-set." Thin geometric line work, fully rounded caps and joins.

**Geometry (SVG, 32×32 viewBox):**
```svg
<svg viewBox="0 0 32 32">
  <path d="M4 10l4 12 4-9 4 9 4-12M22 10v12M28 10v12"
        stroke="currentColor" stroke-width="2.4" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Lockups:**
- **App / favicon:** navy rounded square (`rx=6`), amber strokes (`#f5a524`).
- **In-header:** amber mark, no square, sitting on the navy bar, beside the wordmark.

**Wordmark:** "Wireset Web" set in the body font, **700 weight**, letter-spacing `-0.01em`,
white on navy. Mark + wordmark gap ≈ `0.55em`.

**Stroke ratio to preserve when scaling:** stroke-width is `2.4` on a 32-unit grid (≈7.5% of
height). Keep round caps/joins at every size — that roundness is the brand's "friendly but
technical" signal.

**Don'ts:** don't fill the mark solid, don't use square caps, don't recolor strokes anything
but amber (on dark) or navy (on light), don't add a drop shadow to the mark itself.

**Ready-made files** (`resources/brand/`):
| File | Use |
|------|-----|
| `wireset-mark.svg` / `wireset-mark-512.png` | Amber mark only, transparent |
| `wireset-mark-navy.svg` / `wireset-mark-navy-512.png` | Navy mark only (for light/amber backgrounds) |
| `wireset-icon.svg` / `wireset-icon-{1024,512,180,32}.png` | App icon / square avatar (navy square + amber mark) |
| `wireset-logo.svg` / `wireset-logo-1008.png` | Horizontal lockup, navy wordmark — light backgrounds |
| `wireset-logo-inverted.svg` / `wireset-logo-inverted-1008.png` | Horizontal lockup, white wordmark — dark backgrounds |

SVGs are the masters (scale infinitely). PNGs are pre-rendered for platforms that reject SVG
uploads (most social avatars, some email clients). Regenerate PNGs from the SVGs with
`cairosvg <file>.svg -o <file>.png -W <px> -H <px>`.

---

## 5. Typography

The site intentionally uses the **native system UI stack** (fast, no web-font load — which
also matters for the bot/bandwidth concerns). For off-site assets where system fonts aren't
available, the closest substitutes are listed below.

**Stack:**
```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```
**Asset substitutes (in this order):** Inter → Helvetica Neue → Arial. Use **Inter** for any
generated graphic to match the on-screen feel most closely.

**Scale & treatment:**
| Element | Size | Weight | Tracking | Notes |
|---------|------|--------|----------|-------|
| H1 | `clamp(2rem, 5.2vw, 3.4rem)` | 700 | `-0.03em` | line-height 1.15 |
| H2 | `clamp(1.6rem, 3.4vw, 2.2rem)` | 700 | `-0.02em` | |
| H3 | `1.15rem` | 700 | `-0.02em` | |
| Body | `17px` | 400 | normal | line-height 1.6 |
| Eyebrow | `0.78rem` | 600 | `+0.12em` | UPPERCASE, amber |
| Button | `1rem` | 600 | normal | |
| Stat number | `clamp(1.75rem, 3.4vw, 2.4rem)` | 700 | `-0.025em` | |
| Small print | `0.9rem` | 400 | normal | muted |

**Headline style:** tight tracking (negative), bold, near-black. Headlines often use a
**two-tone trick** — main clause in ink, the payoff clause in amber (`.accent`). Example:
"Your website **closes the deal.**" ← second line amber.

**Eyebrows** (small uppercase labels above headings) are an amber signature element — use them
on section/ad headers.

---

## 6. Shape language & components

- **Corner radius:** `14px` for cards/containers, `10px` small, **`999px` (full pill)** for all
  buttons and tags. The pill button is a brand signature — never square-corner a CTA.
- **Buttons:**
  - *Primary:* amber fill `#f5a524`, text `#6b3d00`, pill.
  - *Ghost (on dark):* transparent, white text, `rgba(255,255,255,.35)` border.
  - *Outline (on light):* transparent, ink text + ink border; inverts to ink fill on hover.
- **Tags/pills:** uppercase, `0.7rem`, weight 600, `+0.06em` tracking; on imagery they use a
  `rgba(0,0,0,.55)` blurred backdrop with white text.
- **Bullets:** small amber dots (8px circle) or amber check marks drawn as a rotated border.
- **Stat accents:** a short `32×3px` amber bar sits above each stat number.
- **Cards:** white, 1px `#e5e7eb` border, 14px radius, small shadow; lift + scale image on hover.
- **Imagery:** real photography of trades/local businesses, framed **16:9** in card art with a
  dark tag overlay in the corner. Authentic > stock-perfect. (Note: a founder portrait was
  recently removed from the homepage — the brand currently leans on business imagery, not faces.)

---

## 7. Layout system

- **Content max-width:** `1120px`, centered.
- **Side padding:** `clamp(20px, 4vw, 32px)`.
- **Section rhythm:** vertical padding `clamp(64px, 9vw, 110px)`.
- **Alternating bands:** white default; `#f7f7f4` (warm off-white) for emphasis sections;
  navy for hero/footer and the dark CTA banner.
- **Grids:** 4-up cards (→ 2-up → 1-up), 3-up pricing tiers and stats.

---

## 8. Quick spec sheet (paste into asset generators)

```
BRAND: Wireset Web
TAGLINE: Your Google listing gets the click. Your website closes the deal.

COLORS
  Navy (primary):     #0b1a2e
  Deep navy:          #081427
  Amber (accent):     #f5a524
  Amber-on-fill text: #6b3d00
  Ink:                #0f172a
  Body:               #1f2937
  Muted:              #64748b
  Off-white:          #f7f7f4
  White:              #ffffff

TYPE
  Family: Inter / system-ui  (700 headings, 400 body)
  Headings: tight negative tracking, near-black
  Eyebrows: uppercase, amber, +0.12em tracking
  Accent words in headlines: amber

LOGO
  Stylized "W" + two vertical strokes, thin line, rounded caps
  Amber strokes on navy; or navy on light
  App icon: navy rounded square + amber mark

SHAPE
  Pill buttons (radius 999px), 14px card radius
  Amber used as a single small accent, never a large fill

TONE
  Direct, honest, no jargon, value/price-forward, blue-collar-friendly
```
