# Design Brief — Dream Capture India

## Tone
Luxury/refined professional casting agency platform. Dark, sophisticated, gold-accented. High contrast for clarity, smooth transitions for premium feel.

## Palette
| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary (Gold) | `0.76 0.155 78` | CTAs, highlights, interactive elements |
| Secondary (Dark Brown) | `0.15 0.025 30` | Card depth, secondary accents |
| Background | `0.06 0 0` (dark) / `0.98 0 0` (light) | Page base |
| Foreground | `0.95 0 0` (dark) / `0.1 0 0` (light) | Text |
| Card | `0.1 0 0` (dark) / `0.96 0 0` (light) | Elevated surfaces |
| Muted | `0.14 0 0` (dark) / `0.92 0 0` (light) | Disabled, tertiary elements |
| Destructive | `0.65 0.19 22` | Error, danger actions |

## Typography
- **Display**: Fraunces (serif) — hero headlines, premium moments
- **Body**: GeneralSans (sans-serif) — content, UI labels
- **Mono**: JetBrainsMono — data tables, code snippets, admin interfaces

## Structural Zones
| Zone | Treatment |
|------|-----------|
| Header/Nav | `bg-background` border-bottom `border-border`, sticky |
| Hero | `bg-background` full-width, centered content, large display type |
| Cards | `bg-card` with `shadow-card`, `2px` border-radius |
| Section BG | Alternate `bg-card` / `bg-background` for rhythm |
| Footer | `bg-card` border-top `border-border`, centered |
| Admin Panel | Sidebar `bg-card`, main `bg-background`, tables with alternating rows |

## Shape Language
- Border radius: `2px` (minimal, sharp edges for premium feel)
- Spacing: `16px` (primary), `8px` (secondary), `24px` (hero sections)
- Shadows: `shadow-card` (light) for cards, `shadow-luxury` (deep) for modals/elevations
- No gradients; solid colors only

## Component Patterns
- **CTA Buttons**: `bg-primary text-primary-foreground`, `transition-smooth` on hover (scale 1.02, shadow-luxury)
- **Cards**: `bg-card border border-border`, `shadow-card`, `2px` radius
- **Input Fields**: `bg-input border border-border`, `ring focus:ring-primary`
- **Tables**: Alternating row colors `bg-card` / `bg-background`, mono font
- **Links**: `text-primary underline underline-offset-2`, hover: `opacity-80`

## Motion
- **Default transition**: `0.3s cubic-bezier(0.4, 0, 0.2, 1)` for all interactive elements
- **Entrance animations**: `fade-in 0.3s ease-out`, `slide-up 0.3s ease-out` for card/section reveals
- **Hover states**: Scale 1.02, shadow elevation, color shift to `primary-foreground`
- **No bouncy, playful animations** — all motion conveys precision and refinement

## Differentiation
Luxury through restraint. Gold is sparse and deliberate. Card-based sectioning with intentional background layering. Smooth animations suggest precision. High contrast enforces professional clarity.

## Responsive
Mobile-first design. Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`. Dark mode default; light mode support via class toggle.
