# Design Decisions — ElectionGuide AI

## Deviations from Stitch Designs

### 1. Font Loading Strategy
**Stitch**: CDN Tailwind with inline fonts
**Implementation**: Next.js `next/font/google` for `Inter` + external `<link>` for `Material Symbols` and `Noto Sans Devanagari`
**Rationale**: `next/font` ensures zero-CLS (Cumulative Layout Shift) font loading and automatic subsetting. Material Symbols must remain as an external link because `next/font` doesn't support variable icon fonts.

### 2. Tailwind CSS v4 vs Stitch CDN
**Stitch**: Uses `cdn.tailwindcss.com` with inline config object
**Implementation**: Tailwind CSS v4 with `@theme inline` directives in `globals.css`
**Rationale**: v4 uses CSS-first configuration. All Stitch design tokens are mapped to CSS custom properties via `@theme inline` blocks for identical visual output with better performance.

### 3. Accessibility Toolbar Added
**Stitch**: Shows language, contrast, and text-size icons in header but without functional behavior
**Implementation**: Fully functional `FontSizeControls`, `ContrastToggle`, and `LanguageSwitcher` components
**Rationale**: GIGW 3.0 compliance requires functional accessibility controls. Stitch designs show the icons, we've made them operational.

### 4. Skip-to-Content Link
**Stitch**: Not present
**Implementation**: Added as first element in DOM, visible only on focus
**Rationale**: WCAG 2.1 AA and GIGW 3.0 mandatory requirement for keyboard navigation.

### 5. Image Strategy
**Stitch**: Uses Google Stitch CDN URLs directly (`lh3.googleusercontent.com/aida-public/...`)
**Implementation**: Same URLs via Next.js `Image` component with `remotePatterns` whitelist
**Rationale**: Next.js Image provides automatic WebP conversion, lazy loading, and responsive srcsets. The same visual, better performance.

### 6. CSS Custom Properties for Accessibility
**Stitch**: Static colors only
**Implementation**: CSS variables for font-size multiplier and high-contrast mode overrides
**Rationale**: Enables runtime accessibility adjustments without page reload.

### 7. Animation Approach
**Stitch**: CSS transitions only
**Implementation**: CSS transitions for simple hover/focus effects (matching Stitch exactly) + IntersectionObserver for stats counter animation
**Rationale**: Stats counter adds engagement without impacting performance. All transitions respect `prefers-reduced-motion`.

### 8. Color Token Naming
**Stitch**: Tailwind class names like `text-primary-container`, `bg-surface-container-lowest`
**Implementation**: Same names mapped via `@theme inline` CSS custom properties
**Rationale**: 1:1 mapping ensures identical class usage. Tailwind v4's CSS-first approach means these tokens are available everywhere.

## Technology Decisions

| Decision | Choice | Alternatives Considered |
|----------|--------|------------------------|
| Framework | Next.js 14 App Router | Vite + React Router |
| CSS | Tailwind CSS v4 | Vanilla CSS |
| Icons | Material Symbols Outlined | Lucide, Heroicons |
| i18n | next-intl (planned) | react-i18next |
| Animation | CSS transitions + IntersectionObserver | Framer Motion |
| Component lib | Custom (Stitch-matched) | shadcn/ui base |
