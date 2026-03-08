# Client Design System Documentation

> **Note:** This codebase contains **two parallel frontend implementations** that coexist in the same `client/` folder:
> - **JSX Storefront** (`App.jsx`, `components/navbar.jsx`, `pages/HomePage.jsx`, etc.) — The primary, actively styled storefront. Brand: **SprintShoes / Classic Shoes**. Custom hash-based router. Amber/neutral/dark design language.
> - **TSX Storefront** (`App.tsx`, `layouts/ClientLayout.tsx`, `pages/auth/`, `pages/checkout/`, etc.) — A secondary implementation. Brand: **StepStyle**. Uses React Router DOM v6, MUI v5, and an orange (#E65100) color scheme.
>
> Both are documented separately where they differ. The JSX storefront is the primary design reference.

---

## 1. Design System Overview

The primary JSX storefront follows a **premium, high-contrast athletic footwear** aesthetic. The visual language is:

- **Dark hero sections** with a near-black (`#030303`) background and floating geometric shapes
- **Amber/yellow as the sole accent color** (`#f59e0b` / `#F2D200` / `yellow-400`) for all CTAs, active states, prices, and highlights
- **Clean white content areas** with neutral-100 to neutral-950 grays for depth
- **Bold uppercase typography** for headings and labels, with tight tracking
- **Rounded cards** (`rounded-2xl`, `rounded-3xl`) throughout product and content components
- **Motion-first** — almost every section uses either Framer Motion, GSAP, or CSS `animation` utilities
- **No borders on CTAs** — buttons are filled solids with no outline style as primary actions

The TSX storefront (StepStyle) is more utilitarian: MUI components styled with Tailwind overrides, orange (#E65100) as primary color, and a standard e-commerce layout with dark mode support.

---

## 2. Color Palette

### 2a. CSS Custom Properties (`src/index.css` — `@theme` block)

These are Tailwind v4-style CSS variables usable via `bg-primary`, `text-dark-900`, etc.:

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#f59e0b` | Brand amber — focus rings, active indicators |
| `--color-primary-dark` | `#d97706` | Hover state for primary elements |
| `--color-primary-light` | `#fbbf24` | Lighter amber for backgrounds |
| `--color-dark-900` | `#0a0a0a` | Deepest background (near-black) |
| `--color-dark-800` | `#171717` | Dark surface |
| `--color-dark-700` | `#262626` | Dark card background |
| `--color-dark-600` | `#404040` | Dark border/divider |
| `--color-dark-500` | `#525252` | Muted text on dark backgrounds; video progress inactive color |
| `--color-light-100` | `#ffffff` | Pure white |
| `--color-light-200` | `#fafafa` | Off-white page background |
| `--color-light-300` | `#f5f5f5` | Scrollbar track, shimmer base |
| `--color-light-400` | `#e5e5e5` | Scrollbar thumb, shimmer highlight |
| `--color-light-500` | `#d4d4d4` | Scrollbar thumb hover |
| `--color-green` | `#22c55e` | Success states |
| `--color-red` | `#ef4444` | Error states |
| `--color-orange` | `#f97316` | Supporting accent (rarely used directly) |

### 2b. Tailwind Config Extended Colors (`tailwind.config.js`)

```js
colors: {
  primary: '#1f2937',    // dark gray — NOTE: effectively unused in practice
  secondary: '#3b82f6',  // blue — NOTE: effectively unused in practice
  accent: '#ec4899',     // pink — NOTE: effectively unused in practice
}
```
> ⚠️ These tailwind config tokens are rarely applied in actual class usage. The app uses Tailwind's built-in palette (amber, neutral, rose, green) directly.

### 2c. Colors Used in Practice (JSX Storefront)

| Color | Tailwind Class | Hex | Where Used |
|---|---|---|---|
| Amber 500 | `bg-amber-500` / `text-amber-500` | `#f59e0b` | Product card name hover, badges, star ratings, filters active, video progress bar |
| Amber 400 | `bg-amber-400` / `text-amber-400` | `#fbbf24` | Star ratings fill, "Buy Now" button, category card "Shop Now" icon |
| Amber 600 | `text-amber-600` | `#d97706` | Section label text ("✦ Featured"), breadcrumb hover, filter label text |
| Yellow 400 | `bg-yellow-400` | `#facc15` | Mobile cart button, navbar desktop cart count badge, "Add to Cart" quick action |
| `#F2D200` (custom) | `bg-[#F2D200]` | `#F2D200` | Hero CTA buttons ("Shop Men", "Shop Women") |
| `#E5C700` (custom) | `hover:bg-[#E5C700]` | `#E5C700` | Hero CTA hover state |
| `#E5F525` (custom) | `bg-[#E5F525]` | `#E5F525` | BannerSection yellow-green strip background |
| `#FF3366` (custom) | `bg-[#FF3366]` | `#FF3366` | BannerSection headline highlight box ("GOOD SHOES") |
| Neutral 900 | `bg-neutral-900` / `text-neutral-900` | `#171717` | Primary text, "Add to Cart" button, footer links hover, section dark backgrounds |
| Neutral 950 | `bg-neutral-950` | `#0c0a09` | Footer background |
| Neutral 50 | `bg-neutral-50` | `#fafafa` | Products page background, filter sidebar bg |
| Neutral 100 | `bg-neutral-100` | `#f5f5f5` | Search input background, badge backgrounds, skeleton shimmer |
| White | `bg-white` | `#ffffff` | Navbar, cards, modal, content sections |
| `#030303` | `bg-[#030303]` | `#030303` | Hero section background |
| Rose 500 | `bg-rose-500` / `text-rose-500` | `#f43f5e` | Discount badge, heart/favorite active color |
| Rose 50/100 | `bg-rose-50` / `bg-rose-100` | `#fff1f2`/`#ffe4e6` | Discount save badge background |
| Green 50/100/500/600 | various | `#f0fdf4`/`#dcfce7`/`#22c55e`/`#16a34a` | In-stock filter, success messages, newsletter success, free shipping indicator |
| Blue 600 | `text-blue-600` / `border-blue-600` | `#2563eb` | Customer review card border, verified badge icon — **inconsistency** |
| Gray 200 | `border-gray-200` | `#e5e7eb` | Dividers, input borders, feature card borders |
| Gray 500 | `text-gray-500` | `#6b7280` | Secondary text (feature card subtitles, footer meta) |

### 2d. TSX Storefront / MUI Theme Colors (`src/lib/theme.ts`)

**Light Theme:**
| Token | Value |
|---|---|
| `primary.main` | `#E65100` (deep orange) |
| `primary.light` | `#FF833A` |
| `primary.dark` | `#AC1900` |
| `secondary.main` | `#1565C0` |
| `secondary.light` | `#5E92F3` |
| `background.default` | `#FAFAFA` |
| `background.paper` | `#FFFFFF` |

**Dark Theme:**
| Token | Value |
|---|---|
| `primary.main` | `#FF833A` |
| `primary.light` | `#FFB06B` |
| `primary.dark` | `#C65A00` |
| `secondary.main` | `#5E92F3` |
| `background.default` | `#0A0A0A` |
| `background.paper` | `#1A1A1A` |

In the TSX codebase, orange-600 (`#ea580c`) is the primary action color: `bg-orange-600`, `hover:bg-orange-700`, `focus:ring-orange-500`.

---

## 3. Typography

### 3a. Font Families

| Font | Where Defined | Usage |
|---|---|---|
| `'Jost', sans-serif` | `--font-jost` in `index.css @theme` | Defined as CSS variable but **not actually applied** globally in practice |
| `'Inter', system-ui, sans-serif` | `tailwind.config.js` `fontFamily.sans` | Applied as Tailwind's `font-sans` — **the actual body font throughout** |
| `"Inter", "Roboto", "Helvetica", "Arial", sans-serif` | MUI `theme.ts` `typography.fontFamily` | MUI component typography (TSX storefront) |

> The Jost font variable is defined but `font-jost` class is not applied to the body or any component. Inter is the effective font everywhere.

### 3b. CSS Typography Scale (`@theme` tokens)

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-heading-1` | `72px` | `78px` | `700` | Largest hero headings (not actively used in Tailwind classes) |
| `--text-heading-2` | `56px` | `60px` | `700` | Large section headings |
| `--text-heading-3` | `24px` | `30px` | `500` | Sub-section headings |
| `--text-lead` | `20px` | `28px` | `500` | Lead paragraph text |
| `--text-body` | `16px` | `24px` | `400` | Default body text |
| `--text-body-medium` | `16px` | `24px` | `500` | Medium-weight body |
| `--text-caption` | `14px` | `20px` | `500` | Captions, labels |
| `--text-footnote` | `12px` | `18px` | `400` | Fine print, meta text |

### 3c. Tailwind Typography Classes Actually Used

| Element | Classes | Computed |
|---|---|---|
| Hero H1 | `text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight` | 36px / 48px / 60px, 700 |
| Section header H2 | `text-3xl sm:text-4xl lg:text-5xl font-bold` | 30px / 36px / 48px, 700 |
| Product detail H1 | `text-3xl lg:text-4xl font-bold leading-tight` | 30px / 36px, 700 |
| Product card name | `text-base font-bold` | 16px, 700 |
| Brand label | `text-xs font-semibold uppercase tracking-widest` | 12px, 600, wide spacing |
| Section eyebrow label | `text-xs font-bold uppercase tracking-wider` | 12px, 700 |
| Nav links | `text-sm font-semibold tracking-wide` | 14px, 600 |
| Price (large) | `text-xl font-bold` / `text-3xl font-bold` | 20px / 30px, 700 |
| Price (strikethrough) | `text-sm text-neutral-400 line-through` | 14px, 400, neutral-400 |
| Review count | `text-xs font-medium text-neutral-500` | 12px, 500 |
| Button text | `font-bold text-sm uppercase tracking-wide` | 14px, 700 |
| Footer links | `text-sm text-neutral-400 uppercase` | 14px, 400 |
| Footer copyright | `text-sm text-neutral-500` | 14px, 400 |
| Input placeholder | `placeholder:text-neutral-400` / `placeholder:text-gray-400` | 16px, 400 |
| Error messages | `text-sm text-red-600` / `text-xs text-red-600` | 14px / 12px |
| Breadcrumb | `text-sm text-neutral-500` | 14px, 400 |

### 3d. MUI Typography (TSX storefront `theme.ts`)

| Variant | Weight |
|---|---|
| `h1`, `h2` | `700` |
| `h3`, `h4` | `600` |
| All others | MUI default |

---

## 4. Spacing & Layout

### 4a. Container

All pages use the same container pattern:
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```
- Max width: **1280px** (`max-w-7xl`)
- Mobile padding: **16px** (`px-4`)
- Tablet padding: **24px** (`sm:px-6`)
- Desktop padding: **32px** (`lg:px-8`)

### 4b. Section Vertical Spacing

| Section | Padding |
|---|---|
| Hero | `h-[500px]` fixed height, `py-8` inner |
| Highlights | `py-16 sm:py-20 lg:py-8` |
| FeaturedProducts | `pt-8 pb-20 sm:pt-12 sm:pb-28` |
| CustomerReviews | `py-16 sm:py-20` |
| Newsletter (service bar) | `py-8` |
| Newsletter (form) | `py-12` |
| BannerSection yellow | `py-16 px-4` |
| BannerSection features | `py-16 px-4` |
| Footer main | `py-16` |
| Footer bottom bar | `py-6` |
| ProductsPage header | `py-8` |
| ProductsPage content | `py-10` |

### 4c. Grid System

Tailwind CSS Grid is used throughout (no CSS Grid framework):

| Component | Grid | Gap |
|---|---|---|
| Hero section | `grid-cols-1 lg:grid-cols-2` | `gap-8` |
| Product grid (4-col) | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` | `gap-6` |
| Product grid (3-col) | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | `gap-6` |
| Footer columns | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` | `gap-12` |
| BannerSection features | `grid-cols-1 md:grid-cols-3` | `gap-8` |
| Product detail | `grid-cols-1 lg:grid-cols-2` | `gap-10 lg:gap-16` |
| Size selector | `grid-cols-5 sm:grid-cols-6` | `gap-2` |
| Category cards | `grid-cols-1 md:grid-cols-2` | `gap-8` |
| Review card | `grid-cols-1 md:grid-cols-2` | none |
| Benefits row (detail) | `grid-cols-1 sm:grid-cols-3` | `gap-4` |

### 4d. Sidebar Layout (Products Page)

```
ProductsPage:
  ├── <aside> lg:w-64 shrink-0  (hidden on mobile, sticky top-24)
  └── <main> flex-1 min-w-0
```
Sidebar is sticky: `sticky top-24`

### 4e. Spacing Scale (Common Patterns)

| Usage | Value |
|---|---|
| Card internal padding | `p-5` (20px) or `p-6` (24px) |
| Stacked form fields | `space-y-4` (16px) or `space-y-6` (24px) |
| Icon + text gap | `gap-2` (8px) or `gap-3` (12px) |
| Button internal padding | `px-6 py-3` or `px-10 py-4` |
| Section header bottom margin | `mb-12` (48px) |
| Product card image-to-content border | `border-t border-neutral-100` |
| Nav height | `h-16` (64px) |

---

## 5. Component Design Patterns

### 5a. ProductCard (`components/ProductCard.jsx`)

**Container:** `rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden`

**Image area:** `aspect-square overflow-hidden bg-neutral-100`
- Hover: image scales `group-hover:scale-110 duration-700`
- Gradient overlay: `bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 duration-300`

**Badges (top-left, `flex-col gap-2`):**
- NEW: `px-3 py-1.5 text-xs font-bold bg-neutral-900 text-white rounded-full` + `animate-bounce-in`
- BESTSELLER: same style + 🔥 emoji
- Discount: same but `bg-rose-500`

**Favorite button (top-right):**
- Default: `opacity-0 translate-x-4` hidden off-screen
- Hover appears: `group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`
- Background: `bg-white/95 backdrop-blur-sm rounded-full p-2.5`
- Active (favorited): `fill-rose-500 text-rose-500 scale-110`

**Quick action bar (bottom, slides up on hover):**
- Container: `opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500`
- Add to Cart: `flex-1 py-3 bg-yellow-400 text-black font-bold text-sm rounded-xl hover:bg-yellow-500`
- Quick View: `p-3 bg-white text-neutral-700 rounded-xl hover:bg-neutral-100`

**Out-of-Stock overlay:**
`bg-neutral-900/70 backdrop-blur-sm` covering full image, centered pill: `px-6 py-3 bg-white text-neutral-900 font-bold text-sm rounded-full`

**Content area:**
- Brand: `text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1.5`
- Name: `text-base font-bold text-neutral-900 line-clamp-2 group-hover:text-amber-500 transition-colors mb-2.5`
- Stars: filled = `fill-amber-400 text-amber-400`, empty = `fill-neutral-200 text-neutral-200`, `h-4 w-4`
- Price: `text-xl font-bold text-neutral-900`
- Original price: `text-sm text-neutral-400 line-through`
- Save badge: `text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded`
- Color swatches: `w-5 h-5 rounded-full border-2 border-white shadow-md hover:scale-125`

**Stagger animation:** Each card has `animationDelay: index * 100ms`

---

### 5b. Button (UI.jsx generic component)

| Variant | Classes |
|---|---|
| `primary` | `bg-black text-white hover:bg-gray-800 disabled:bg-gray-400` |
| `secondary` | `bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-300` |
| `danger` | `bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400` |
| `success` | `bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400` |
| `outline` | `border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-400` |

| Size | Classes |
|---|---|
| `sm` | `px-3 py-2 text-sm` |
| `md` | `px-4 py-2 text-base` |
| `lg` | `px-6 py-3 text-lg` |

Base: `font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`

Loading state: `opacity-70 cursor-not-allowed` + spinner emoji `animate-spin`

> **Note:** The generic UI.jsx Button uses black as primary. The actual CTAs in product pages use `bg-neutral-900` (Add to Cart) and `bg-amber-500` (Buy Now), which is inconsistent with this component.

---

### 5c. Input (UI.jsx)

Default: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`

Error state: `border-red-500 focus:ring-red-500`

With icon: `pl-10` left padding, icon positioned `absolute left-3 top-3 w-5 h-5 text-gray-400`

Label: `block text-sm font-medium text-gray-700`, required asterisk: `text-red-500 ml-1`

Error message: `text-sm text-red-600`

---

### 5d. Select (UI.jsx)

Same base as Input: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`

---

### 5e. Badge (UI.jsx)

Base: `px-3 py-1 rounded-full text-xs font-semibold`

| Variant | Classes |
|---|---|
| `gray` | `bg-gray-100 text-gray-800` |
| `red` | `bg-red-100 text-red-800` |
| `green` | `bg-green-100 text-green-800` |
| `blue` | `bg-blue-100 text-blue-800` |

---

### 5f. Alert (UI.jsx)

Base: `p-4 rounded-lg border flex justify-between items-center`

| Type | Classes |
|---|---|
| `info` | `bg-blue-50 border-blue-200 text-blue-800` |
| `success` | `bg-green-50 border-green-200 text-green-800` |
| `warning` | `bg-yellow-50 border-yellow-200 text-yellow-800` |
| `error` | `bg-red-50 border-red-200 text-red-800` |

---

### 5g. Spinner (UI.jsx)

`inline-block animate-spin` wrapper + inner `border-4 border-gray-300 border-t-black rounded-full`

| Size | Classes |
|---|---|
| `sm` | `w-4 h-4` |
| `md` | `w-8 h-8` |
| `lg` | `w-12 h-12` |

The Newsletter component uses a custom SVG spinner: `animate-spin w-5 h-5` with `opacity-25` circle and `opacity-75` path in white.

The TSX RegisterPage spinner: `w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin`

---

### 5h. Card (UI.jsx)

`bg-white border border-gray-200 rounded-lg p-6 shadow-sm`

Hoverable: `hover:shadow-lg cursor-pointer transition-shadow`

---

### 5i. Modal (UI.jsx)

Backdrop: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`

Container: `bg-white rounded-lg shadow-lg w-full mx-4`

Sizes: `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`

Header: `flex justify-between items-center border-b border-gray-200 p-6`

Body: `p-6`

Footer: `border-t border-gray-200 p-6 flex justify-end gap-3`

Close button: `text-gray-400 hover:text-gray-600 text-2xl cursor-pointer`

---

### 5j. Divider (UI.jsx)

Plain: `border-t border-gray-300`

With text: `flex items-center gap-4`, text span: `text-sm text-gray-500 font-medium`, flanked by `flex-1 border-t border-gray-300`

---

### 5k. Filter Radio/Checkbox (ProductFilters.jsx)

Selected state: `bg-amber-50 border-2 border-amber-500`
Default state: `hover:bg-neutral-50 border-2 border-transparent`

Custom radio dot: `w-5 h-5 rounded-full border-2`, selected: `bg-amber-500 border-amber-500`, unselected: `border-neutral-300`

Check icon inside: `w-3 h-3 text-white`

Selected text: `text-amber-700`, unselected: `text-neutral-700`

Count pill: `text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full`

In-stock checkbox: selected container = `bg-green-50 border-2 border-green-500`, checkbox box = `w-6 h-6 rounded-lg bg-green-500 border-green-500` with `w-4 h-4 text-white` checkmark

---

### 5l. Size Selector (ProductDetail.jsx)

Button grid: `grid-cols-5 sm:grid-cols-6 gap-2`

Selected: `bg-neutral-900 text-white border-neutral-900 shadow-lg`
Default: `bg-white text-neutral-700 border-neutral-200 hover:border-amber-500 hover:text-amber-600`
Base: `py-3.5 text-sm font-bold rounded-xl border-2 transition-all`

---

### 5m. Color Swatch Selector (ProductDetail.jsx)

`w-12 h-12 rounded-xl border-3 transition-all shadow-md`

Selected: `border-amber-500 scale-110 ring-2 ring-amber-200`
Default: `border-neutral-200 hover:border-neutral-400`

---

### 5n. Quantity Stepper (ProductDetail.jsx)

Container: `inline-flex items-center border-2 border-neutral-200 rounded-xl overflow-hidden`

Buttons: `p-3.5 hover:bg-neutral-100 hover:text-neutral-900 transition-colors`, disabled when qty <= 1

Count display: `px-6 py-3 font-bold min-w-[60px] border-x-2 border-neutral-200`

---

### 5o. Category Card (FeaturedProducts.jsx)

Container: `rounded-3xl overflow-hidden aspect-[2/1] shadow-lg hover:shadow-2xl transition-all duration-500`

Image: fills container, `group-hover:scale-110 duration-700`

Overlay: `bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent`

Content area (bottom): `p-8 sm:p-10`

Icon + label: `text-amber-400 text-xs font-bold uppercase tracking-wider`

Title: `text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-400 transition-colors`

CTA pill: `bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-yellow-400 group-hover:text-black transition-all`

---

## 6. Page Layouts

### 6a. Home Page (`pages/HomePage.jsx`)

```
<App>
  <Navbar />           ← sticky, h-16, z-50
  <Hero />             ← h-[500px], dark bg, full-bleed
  <Highlights />       ← white bg, VideoCarousel
  <FeaturedProducts /> ← neutral-50 bg, product grid + category cards + new arrivals banner
  <CustomerReviews />  ← white bg, GSAP carousel
  <Newsletter />       ← white bg, service bar + email form
  <Footer />           ← neutral-950 bg
```

### 6b. Products Page (`pages/ProductsPage.jsx`)

```
<div bg-neutral-50>
  ← Header bar (white, border-b)
    ← Breadcrumb (text-sm neutral-500)
    ← Page title (h1 text-3xl/4xl font-bold)
    ← Desktop: product count + SortDropdown
  ← Main content (max-w-7xl, py-10)
    ← flex gap-10
      ← <aside> w-64 (hidden on mobile)
          ← sticky top-24 ProductFilters
      ← <main> flex-1
          ← Mobile ProductFilters (lg:hidden)
          ← ProductGrid (3 columns)
          ← Load More button (if applicable)
```

### 6c. Product Detail Page (`components/ProductDetail.jsx`)

```
<div bg-white min-h-screen>
  ← Breadcrumb (max-w-7xl, py-4)
  ← Product section (max-w-7xl, pb-20)
      ← grid lg:grid-cols-2 gap-10/16
        ← Left: Image Gallery
            ← aspect-square rounded-3xl main image
            ← Thumbnail row (flex gap-3, overflow-x-auto)
        ← Right: Product Info
            ← Brand label (amber-600, uppercase)
            ← Product name (h1, 3xl/4xl)
            ← Star rating
            ← Price box (neutral-50, rounded-2xl, py-4 px-5)
            ← Color swatches
            ← Size grid
            ← Quantity stepper
            ← Add to Cart (flex-1) + Wishlist button
            ← Buy Now (full width, amber-500)
            ← Benefits row (3-col grid, rounded-xl, neutral-50 bg)
  ← Tabs section (mt-20)
      ← Tab bar: description / features / reviews
      ← Tab content (py-10)
  ← Related Products (mt-20)
```

### 6d. Login / Register Page (JSX — `CustomerPages.jsx`)

```
<div min-h-screen bg-gray-50 flex items-center justify-center>
  <div w-full max-w-md bg-white rounded-lg shadow p-8>
    ← LoginForm / RegisterForm
```

### 6e. Register Page (TSX — `pages/auth/RegisterPage.tsx`)

```
<div min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50>
  <div w-full max-w-md mx-auto>
    ← Logo + title (text-center mb-8)
    ← Form card: bg-white rounded-2xl shadow-xl p-8 border border-gray-100
```

### 6f. Cart Page (TSX — `pages/CartPage.tsx`)

```
<div max-w-7xl mx-auto px-4 py-8>
  ← h1 (text-2xl font-bold)
  ← MUI Grid container spacing={4}
    ← xs=12 md=8: Cart items list (space-y-4)
        ← Each item: bg-white rounded-2xl p-4 border border-gray-100 flex gap-4
    ← xs=12 md=4: Order summary (sticky top-24)
        ← bg-white rounded-2xl border border-gray-100 p-6
```

### 6g. Checkout Page (TSX — `pages/checkout/CheckoutPage.tsx`)

```
<div max-w-5xl mx-auto px-4 py-8>
  ← h1
  ← MUI Stepper (3 steps: Address / Payment / Review)
  ← MUI Grid container spacing={4}
    ← xs=12 md=7: Step content (bg-white rounded-2xl border p-6)
    ← xs=12 md=5: Order summary sidebar (sticky top-24)
```

### 6h. Order Success Page (TSX — `pages/checkout/OrderSuccessPage.tsx`)

```
<div min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center>
  ← text-center max-w-lg
    ← Green circle icon (w-20 h-20 bg-green-100 rounded-full)
    ← h1 "Order Placed! 🎉" (text-3xl font-bold)
    ← What happens next card (bg-white rounded-2xl border p-6)
    ← Two action buttons (Track Order + Continue Shopping)
```

### 6i. Profile Page (TSX — `pages/profile/ProfilePage.tsx`)

```
<div max-w-3xl mx-auto px-4 py-8>
  ← h1 "My Account" (text-2xl font-bold)
  ← MUI Tabs (Personal Info / Addresses / Orders)
  ← Tab content: bg-white rounded-2xl border border-gray-100 p-6
```

### 6j. 404 Page (App.jsx inline)

```
<div min-h-screen flex items-center justify-center bg-gray-50>
  <div text-center>
    ← "404" text-6xl font-bold text-gray-900
    ← "Page not found" text-xl text-gray-600
    ← Back to Home button: bg-black text-white rounded-lg px-6 py-3
```

### 6k. Landing Page TSX (`pages/LandingPage.tsx`)

```
<div min-h-screen>
  ← Hero: bg-gradient-to-br from-orange-600 via-orange-500 to-red-600, py-24/32
      ← md:grid-cols-2
      ← Left: chip, h1, p, CTAs, stats row
      ← Right: 👟 emoji in w-80 h-80 rounded-full bg-white/10
  ← Trust badges: bg-gray-50, MUI Grid 4-col
  ← Categories: py-16, grid 3/6-col emoji cards
  ← Featured Products: py-16 bg-gray-50, MUI Grid 4-col
  ← Newsletter: bg-gray-900 dark strip
```

---

## 7. Navigation Design

### 7a. Primary Navbar (`components/navbar.jsx`) — JSX Storefront

**Container:** `sticky top-0 z-50 bg-white border-b border-gray-200`

**Inner nav:** `mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8`

**Logo:**
- Image: `h-24 w-auto object-contain` (logo.png — oversized relative to navbar)
- Text: `hidden sm:block text-xl font-bold text-neutral-900 tracking-tight`
- Brand name: `Sprint` + `<span class="text-amber-500">Shoes</span>`

**Nav links (desktop, hidden on mobile):** `hidden items-center gap-8 md:flex`
- Each link: `text-sm font-semibold tracking-wide transition-colors py-2`
- Active: `text-amber-500`
- Inactive: `text-neutral-700 hover:text-amber-500`
- Active underline: `absolute bottom-0 left-0 h-0.5 bg-amber-500 w-full`
- Inactive underline: `w-0 group-hover:w-full transition-all duration-300`

**Search input (desktop):**
- Container: `w-40 lg:w-52 rounded-full bg-neutral-100 py-2.5 pl-10 pr-4 text-sm`
- Focus: `focus:ring-2 focus:ring-yellow-400/50 focus:bg-white`
- Icon: `h-4 w-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors`

**User icon button:** `p-2.5 rounded-full hover:bg-neutral-100 transition-colors`

**User dropdown:**
- Container: `absolute right-0 w-72 bg-white border border-gray-200 shadow-lg rounded-sm` (flat corners!)
- Header section: `p-6 border-b border-gray-200`
- Title: `text-xl font-bold text-black`
- Subtitle: `text-[13px] text-gray-700`
- CTA: `w-full bg-yellow-400 py-3 font-bold text-black text-[13px] hover:bg-yellow-500`
- Text: "LOGIN / SIGNUP" (uppercase)
- Links: `px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-amber-600 rounded-lg`

**Cart button:**
- `relative p-2.5 rounded-full hover:bg-neutral-100`
- Count badge: `w-5 h-5 bg-yellow-400 text-neutral-900 text-xs font-bold rounded-full` positioned `absolute -top-0.5 -right-0.5`

**Hamburger (mobile only):** `p-2 rounded-lg hover:bg-neutral-100 md:hidden`
- Icon toggles between `<Menu>` and `<X>`, both `h-6 w-6 text-neutral-700`

**Mobile Menu:**
- Container: `border-t border-neutral-200 md:hidden overflow-hidden transition-all duration-300`
- Open: `max-h-[500px] opacity-100`, Closed: `max-h-0 opacity-0`
- Background: `bg-neutral-50`, padding: `px-4 py-4`, `space-y-1`
- Active link: `bg-yellow-400 text-neutral-900 rounded-lg`
- Inactive link: `text-neutral-700 hover:bg-neutral-200 rounded-lg`
- Cart CTA: `flex items-center justify-center gap-2 py-3 bg-yellow-400 text-neutral-900 rounded-lg font-medium`

### 7b. TSX Navbar (`components/common/Navbar.tsx`)

**Container:** `sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm`

**Logo:** Orange-600 rounded square icon (`bg-orange-600 rounded-lg`) + "StepStyle" text

**Active links:** `text-orange-600 dark:text-orange-400`

**Action buttons:** `hover:text-orange-600 hover:bg-orange-50 rounded-lg`

**Cart:** MUI `<Badge>` with `color="error"` for count

**Auth logged-in:** Avatar is `w-7 h-7 bg-orange-600 rounded-full` with initials

**User dropdown:** `w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50`

**Sign Up button:** `bg-orange-600 text-white rounded-lg hover:bg-orange-700`

**Search bar (expands below nav):**
`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:ring-2 focus:ring-orange-500`

**Mobile menu:** Simple dropdown `md:hidden py-4 space-y-2`, active bg: `bg-orange-50 text-orange-600`

---

## 8. Responsive Design

### 8a. Breakpoints (Tailwind defaults)

| Name | Width | `px` |
|---|---|---|
| `sm` | `≥ 640px` | 640px |
| `md` | `≥ 768px` | 768px |
| `lg` | `≥ 1024px` | 1024px |
| `xl` | `≥ 1280px` | 1280px |
| `2xl` | `≥ 1536px` | 1536px |

### 8b. Layout Shifts Per Breakpoint

**Navbar:**
- `< md`: Logo only + hamburger, hidden nav links and desktop actions
- `≥ md`: Full nav links + search + user + cart visible

**Hero:**
- `< lg`: Single-column, shoe image hidden or below text
- `≥ lg`: Two-column grid (text left, shoe image right)
- H1: `text-4xl` → `md:text-5xl` → `lg:text-6xl`

**Product Grid:**
- `< sm`: 1 column
- `≥ sm`: 2 columns
- `≥ lg`: 3 columns
- `≥ xl`: 4 columns (4-col variant)

**Products Page:**
- `< lg`: No sidebar; mobile filter button triggers slide-in drawer
- `≥ lg`: Left sidebar (w-64) + main content side-by-side

**Footer:**
- `< md`: Single column, stacked
- `≥ md`: 2 columns
- `≥ lg`: 4 columns

**Cart (TSX):**
- `< md`: Single column (items then summary)
- `≥ md`: 8/4 MUI Grid split

**Checkout (TSX):**
- `< md`: Single column
- `≥ md`: 7/5 MUI Grid split

**ProductDetail:**
- `< lg`: Single column (image above, info below)
- `≥ lg`: Two columns side by side

**VideoCarousel:**
- `< md`: `aspect-[16/9]`, text size 2xl/lg
- `≥ md`: `aspect-[21/9]`, text size 4xl/2xl, 5xl/3xl on lg
- Progress indicators: `32px` wide active (mobile) → `40px` (tablet) → `48px` (desktop)

**BannerSection headline:**
- `text-4xl` → `md:text-6xl` → `lg:text-7xl`

**Search input width:**
- `w-40` → `lg:w-52`

---

## 9. Theming

### 9a. Tailwind Config (`tailwind.config.js`)

```js
{
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#3b82f6',
        accent: '#ec4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 9b. CSS `@theme` Tokens (`src/index.css`)

Full list of CSS custom properties registered as Tailwind v4 theme tokens:

```css
--color-primary: #f59e0b
--color-primary-dark: #d97706
--color-primary-light: #fbbf24
--color-dark-900 through --color-dark-500
--color-light-100 through --color-light-500
--color-green: #22c55e
--color-red: #ef4444
--color-orange: #f97316
--font-jost: 'Jost', sans-serif
--text-heading-1 through --text-footnote (sizes, line-heights, weights)
--animate-fade-in: fade-in 0.5s ease-out
--animate-slide-up: slide-up 0.5s ease-out
--animate-slide-down: slide-down 0.3s ease-out
--animate-scale-in: scale-in 0.3s ease-out
--animate-bounce-in: bounce-in 0.5s ease-out
```

### 9c. MUI Theme (`src/lib/theme.ts`)

Two themes exported: `lightTheme` and `darkTheme`. Applied via MUI `ThemeProvider` in the TSX app.

**MUI Component Overrides:**
```ts
MuiButton.root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 }
MuiCard.root:   { borderRadius: 12 }
```

### 9d. Dark Mode

- **JSX storefront:** No dark mode. All components hardcode light colors.
- **TSX storefront:** Full dark mode via Tailwind `dark:` classes and `useUiStore` with `toggleTheme`. MUI `ThemeProvider` switches between `lightTheme` and `darkTheme`.

Dark mode classes used in TSX: `dark:bg-gray-900`, `dark:bg-gray-800`, `dark:bg-gray-700`, `dark:text-white`, `dark:text-gray-200`, `dark:border-gray-700`, `dark:border-gray-800`, `dark:text-gray-400`, `dark:hover:bg-gray-700`.

### 9e. Focus Styles (Global)

```css
*:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}
```

### 9f. Selection Color (Global)

```css
::selection {
  background: #fde68a;  /* amber-200 */
  color: #1a1a1a;
}
```

### 9g. Scrollbar

```css
::-webkit-scrollbar       { width: 8px }
::-webkit-scrollbar-track { background: #f5f5f5 }
::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 4px }
::-webkit-scrollbar-thumb:hover { background: #a3a3a3 }
```

---

## 10. Animations & Transitions

### 10a. CSS Keyframe Animations (`src/index.css`)

All animations defined as CSS keyframes and exposed as utility classes:

| Class | Keyframe | Duration | Easing | Trigger |
|---|---|---|---|---|
| `animate-fade-in` | `opacity: 0 → 1` | `0.5s` | `ease-out` | Component mount, section reveal |
| `animate-slide-up` | `opacity:0, translateY(20px) → opacity:1, translateY(0)` | `0.5s` | `ease-out` | Product cards, headings on load |
| `animate-slide-down` | `opacity:0, translateY(-10px) → opacity:1, translateY(0)` | `0.3s` | `ease-out` | Dropdown menus |
| `animate-scale-in` | `opacity:0, scale(0.95) → opacity:1, scale(1)` | `0.3s` | `ease-out` | Modals, popups |
| `animate-bounce-in` | `0% scale(0.3) → 50% scale(1.05) → 70% scale(0.9) → 100% scale(1)` | `0.5s` | `ease-out` | "NEW" badge on product card |
| `animate-float` | `translateY(0) → translateY(-10px) → translateY(0)` | `3s` | `ease-in-out infinite` | Decorative floating elements |
| `animate-pulse-glow` | `box-shadow 0→20px rgba(245,158,11,0.3) → 40px rgba(245,158,11,0.6)` | `2s` | `ease-in-out infinite` | Amber glow effect |
| `animate-slide-in-right` | `translateX(100%) → translateX(0)` | `0.3s` | `ease-out` | Mobile filter drawer |
| `animate-slide-in-left` | `translateX(-100%) → translateX(0)` | `0.3s` | `ease-out` | Left-slide panels |
| `animate-shimmer` | `background-position -200% → 200%` | `1.5s` | `linear infinite` | Skeleton loading screens |

**Stagger utilities:**
```css
.stagger-1 { animation-delay: 0.1s }
.stagger-2 { animation-delay: 0.2s }
.stagger-3 { animation-delay: 0.3s }
.stagger-4 { animation-delay: 0.4s }
.stagger-5 { animation-delay: 0.5s }
```

**Page transition:** `.page-transition { animation: fade-in 0.3s ease-out }` — applied to `ProductsPage` outer div.

**Card stagger:** ProductCard uses inline `animationDelay: index * 100ms`.

### 10b. Framer Motion (Hero component)

**ElegantShape entrance:**
```js
initial: { opacity: 0, y: -150, rotate: rotate - 15 }
animate: { opacity: 1, y: 0, rotate: rotate }
transition: { duration: 2.4, delay: 0.3–0.7, ease: [0.23, 0.86, 0.39, 0.96], opacity.duration: 1.2 }
```

**ElegantShape float loop (after entrance):**
```js
animate: { y: [0, 15, 0] }
transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
```

**Hero content fade-up:**
```js
variants.hidden:  { opacity: 0, y: 30 }
variants.visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] } }
```

**Shoe image entrance:**
```js
initial: { opacity: 0, x: 50 }
animate: { opacity: 1, x: 0 }
transition: { duration: 1, delay: 0.8 }
```

### 10c. GSAP Animations

**Highlights section (ScrollTrigger):**
- `#title`: `opacity 0→1, y 0`, `duration: 1`, `ease: power3.out`, trigger: `top 80%`
- `.link` buttons: same with `stagger: 0.15`

**VideoCarousel:**
- Slide transition: `translateX(±100%)`, `duration: 1`, `ease: power3.inOut`
- Autoplay starts on ScrollTrigger: `trigger: #highlights, start: top 60%`
- Progress bar: GSAP ticker updates span width to match video `currentTime / videoDuration`
- Active indicator expands: `32px` (mobile) → `40px` (tablet) → `48px` (desktop), `duration: 0.3, ease: power2.out`
- Active indicator color: `#f59e0b` (amber), inactive: `#525252`
- Slide reset on last video: `opacity 0→1`, `duration: 0.3`

**CustomerReviews carousel:**
- Swipe out: `x: ±100%, opacity: 0`, `duration: 0.4`, `ease: power2.in`
- Swipe in: `x: 0, opacity: 1`, `duration: 0.4`, `ease: power2.out`

### 10d. Transition Utilities (Tailwind)

| Element | Transition |
|---|---|
| Nav link underline | `transition-all duration-300` |
| Product card shadow | `transition-all duration-500` |
| Product image zoom | `transition-transform duration-700` |
| Gradient overlay | `transition-opacity duration-300` |
| Favorite button | `transition-all duration-300` |
| Quick action bar | `transition-all duration-500` |
| Button hover | `transition-colors duration-200` |
| Search input width | `transition-all` |
| Mobile menu height | `transition-all duration-300` (max-height technique) |
| Filter active border | `transition-all` |

---

## 11. Icons & Assets

### 11a. Icon Library

**Lucide React** (`lucide-react@0.294.0`) is used throughout both storefronts.

Common icons and their usage:

| Icon | Where Used | Size |
|---|---|---|
| `Search` | Navbar search | `h-4 w-4` (inside input) |
| `User` | Navbar account button | `h-5 w-5` |
| `ShoppingBag` | Navbar cart, cart button | `h-5 w-5` |
| `X` | Mobile menu close, modal close, filter clear | `h-6 w-6` / `w-5 h-5` |
| `Menu` | Mobile hamburger | `h-6 w-6` |
| `Star` | Product rating | `h-4 w-4` / `h-5 w-5` / `w-3 h-3` |
| `Heart` | Favorite / wishlist | `h-5 w-5` / `w-6 h-6` |
| `Eye` | Quick view | `w-4 h-4` |
| `ShoppingBag` | Add to Cart in buttons | `w-4 h-4` / `w-5 h-5` |
| `Truck` | Free delivery benefit | `w-5 h-5` / `w-12 h-12` |
| `RotateCcw` | Returns benefit, play/pause controls | `w-5 h-5` |
| `Shield` | Secure payment benefit | `w-5 h-5` |
| `ChevronRight` | Breadcrumb separator, CTA arrows | `w-4 h-4` |
| `ChevronLeft/Right` | Review carousel controls | `w-5 h-5` |
| `Minus` / `Plus` | Quantity stepper | `w-4 h-4` |
| `Check` | Filter selected state | `w-3 h-3` / `w-4 h-4` |
| `SlidersHorizontal` | Filter panel header | `w-5 h-5` |
| `ArrowRight` | "View All", "Shop Now" CTAs | `w-4 h-4` / `w-5 h-5` |
| `ArrowLeft` | "Continue Shopping", back links | `w-4 h-4` |
| `Play` / `Pause` | VideoCarousel controls | `w-4 h-4` |
| `Zap` | "Buy Now" button, "New Arrivals" label | `w-5 h-5` |
| `Sparkles` | "Featured" label, footer about | `w-5 h-5` |
| `TrendingUp` | Men's Collection category card | `w-5 h-5` |
| `Package` | Product not found state, TSX logo | `w-10 h-10` / `w-5 h-5` |
| `BadgeCheck` | Review verified badge | `w-5 h-5 text-blue-600` |
| `Instagram` / `Linkedin` | Footer social links | `w-6 h-6` |
| `Mail` / `MapPin` / `Phone` | Footer contact section | `w-5 h-5` |
| `Trash2` | Cart remove item | `w-4 h-4` |
| `Tag` | Cart "add more for free shipping" | `w-3.5 h-3.5` |
| `LogOut` | TSX navbar user menu | `w-4 h-4` |
| `ChevronDown` | TSX user dropdown trigger | `w-4 h-4` |
| `Sun` / `Moon` | TSX theme toggle | `w-5 h-5` |
| `ShoppingCart` | TSX cart | `w-5 h-5` |
| `CreditCard` / `Smartphone` / `Banknote` | Checkout payment options | `w-5 h-5` |
| `CheckCircle` | Order success page | `w-12 h-12 text-green-600` |
| `AlertTriangle` | Product grid error state | `w-10 h-10 text-rose-500` |
| `RefreshCw` | Product grid retry button | `w-4 h-4` |

**MUI Icons** (`@mui/icons-material`): Used only in TSX Footer — `InstagramIcon`, `TwitterIcon`, `FacebookIcon`, `YouTubeIcon` (all `fontSize="small"`).

### 11b. Icon Color Patterns

- **Inactive / UI icons:** `text-neutral-700` or `text-gray-500` (dark on white)
- **Active state:** `text-amber-500` (JSX) or `text-orange-600` (TSX)
- **Benefit icons:** amber-600 (delivery), green-600 (returns), blue-600 (security) — each in colored `rounded-lg` bg box
- **Footer icons:** `text-white` with `hover:text-neutral-300`
- **Error icon:** `text-rose-500` in `bg-rose-100 rounded-full` container
- **Success icon:** `text-green-600` in `bg-green-100 rounded-full` container

### 11c. Image Handling

- Product images: `object-cover` on all image containers
- Aspect ratios: `aspect-square` (product cards, thumbnails), `aspect-[16/9]` / `aspect-[21/9]` (video), `aspect-[2/1]` (category cards)
- Lazy loading: not explicitly set (browser default)
- Error fallback (TSX): `onError` replaces with `https://via.placeholder.com/...`
- Hero background: Unsplash image with `opacity-50` overlay and `bg-cover bg-bottom`
- Shoe images: `/assets/shoes/shoe-10.png`, `.avif` format for most

---

## 12. Forms & Input Design

### 12a. JSX Storefront Input Style

**Base class:** `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`

**Error state:** `border-red-500 focus:ring-red-500`

**With left icon:** `pl-10`

**Label:** `block text-sm font-medium text-gray-700`

**Error message:** `text-sm text-red-600`

### 12b. TSX Storefront Input Style

**Base class:** `w-full px-4 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`

**Dark mode:** `dark:border-gray-600 dark:bg-gray-700 dark:text-white`

**Error message:** `mt-1 text-xs text-red-600`

### 12c. Login Modal Input (`components/LoginModal.jsx`)

`w-full px-4 py-4 border border-gray-300 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition`

(Note: larger `py-4` — more spacious than standard inputs)

### 12d. Navbar Search Input

`w-40 lg:w-52 rounded-full bg-neutral-100 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white transition-all`

### 12e. Newsletter Email Input

`w-full px-4 py-3 text-neutral-900 bg-white border rounded-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all`

Error state: `border-red-500` (no ring change)

### 12f. Button States

| State | JSX Primary CTA | TSX Primary CTA |
|---|---|---|
| Default | `bg-neutral-900 text-white` | `bg-orange-600 text-white` |
| Hover | `hover:bg-neutral-800` | `hover:bg-orange-700` |
| Active | — | `active:scale-[0.98]` |
| Disabled | `cursor-not-allowed opacity-70` | `disabled:opacity-60 disabled:cursor-not-allowed` |
| Loading | spinner + text "Signing in..." | border spinner + text |

**Login Modal OTP Button (conditional styling):**
- Valid (10 digits): `bg-black text-white hover:bg-gray-800`
- Invalid: `bg-gray-200 text-gray-400 cursor-not-allowed`

### 12g. Checkout Address Form (TSX `CheckoutPage.tsx`)

Same input style as RegisterPage but with dark mode: `dark:border-gray-600 dark:bg-gray-700`

Submit button: `bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700` with `flex items-center justify-center gap-2`

---

## 13. Feedback & States

### 13a. Loading States

**ProductGrid skeleton** (`ProductGrid.jsx`):
- Grid of 8 `animate-pulse` card skeletons
- Image area: `aspect-square bg-gradient-to-br from-neutral-200 to-neutral-100`
- Text lines: `h-3 bg-neutral-200 rounded-full` at varying widths (1/4, 3/4, 1/2)
- Staggered with `animationDelay: index * 100ms`

**ProductDetail skeleton** (`ProductDetail.jsx`):
- Uses `animate-shimmer` class (gradient sweep animation) on individual elements
- Image: `aspect-square bg-neutral-100 rounded-3xl animate-shimmer`
- Text elements: `h-4`, `h-10`, `h-6`, `h-16` etc., `bg-neutral-100 rounded-full animate-shimmer`
- Thumbnail row: `flex gap-3`, each `w-20 h-20 bg-neutral-100 rounded-xl animate-shimmer`

**Cart page (TSX)** — MUI Skeleton:
- `<Skeleton variant="text" height={48} width="25%" />` for page title
- `<Skeleton variant="rectangular" height={120} className="rounded-2xl" />` per cart item
- `<Skeleton variant="rectangular" height={300} className="rounded-2xl" />` for summary sidebar

**ProductDetailPage (TSX)** — MUI Skeleton:
- `<Skeleton variant="rectangular" height={480} className="rounded-3xl" />` for image
- `<Skeleton variant="rectangular" height={80} width={80} className="rounded-xl" />` for thumbnails
- Text skeletons at varying heights

**LandingPage (TSX)** — MUI Skeleton:
- `<Skeleton variant="rectangular" height={280} className="rounded-2xl" />` per product card
- `<Skeleton variant="text" />` for name and price

**Newsletter button loading state:**
- SVG spinner (`animate-spin w-5 h-5`) + "Subscribing..." text
- Button: `disabled:opacity-70 disabled:cursor-not-allowed`

### 13b. Empty States

**ProductGrid empty:**
- Container: `py-24 px-4 flex flex-col items-center justify-center animate-fade-in`
- Icon: `w-20 h-20 rounded-full bg-neutral-100`, `<Package w-10 h-10 text-neutral-400>` inside
- Title: `text-xl font-bold text-neutral-900`
- Subtitle: `text-neutral-600 text-center max-w-md`

**Cart empty (TSX):**
- `min-h-[70vh] flex items-center justify-center`
- `<ShoppingBag w-20 h-20 text-gray-200 dark:text-gray-700>`
- Title: `text-2xl font-bold text-gray-900 dark:text-white`
- CTA: `bg-orange-600 text-white rounded-2xl px-8 py-3`

**Product Not Found (JSX):**
- `min-h-screen flex items-center justify-center bg-neutral-50`
- Icon: `w-20 h-20 rounded-full bg-neutral-200`, `<Package w-10 h-10 text-neutral-400>`
- Title: `text-2xl font-bold text-neutral-900`
- Back link: `bg-neutral-900 text-white rounded-xl px-6 py-3`

**Product Not Found (TSX):**
- 😕 emoji + title + link in centered container

### 13c. Error States

**ProductGrid error:**
- Icon container: `w-20 h-20 rounded-full bg-rose-100`, `<AlertTriangle w-10 h-10 text-rose-500>`
- Title: `text-xl font-bold text-neutral-900`
- Error message: `text-neutral-600 text-center max-w-md`
- Retry button (if `onRetry` provided): `bg-neutral-900 text-white rounded-xl px-6 py-3`

**Form validation errors:** `text-sm text-red-600` (JSX) / `text-xs text-red-600` (TSX) below each field

**Form error banner (Login TSX):** `mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm`

**Form error banner (Register TSX):** `mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700`

**Alert component (UI.jsx):** `p-4 rounded-lg border` with type-specific colors (see section 5f)

### 13d. Success States

**Newsletter success:**
```
flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200
<CheckCircle w-5 h-5 text-green-600>
<span text-green-700>
```

**Profile save success (TSX):**
`mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700`
"✓ Profile updated successfully!"

**Add to Cart feedback (TSX ProductDetailPage):**
Button text changes to "Added! ✓" for 2 seconds then reverts.

**Order Success Page:** Full-screen centered layout with green checkmark circle — see section 6h.

---

## 14. Modal & Overlay Design

### 14a. Login Modal (`components/LoginModal.jsx`)

**Backdrop:** `fixed inset-0 z-[100] flex items-center justify-center` (full screen flex center)

**Overlay:** `absolute inset-0 bg-black/50 backdrop-blur-sm` (click to close)

**Modal container:** `relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-8 z-10`

**Close button:** `absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition`

**Content:**
- Logo: centered, `h-12 w-auto invert`
- Title: `text-xl font-bold text-center text-black`
- Subtitle: `text-center text-gray-500 text-sm`
- Phone input: `w-full px-4 py-4 border border-gray-300 rounded-lg text-black`
- OTP button: `rounded-full font-semibold` (full-width, conditionally styled — see section 12f)
- Terms: `text-center text-xs text-gray-500 mt-6`

### 14b. Generic Modal (UI.jsx)

**Backdrop:** `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`

**Container:** `bg-white rounded-lg shadow-lg w-full mx-4` + size class

**Sizes:** `max-w-sm` / `max-w-md` / `max-w-lg` / `max-w-xl`

### 14c. Mobile Filter Drawer (`ProductFilters.jsx`)

**Backdrop:** `absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in`

**Panel:** `absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-slide-in-right`

**Header:** `flex items-center justify-between p-5 border-b border-neutral-200 bg-neutral-50`

Close button: `p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg`

### 14d. User Dropdown Navbar (JSX)

Trigger: mouse enter/leave on container div

**Container:** `absolute right-0 mt-0 w-72 bg-white border border-gray-200 shadow-lg rounded-sm`
(Note: `rounded-sm` is flat-cornered — inconsistent with other rounded components)

### 14e. User Dropdown Navbar (TSX)

**Container:** `absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50`

### 14f. Product Image Overlay States

**Out of Stock:** `absolute inset-0 bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center`

**Hover gradient:** `absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`

### 14g. Checkout MUI Stepper

Uses default MUI Stepper styling. Active step inherits `primary.main` color from MUI theme (`#E65100` light / `#FF833A` dark).

---

## 15. Design Inconsistencies

The following inconsistencies were identified across the codebase:

### 15a. Two Competing Design Systems

The most fundamental inconsistency: **two entirely separate storefronts** (`App.jsx` and `App.tsx`) exist in the same `client/src` folder with conflicting brand names, color systems, and component libraries:

| | JSX (App.jsx) | TSX (App.tsx) |
|---|---|---|
| Brand name | SprintShoes / Classic Shoes | StepStyle |
| Primary color | Amber `#f59e0b` / Yellow `#F2D200` | Orange `#E65100` / `#ea580c` |
| UI Library | Tailwind only | MUI v5 + Tailwind |
| Router | Custom hash-based | React Router DOM v6 |
| Dark mode | ❌ Not supported | ✅ Full support |
| Auth flow | OTP (phone-based) | Email + password |

### 15b. Primary Color Inconsistency Within JSX Storefront

Three different yellows are used for the same "primary CTA" role:
- Hero buttons: `bg-[#F2D200]` (custom hex)
- ProductCard quick-add and mobile cart: `bg-yellow-400` (#facc15)
- ProductDetail "Buy Now": `bg-amber-500` (#f59e0b)
- Navbar cart badge and user dropdown CTA: `bg-yellow-400`

These are visually close but not identical.

### 15c. Modal Corner Radius Inconsistency

- LoginModal: `rounded-lg`
- Generic Modal (UI.jsx): `rounded-lg`
- User dropdown (JSX navbar): `rounded-sm` ← flat corners, stands out vs. rest of app
- User dropdown (TSX navbar): `rounded-xl`
- Mobile filter drawer panel: no border-radius (full height)
- Product detail price box: `rounded-2xl`
- Cart items (TSX): `rounded-2xl`
- Form cards (TSX): `rounded-2xl`

### 15d. Button Radius Inconsistency

- UI.jsx generic Button: `rounded-lg`
- ProductCard "Add to Cart" quick action: `rounded-xl`
- ProductDetail "Add to Cart": `rounded-xl`
- ProductDetail "Buy Now": `rounded-xl`
- Hero CTA buttons: no border-radius (sharp corners — `inline-flex items-center justify-center px-10 py-4`)
- Navbar search input: `rounded-full`
- Filter reset button: `rounded-xl`
- LoginModal OTP button: `rounded-full`
- TSX buttons generally: `rounded-xl` or `rounded-2xl`

### 15e. Focus Ring Inconsistency

- Global CSS: `outline: 2px solid #f59e0b` (amber)
- JSX inputs: `focus:ring-black` (black)
- Navbar search: `focus:ring-yellow-400/50`
- Newsletter: `focus:ring-neutral-900`
- TSX inputs: `focus:ring-orange-500`
- MUI components: inherit MUI focus styles

### 15f. CustomerReviews Border Color

`border-2 border-blue-600` on the review card — this is the only use of blue-600 as a border in the JSX storefront. All other accent borders use amber. This appears to be leftover from a previous design or incomplete styling.

### 15g. Tailwind Config Tokens vs. Actual Usage

The `tailwind.config.js` defines `primary: '#1f2937'`, `secondary: '#3b82f6'`, `accent: '#ec4899'` — none of which are used in any component. The actual primary color throughout the app is amber/yellow, not `#1f2937`.

### 15h. Shimmer vs. Pulse Loading

Two different skeleton loading approaches are used inconsistently:
- `ProductGrid.jsx`: Uses `animate-pulse` (Tailwind built-in pulsing opacity)
- `ProductDetail.jsx`: Uses `animate-shimmer` (custom gradient sweep)
- TSX pages: Use MUI `<Skeleton>` component

### 15i. Font Variable Not Applied

`--font-jost: 'Jost', sans-serif` is defined as a CSS variable in `@theme` but is never applied via `font-jost` class or `font-family: var(--font-jost)` on any element. The actual font is Inter.

### 15j. Logo Size in Navbar

The logo image uses `h-24` (96px) inside a navbar that is only `h-16` (64px) tall. This causes the image to overflow the navbar bounds. The visual height is constrained only by `object-contain` and the navigation flex container.

### 15k. Price Currency Symbol Inconsistency

- JSX storefront shows `₹` (Indian Rupee symbol) with `.toFixed(2)` decimal places
- Product data (`constants/products.js`) uses USD-style values like `189.99`, `159.99`
- TSX storefront uses `Intl.NumberFormat('en-IN', { currency: 'INR' })` properly formatted
- `ProductFilters.jsx` shows price ranges in `$` (USD): "Under $100", "$100 - $150"

### 15l. Spacing Inconsistency in ProductDetail Benefits Row

Grid changes from `grid-cols-3` on sm+ but some implementations use `grid-cols-1 sm:grid-cols-3` while others use `grid-cols-1`. Padding within benefit items: `p-4` with nested icon `p-2.5` box.

---

*Generated: March 8, 2026 — Based on complete static analysis of `client/src/**`*
