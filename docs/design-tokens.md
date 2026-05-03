# ElectionGuide AI — Design Tokens
> Extracted from Stitch-generated UI designs (21 screens)

## Color Palette (Material Design 3 — Custom Theme)

### Primary
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#00236f` | Deep navy — text headings, high-emphasis |
| `primary-container` | `#1e3a8a` | Dark blue — filled buttons, active states |
| `on-primary` | `#ffffff` | White — text on primary surfaces |
| `on-primary-container` | `#90a8ff` | Light blue — text on dark containers |
| `primary-fixed` | `#dce1ff` | Pale blue — badges, light backgrounds |
| `primary-fixed-dim` | `#b6c4ff` | Medium lavender — inverse accent |
| `on-primary-fixed` | `#00164e` | Very dark navy — on fixed surfaces |
| `on-primary-fixed-variant` | `#264191` | Medium navy — variant text |
| `inverse-primary` | `#b6c4ff` | Lavender — dark-mode accent |

### Secondary (Orange / Saffron)
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#8f4e00` | Deep orange — secondary emphasis |
| `secondary-container` | `#fe9832` | Bright saffron — accent badges, highlights |
| `on-secondary` | `#ffffff` | White |
| `on-secondary-container` | `#683700` | Dark brown |
| `secondary-fixed` | `#ffdcc2` | Peach — light bg |
| `secondary-fixed-dim` | `#ffb77a` | Warm gold |
| `on-secondary-fixed` | `#2e1500` | Very dark |
| `on-secondary-fixed-variant` | `#6d3a00` | Dark amber |

### Tertiary (Green / Success)
| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary` | `#013300` | Deep green |
| `tertiary-container` | `#034c00` | Dark green — progress bars |
| `on-tertiary` | `#ffffff` | White |
| `on-tertiary-container` | `#58c345` | Bright green — active indicators |
| `tertiary-fixed` | `#8dfc75` | Light green |
| `tertiary-fixed-dim` | `#72de5c` | Medium green — verified badges |
| `on-tertiary-fixed` | `#012200` | Very dark green |
| `on-tertiary-fixed-variant` | `#035300` | Dark forest |

### Error
| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#ba1a1a` | Error red |
| `error-container` | `#ffdad6` | Light pink — error background |
| `on-error` | `#ffffff` | White |
| `on-error-container` | `#93000a` | Dark red |

### Surface / Background
| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#f8f9ff` | Main background |
| `surface-bright` | `#f8f9ff` | Same as surface |
| `surface-dim` | `#cbdbf5` | Dimmed dividers |
| `surface-container-lowest` | `#ffffff` | Cards (highest elevation) |
| `surface-container-low` | `#eff4ff` | Subtle backgrounds |
| `surface-container` | `#e5eeff` | Medium elevation |
| `surface-container-high` | `#dce9ff` | High elevation chips/search |
| `surface-container-highest` | `#d3e4fe` | Highest elevation |
| `surface-variant` | `#d3e4fe` | Selected states |
| `surface-tint` | `#4059aa` | Tint overlay |
| `background` | `#f8f9ff` | Page background |
| `on-surface` | `#0b1c30` | Primary text |
| `on-surface-variant` | `#444651` | Secondary text |
| `on-background` | `#0b1c30` | Same as on-surface |
| `inverse-surface` | `#213145` | Dark mode surface |
| `inverse-on-surface` | `#eaf1ff` | Dark mode text |

### Outline
| Token | Hex | Usage |
|-------|-----|-------|
| `outline` | `#757682` | Medium borders/icons |
| `outline-variant` | `#c5c5d3` | Light borders |

---

## Typography

### Font Family
- **Primary**: `Inter` (400, 500, 600, 700)
- **Indic**: `Noto Sans Devanagari` (for Hindi, Marathi, Sanskrit, Nepali)
- **Fallback**: `system-ui, sans-serif`

### Type Scale
| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `h1` | 40px | 1.2 | 700 | -0.02em |
| `h2` | 32px | 1.3 | 600 | -0.01em |
| `h3` | 24px | 1.4 | 600 | — |
| `body-lg` | 18px | 1.6 | 400 | — |
| `body-md` | 16px | 1.6 | 400 | — |
| `label-sm` | 14px | 1.4 | 500 | 0.01em |
| `caption` | 12px | 1.4 | 400 | — |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Micro gaps |
| `sm` / `base` | 8px | Tight spacing |
| `md` | 16px | Standard padding |
| `lg` / `gutter` | 24px | Section gaps, card padding |
| `xl` | 40px | Large sections |
| `container-max` | 1200px | Max content width |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `DEFAULT` | 4px (0.25rem) | Buttons, inputs |
| `lg` | 8px (0.5rem) | Cards inner elements |
| `xl` | 12px (0.75rem) | Cards, containers |
| `2xl` | 16px | Large cards |
| `full` | 9999px | Pills, avatars |

---

## Shadows
- `shadow-sm`: `0 1px 2px rgba(0,0,0,0.05)` — cards
- `shadow-md`: `0 4px 6px rgba(0,0,0,0.07)` — hover elevation
- Custom: `0 4px 20px -4px rgba(0,35,111,0.1)` — selected cards (language grid)
- Custom: `0 8px 30px -12px rgba(0,35,111,0.15)` — hover cards
- Custom: `0 4px 24px rgba(0,35,111,0.08)` — input focus (chat)

---

## Icon Library
- **Google Material Symbols Outlined** (variable font)
- Settings: `FILL: 0|1`, `wght: 100-700`, `GRAD: 0`, `opsz: 24`
- Filled variants used for active states (`FILL: 1`)

---

## Breakpoints
| Name | Width | Layout |
|------|-------|--------|
| `sm` | 640px | 2-col grid |
| `md` | 768px | Desktop nav visible |
| `lg` | 1024px | Sidebar visible |
| `xl` | 1280px | Right panel visible |

---

## Animation Patterns
- `transition-colors duration-200` — hover color changes
- `transition-all duration-200 ease-in-out` — layout shifts
- `transition-transform` with `active:scale-95` — button press
- `transition-opacity` — fade-in badges
- `hover:shadow-sm` → `hover:shadow-md` — elevation on hover
- `group-hover:translate-x-1` — arrow nudge
- Typewriter cursor blink: `@keyframes blink { 50% { border-color: transparent } }` — AI streaming
