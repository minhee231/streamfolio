---
name: Cinematic Stream
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#ebbbb4'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#b18780'
  outline-variant: '#603e39'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#690100'
  primary-container: '#ff5540'
  on-primary-container: '#5c0000'
  inverse-primary: '#c00100'
  secondary: '#9ccaff'
  on-secondary: '#003257'
  secondary-container: '#2295ed'
  on-secondary-container: '#002b4c'
  tertiary: '#acc7ff'
  on-tertiary: '#002f67'
  tertiary-container: '#488fff'
  on-tertiary-container: '#00285b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930100'
  secondary-fixed: '#d0e4ff'
  secondary-fixed-dim: '#9ccaff'
  on-secondary-fixed: '#001d35'
  on-secondary-fixed-variant: '#00497b'
  tertiary-fixed: '#d7e2ff'
  tertiary-fixed-dim: '#acc7ff'
  on-tertiary-fixed: '#001a40'
  on-tertiary-fixed-variant: '#004491'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 240px
  sidebar-collapsed-width: 72px
  gutter: 16px
  margin-desktop: 24px
  margin-mobile: 16px
  container-max: 1280px
---

## Brand & Style
The design system is engineered for content immersion, drawing heavy inspiration from modern digital entertainment platforms. The brand personality is focused, high-contrast, and utilitarian, positioning the content as the hero while the interface recedes into the background.

The style is **Corporate Modern with a Cinematic edge**, utilizing deep blacks and vibrant red accents to evoke a theater-like environment. It prioritizes rapid scannability and "video-first" visual hierarchies, making it ideal for portfolio showcases, media libraries, or data-rich dashboards that require high visual impact without sacrificing professional clarity.

## Colors
The palette is built on a "True Dark" foundation to ensure maximum OLED efficiency and content pop. 

- **Primary:** YouTube Red (#FF0000) is reserved strictly for primary calls to action, progress bars, and live indicators.
- **Backgrounds:** The base layer is a deep black (#0F0F0F). 
- **Surfaces:** Elevated components like cards, sidebars, and menus use a lighter charcoal (#272727 or #1F1F1F) to create depth without relying on shadows.
- **Accents:** A secondary blue (#3EA6FF) is used for links and verified badges to provide a cool-toned contrast to the aggressive red.

## Typography
The design system utilizes **Inter** for its systematic, neutral, and highly legible qualities in dark environments. 

Headlines are bold and tightly tracked to feel impactful, mimicking a broadcast aesthetic. Body text uses a slightly diminished white (90% opacity) to reduce eye strain against the black background, while secondary metadata (view counts, dates, descriptions) uses a muted gray to maintain clear information hierarchy.

## Layout & Spacing
The layout follows a **Hybrid Fluid Grid** model:
- **Navigation:** A persistent left-hand sidebar that can collapse into an icon-only rail to maximize content area.
- **Grid:** Content uses a responsive CSS Grid. On desktop, items typically span 3 or 4 columns (4-up or 3-up layout). 
- **Rhythm:** An 8px linear scale governs all spacing.
- **Thumbnails:** Visuals must maintain a 16:9 aspect ratio to reinforce the video-centric aesthetic.

## Elevation & Depth
Depth is communicated through **Tonal Layering** rather than traditional drop shadows.
- **Level 0:** Background (#0F0F0F) - The canvas.
- **Level 1:** Surface (#1F1F1F) - Cards and navigation bars.
- **Level 2:** Hover State (#272727) - Used for ghost buttons and list item hover effects.
- **Level 3:** Overlays (#000000 at 60% opacity) - Used for modals and tooltips.

A subtle 1px border (#FFFFFF with 10% opacity) may be used on cards to define edges where tonal contrast is insufficient.

## Shapes
This design system uses a **Rounded** shape language to soften the high-contrast UI. 
- Elements like thumbnails and cards use a 12px (0.75rem) radius.
- Buttons and input chips use a fully pill-shaped (rounded-full) geometry to provide a tactile, interactive feel.
- Selection indicators (like sidebar active states) use a 10px radius for a modern, friendly appearance.

## Components
- **Buttons:** 
    - *Primary:* Solid Red background, white text, pill-shaped.
    - *Secondary/Ghost:* Transparent background with a light gray hover state (#FFFFFF at 10% opacity). No borders.
- **Chips:** Small, pill-shaped containers for categories. Active chips are solid white with black text; inactive chips are semi-transparent gray.
- **Thumbnails:** 16:9 ratio with 12px corner radius. Must include a duration overlay (bottom right) or progress bar (bottom edge) for project status.
- **Sidebar:** Vertical list of icons and labels. The active state is indicated by a subtle grey background pill and a bolded font-weight.
- **Inputs:** Underlined or subtly boxed with #272727. Focus state changes the border to a neutral white or light gray.
- **Cards:** Vertical stack featuring the thumbnail on top, followed by a title (2 lines max) and metadata in a smaller, muted font.