# Client Application — Full Architecture Reference

> Generated: March 8, 2026  
> Scope: `client/` folder only  
> Purpose: Complete reference for any developer onboarding to or extending this application.

---

## Table of Contents

1. [Full Folder Structure](#1-full-folder-structure)
2. [Technology Stack](#2-technology-stack)
3. [Component Hierarchy](#3-component-hierarchy)
4. [Routing Architecture](#4-routing-architecture)
5. [State Architecture](#5-state-architecture)
6. [Data Fetching](#6-data-fetching)
7. [File & Code Conventions](#7-file--code-conventions)
8. [Custom Hooks](#8-custom-hooks)
9. [Utility Functions](#9-utility-functions)
10. [Environment & Config](#10-environment--config)
11. [Known Issues & TODOs](#11-known-issues--todos)

---

## 1. Full Folder Structure

```
client/
├── index.html                    # Vite HTML entry — mounts <div id="root">
├── package.json                  # Deps, scripts, version
├── vite.config.ts                # Build + dev server config, path aliases
├── tsconfig.json                 # TypeScript config (strict mode off)
├── tsconfig.node.json            # tsconfig for vite.config.ts itself
├── tailwind.config.js            # Tailwind content paths + custom tokens
├── postcss.config.js             # PostCSS with Tailwind + Autoprefixer
├── prettier.config.js            # Prettier formatting rules
├── eslint.config.js              # ESLint (flat config, TS + React hooks rules)
├── VIDEO_SETUP.md                # Dev notes on adding highlight videos
├── README.md                     # Project-level readme
│
├── public/
│   ├── logo.png
│   └── assets/
│       ├── icons/
│       │   ├── play.svg          # Video carousel: play button icon
│       │   ├── pause.svg         # Video carousel: pause button icon
│       │   └── replay.svg        # Video carousel: replay button icon
│       ├── images/
│       │   ├── watch.svg         # Hero section decorative image
│       │   └── right.svg         # Directional arrow image
│       ├── shoes/
│       │   └── shoe-1.jpg … shoe-15.avif   # Static product placeholder images
│       └── Videos/
│           ├── highlightFirstVideo.mp4
│           ├── highlightSecondVideo.mp4
│           ├── highlightThirdVideo.mp4
│           └── highlightFourthVideo.mp4    # MP4 files for VideoCarousel
│
└── src/
    ├── main.tsx                  # TS entry point — mounts Root with MUI ThemeProvider + BrowserRouter + ErrorBoundary
    ├── main.jsx                  # JSX entry point — mounts App.jsx (legacy, no providers)
    ├── App.tsx                   # TS router — React Router v6, uses store/authStore.ts
    ├── App.jsx                   # JSX router — custom useRouter, mounts Navbar + Routes + Footer
    ├── index.css                 # Global Tailwind directives (@tailwind base/components/utilities)
    ├── vite-env.d.ts             # Vite's ImportMeta env type augmentations
    │
    ├── api/                      # Primary HTTP layer (TypeScript)
    │   ├── client.ts             # ApiClient class: Axios instance + JWT interceptors + token refresh
    │   ├── index.ts              # Re-exports all API modules (authApi, cartApi, productApi, orderApi, profileApi)
    │   └── services/             # Zod-validated static service classes
    │       ├── auth.service.ts   # ClientAuthService (login, register, refresh, logout, getMe, password reset, OTP)
    │       ├── cart.service.ts   # ClientCartService (getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon)
    │       ├── product.service.ts# ClientProductService (getProducts, getById, search, featured, byCategory, related, rate)
    │       ├── order.service.ts  # ClientOrderService + ClientAddressService (checkout, orders CRUD, address CRUD, track)
    │       └── index.ts          # Re-exports all service classes
    │
    ├── components/
    │   ├── index.js              # JSX barrel: exports from Hero, Highlights, VideoCarousel, etc. (legacy)
    │   │
    │   ├── common/               # Shared TS/TSX components (used by main.tsx tree)
    │   │   ├── Navbar.tsx        # Top navigation: links, search, theme toggle, user menu, cart badge
    │   │   ├── Footer.tsx        # MUI-based footer with link columns and social icons
    │   │   ├── ProtectedRoute.tsx# Children-based guard: redirects to /login if not authenticated
    │   │   └── ErrorBoundary.tsx # Class component: catches render errors, shows fallback UI
    │   │
    │   ├── guards/
    │   │   └── ProtectedRoute.tsx# Outlet-based guard for React Router v6 nested routes (uses store/authStore.ts)
    │   │
    │   ├── Hero.jsx              # Animated hero section with Framer Motion shapes + custom Link
    │   ├── Highlights.jsx        # GSAP ScrollTrigger section containing VideoCarousel
    │   ├── VideoCarousel.jsx     # GSAP-animated video player with progress indicators
    │   ├── FeaturedProducts.jsx  # Product grid using useProducts hook (JSX legacy)
    │   ├── ProductCard.jsx       # Single product card (JSX legacy)
    │   ├── ProductComponents.jsx # Compound product UI pieces (JSX legacy)
    │   ├── ProductDetail.jsx     # Full product detail view (JSX legacy)
    │   ├── ProductFilters.jsx    # Filter sidebar (JSX legacy)
    │   ├── ProductGallary.jsx    # Image gallery (JSX legacy)  [typo: Gallery]
    │   ├── ProductGrid.jsx       # Product listing grid (JSX legacy)
    │   ├── BannerSection.jsx     # Promotional banner (JSX legacy)
    │   ├── Card.jsx              # Generic card component (JSX legacy)
    │   ├── CustomerReviews.jsx   # Static customer reviews section (JSX legacy)
    │   ├── Newsletter.jsx        # Email newsletter signup form (JSX legacy)
    │   ├── AuthForms.jsx         # LoginForm + RegisterForm components (JSX legacy)
    │   ├── LoginModal.jsx        # Modal-based login form (JSX legacy)
    │   ├── navbar.jsx            # JSX Navbar (used by App.jsx; different from common/Navbar.tsx)
    │   ├── Footer.jsx            # JSX Footer (used by App.jsx; different from common/Footer.tsx)
    │   └── UI.jsx                # Shared JSX primitives: Button, Spinner, Alert, Badge, Input, Modal
    │
    ├── pages/
    │   ├── LandingPage.tsx       # Full landing page: hero, trust badges, categories, featured products, CTA
    │   ├── CartPage.tsx          # Cart with item list, quantity controls, order summary, checkout redirect
    │   ├── HomePage.jsx          # JSX home (used by App.jsx): Hero → Highlights → FeaturedProducts → Reviews → Newsletter
    │   ├── ProductsPage.jsx      # JSX products listing (used by App.jsx, legacy)
    │   ├── ProductPage.jsx       # JSX single product page (used by App.jsx, legacy)
    │   ├── CustomerPages.jsx     # JSX barrel: LoginPage, RegisterPage, CartPage, CheckoutPage, ProfilePage, OrdersPage
    │   ├── UI.jsx                # UI showcase/test page
    │   │
    │   ├── auth/
    │   │   ├── LoginPage.tsx     # Login form using react-hook-form + zod (uses store/authStore.ts)
    │   │   ├── RegisterPage.tsx  # Register form with password strength rules (uses stores/authStore.ts)
    │   │   ├── ForgotPasswordPage.tsx  # Email-based password reset request
    │   │   └── OtpVerificationPage.tsx # 6-digit OTP entry with auto-focus, paste support, resend timer
    │   │
    │   ├── products/
    │   │   ├── ProductListingPage.tsx  # Full-featured listing: filter drawer, sort, price range, MUI Skeleton loading
    │   │   └── ProductDetailPage.tsx   # Detail: image gallery, variant selector, add-to-cart, breadcrumbs
    │   │
    │   ├── checkout/
    │   │   ├── CheckoutPage.tsx  # 3-step stepper: address form → payment selection → review + place order
    │   │   └── OrderSuccessPage.tsx    # Post-order confirmation with order ID and next-steps list
    │   │
    │   ├── profile/
    │   │   ├── ProfilePage.tsx   # 3-tab profile: personal info, addresses, orders redirect
    │   │   └── OrderHistoryPage.tsx    # MUI Table of all orders with status chips
    │   │
    │   └── shop/
    │       └── CheckoutPage.tsx  # Minimal placeholder checkout (uses store/cartStore.ts — legacy/unused)
    │
    ├── layouts/
    │   └── ClientLayout.tsx      # Shell: <Navbar /> + <Outlet /> + <Footer /> (for React Router nested routes)
    │
    ├── hooks/
    │   ├── index.ts              # TS barrel: exports useAuth, useCart, useProduct, useOrder
    │   ├── index.js              # JSX barrel: exports useProducts, useProduct, useRelatedProducts, useRouter, Link
    │   ├── useAuth.ts            # Thin wrapper over useAuthStore: adds isAuthenticated derived value
    │   ├── useCart.ts            # Thin wrapper over useCartStore: adds itemCount, total, subtotal, tax, shipping
    │   ├── useProduct.ts         # Thin wrapper over useProductStore: memoizes all action calls
    │   ├── useOrder.ts           # Thin wrapper over useOrderStore: memoizes all action calls
    │   ├── useProducts.js        # Standalone fetch hook (raw fetch, no store): useProducts, useProduct, useRelatedProducts
    │   └── useRouter.jsx         # Custom SPA router: RouterProvider context, navigate, getParam, Link component
    │
    ├── stores/                   # Primary Zustand stores (TypeScript)
    │   ├── index.ts              # TS barrel re-exports all stores
    │   ├── index.js              # JSX compat re-exports (forwards to .js wrappers)
    │   ├── authStore.ts          # Auth: user, tokens, login, register, logout, init, clearError, setUser
    │   ├── authStore.js          # Legacy re-export wrapper → authStore.ts
    │   ├── cartStore.ts          # Cart: cart object, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart
    │   ├── cartStore.js          # Legacy re-export wrapper → cartStore.ts
    │   ├── productStore.ts       # Products: list, selectedProduct, categories, pagination, filters, search
    │   ├── productStore.js       # Legacy re-export wrapper → productStore.ts
    │   ├── orderStore.ts         # Orders: list, selectedOrder, pagination, fetchOrders, createOrder, cancelOrder
    │   ├── orderStore.js         # Legacy re-export wrapper → orderStore.ts
    │   └── uiStore.ts            # UI: themeMode (light/dark), toggleTheme, setTheme
    │
    ├── store/                    # Secondary/prototype stores (used ONLY by App.tsx + guards/ProtectedRoute.tsx)
    │   ├── authStore.ts          # Minimal auth store with withCredentials cookie-based approach
    │   └── cartStore.ts          # Minimal cart store (simpler item shape)
    │
    ├── services/
    │   ├── api.ts                # Standalone Axios instance (duplicate of api/client.ts, used by services/index.ts)
    │   └── index.ts              # apiEndpoints map + productService, orderService, userService objects
    │
    ├── lib/
    │   ├── api.ts                # Cookie-based Axios instance for store/authStore.ts (different base URL: port 5000)
    │   ├── theme.ts              # MUI lightTheme + darkTheme (orange/red primary, Inter font)
    │   └── utils.ts              # cn(), formatPrice(), formatDate(), truncate(), getDiscountPercent()
    │   └── utils.js              # Legacy JS: cn() only
    │
    ├── utils/
    │   └── index.js              # Static asset exports: video paths (highlightFirstVideo…), icon paths (playImg, pauseImg…)
    │
    ├── constants/
    │   ├── index.js              # hightlightsSlides array (video carousel slide data)
    │   ├── data.js               # Re-exports from products.js and index.js
    │   └── products.js           # Hard-coded products[], categories[], sortOptions[], mock productApi
    │
    └── types/
        └── index.ts              # Shared TypeScript interfaces and types for the entire app
```

---

## 2. Technology Stack

### Runtime & Build

| Tool | Version | Purpose |
|------|---------|---------|
| `react` | `^18.2.0` | UI library |
| `react-dom` | `^18.2.0` | DOM renderer |
| `typescript` | `^5.3.3` | Static typing (dev-only) |
| `vite` | `^5.0.8` | Dev server + bundler |
| `@vitejs/plugin-react` | `^4.2.1` | Vite React plugin (SWC transforms) |
| `terser` | `^5.46.0` | Production minifier |

### Routing

| Tool | Version | Purpose |
|------|---------|---------|
| `react-router-dom` | `^6.20.1` | Declarative routing (used by `main.tsx` tree) |
| `hooks/useRouter.jsx` | internal | Custom hand-rolled SPA router (used by `App.jsx` / JSX tree) |

### State Management

| Tool | Version | Purpose |
|------|---------|---------|
| `zustand` | `^4.4.1` | Global state (all 5 stores) |
| `zustand/middleware` (persist) | bundled | LocalStorage persistence |

### UI Components & Styling

| Tool | Version | Purpose |
|------|---------|---------|
| `@mui/material` | `^5.14.20` | MUI component library |
| `@mui/icons-material` | `^5.14.20` | MUI icon set |
| `@emotion/react` | `^11.11.1` | MUI peer dep (CSS-in-JS runtime) |
| `@emotion/styled` | `^11.11.0` | MUI peer dep (styled components) |
| `tailwindcss` | `^3.3.6` | Utility-first CSS |
| `postcss` | `^8.4.32` | CSS processing |
| `autoprefixer` | `^10.4.16` | Vendor prefixes |
| `clsx` | `^2.0.0` | Conditional className helper |
| `tailwind-merge` | `^2.2.0` | Tailwind class deduplication |
| `class-variance-authority` | `^0.7.0` | Variant-based component styles |
| `lucide-react` | `^0.294.0` | Icon library |

### Animation

| Tool | Version | Purpose |
|------|---------|---------|
| `framer-motion` | `^12.34.3` | Declarative animations (Hero section) |
| `gsap` | `^3.14.2` | Timeline animations (Highlights, VideoCarousel) |
| `@gsap/react` | `^2.1.2` | `useGSAP` hook |

### Forms & Validation

| Tool | Version | Purpose |
|------|---------|---------|
| `react-hook-form` | `^7.50.1` | Performant form management |
| `@hookform/resolvers` | `^3.3.4` | Adapter bridging zod → react-hook-form |
| `zod` | `^3.22.4` | Schema validation (forms + API responses) |

### HTTP

| Tool | Version | Purpose |
|------|---------|---------|
| `axios` | `^1.6.2` | HTTP client (two separate instances exist) |

### Charts

| Tool | Version | Purpose |
|------|---------|---------|
| `recharts` | `^2.10.4` | Installed but **not used** in client source |

### Radix UI Primitives

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/react-dialog` | `^1.1.1` | Installed, not directly used in pages |
| `@radix-ui/react-select` | `^1.2.2` | Installed, not directly used |
| `@radix-ui/react-slot` | `^1.0.2` | Used by `class-variance-authority` |
| `@radix-ui/react-toast` | `^1.1.5` | Installed but no toast invocation found |

### Dev Tools

| Tool | Version | Purpose |
|------|---------|---------|
| `eslint` | `^8.56.0` | Linting |
| `@typescript-eslint/parser` | `^6.17.0` | TS-aware ESLint |
| `eslint-plugin-react-hooks` | `^4.6.0` | Hooks rules enforcement |
| `eslint-plugin-react-refresh` | `^0.4.5` | HMR safety |
| `prettier` | `^3.1.1` | Code formatting |
| `@types/node` | `^20.10.6` | Node type declarations |
| `@types/react` | `^18.2.43` | React type declarations |
| `@types/react-dom` | `^18.2.17` | ReactDOM type declarations |

---

## 3. Component Hierarchy

There are **two parallel component trees** — a legacy JSX tree (App.jsx) and the primary TypeScript tree (main.tsx / App.tsx).

### 3a. Primary TypeScript Tree (`main.tsx` → `App.tsx`)

```
Root (main.tsx)
├── ThemeProvider (MUI — lightTheme or darkTheme from uiStore)
│   ├── CssBaseline (MUI reset)
│   └── BrowserRouter (react-router-dom)
│       └── ErrorBoundary (components/common/ErrorBoundary.tsx)
│           └── App (App.tsx)
│               └── Routes
│                   ├── / → HomePage (placeholder div — not LandingPage.tsx)
│                   ├── /login → LoginPage (pages/auth/LoginPage.tsx)
│                   └── ProtectedRoute (components/guards/ProtectedRoute.tsx) [outlet]
│                       ├── /checkout → CheckoutPage (pages/shop/CheckoutPage.tsx — minimal placeholder)
│                       └── /profile → "Profile Placeholder" div
```

> **Note:** `App.tsx` is a minimal placeholder. The real store of complete pages is in the JSX tree below and in the standalone TSX pages that are not yet wired to any router.

### 3b. Legacy JSX Tree (`main.jsx` → `App.jsx`)

```
App (App.jsx)
└── RouterProvider (hooks/useRouter.jsx)
    └── <main>
        ├── Navbar (components/navbar.jsx)
        └── Routes (switch on currentPath)
            ├── /          → HomePage (pages/HomePage.jsx)
            │                  ├── Hero (components/Hero.jsx)
            │                  │   └── ElegantShape (internal, Framer Motion animated div)
            │                  ├── Highlights (components/Highlights.jsx)
            │                  │   └── VideoCarousel (components/VideoCarousel.jsx)
            │                  ├── FeaturedProducts (components/FeaturedProducts.jsx)
            │                  ├── CustomerReviews (components/CustomerReviews.jsx)
            │                  └── Newsletter (components/Newsletter.jsx)
            │
            ├── /products   → ProductsPage (pages/ProductsPage.jsx)
            │                  ├── ProductFilters (components/ProductFilters.jsx)
            │                  └── ProductGrid (components/ProductGrid.jsx)
            │                      └── ProductCard (components/ProductCard.jsx)
            │
            ├── /product/:id → ProductPage (pages/ProductPage.jsx)
            │                  ├── ProductGallary (components/ProductGallary.jsx)
            │                  └── ProductDetail (components/ProductDetail.jsx)
            │
            ├── /login      → LoginPage (pages/CustomerPages.jsx)
            │                  └── LoginForm (components/AuthForms.jsx)
            ├── /register   → RegisterPage (pages/CustomerPages.jsx)
            │                  └── RegisterForm (components/AuthForms.jsx)
            ├── /cart       → CartPage (pages/CustomerPages.jsx) [mock — no real cart data]
            ├── /checkout   → CheckoutPage (pages/CustomerPages.jsx) [mock — API calls stubbed]
            ├── /profile    → ProfilePage (pages/CustomerPages.jsx) [mock]
            └── /orders     → OrdersPage (pages/CustomerPages.jsx) [mock]
        └── Footer (components/Footer.jsx)
```

### 3c. Standalone TSX Pages (complete, but not yet connected to a router)

These pages are fully implemented and production-ready but are **orphaned** — no router currently mounts them as of the last audit:

```
LandingPage.tsx
  └── (inline sections: Hero, TrustBadges, Categories, FeaturedProducts CTA)

ProductListingPage.tsx
  ├── ProductCard (internal memo component)
  └── Drawer → filterPanel (inline)

ProductDetailPage.tsx
  └── (inline: image gallery, variant selector, add-to-cart)

CartPage.tsx (pages/CartPage.tsx — the full implementation)

CheckoutPage.tsx (pages/checkout/CheckoutPage.tsx)
  └── MUI Stepper: AddressForm → PaymentMethod → Review

OrderSuccessPage.tsx

ProfilePage.tsx
  └── MUI Tabs: PersonalInfo | Addresses | Orders

OrderHistoryPage.tsx
  └── MUI Table

auth/RegisterPage.tsx
auth/ForgotPasswordPage.tsx
auth/OtpVerificationPage.tsx

ClientLayout.tsx
  ├── Navbar (components/common/Navbar.tsx)
  │   └── (search bar, theme toggle, user menu, cart badge)
  └── Footer (components/common/Footer.tsx)
```

---

## 4. Routing Architecture

### 4a. Primary Router (App.tsx + main.tsx)

Uses **React Router DOM v6** (`BrowserRouter` + `Routes`/`Route`).

```typescript
// App.tsx — current actual routes
<BrowserRouter>
  <Routes>
    <Route path="/"         element={<HomePage />} />          // placeholder div
    <Route path="/login"    element={<LoginPage />} />          // pages/auth/LoginPage.tsx
    <Route element={<ProtectedRoute />}>                        // Outlet-based guard
      <Route path="/checkout" element={<CheckoutPage />} />     // pages/shop/CheckoutPage.tsx (placeholder)
      <Route path="/profile"  element={<div>Profile</div>} />   // placeholder
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

**`ProtectedRoute` (guards/ProtectedRoute.tsx):** Renders `<Outlet />` when authenticated, else redirects to `/login` with `state.from` set. Calls `checkAuth()` on mount from `store/authStore.ts`.

**`ClientLayout.tsx`:** A `<Outlet />`-based shell wrapping `<Navbar />` + `<Footer />`. Intended to be used as a layout wrapper for all user-facing nested routes but is **not yet wired** into `App.tsx`.

### 4b. Legacy Router (App.jsx)

A custom hand-rolled router backed by `window.history.pushState` and `window.addEventListener('popstate')`.

```javascript
// Routing logic in App.jsx — path-matching switch
if (currentPath === '/')              → <HomePage />
if (currentPath === '/products')      → <ProductsPage />
if (currentPath.startsWith('/product/')) → <ProductPage />
if (currentPath === '/login')         → <LoginPage />   (from CustomerPages.jsx)
if (currentPath === '/register')      → <RegisterPage />
if (currentPath === '/cart')          → <CartPage />
if (currentPath === '/checkout')      → <CheckoutPage />
if (currentPath === '/profile')       → <ProfilePage />
if (currentPath === '/orders')        → <OrdersPage />
// fallback → 404 inline div
```

**`RouterProvider`** provides: `{ currentPath, searchParams, navigate, getParam, getAllParams, routeKey }`.

**`Link` component** (from `useRouter.jsx`): calls `navigate()` on click; scroll-to-top is built in.

### 4c. Route Guards

| Guard | File | Mechanism |
|-------|------|-----------|
| `ProtectedRoute` (Outlet) | `components/guards/ProtectedRoute.tsx` | Uses `store/authStore.ts` → `isAuthenticated`, shows loading spinner while `checkAuth()` runs |
| `ProtectedRoute` (children) | `components/common/ProtectedRoute.tsx` | Uses `stores/authStore.ts` → `isAuthenticated`, wraps children, redirects to `/login` |

The two guards use **different auth stores** (`store/` vs. `stores/`) — this is a migration inconsistency.

---

## 5. State Architecture

### 5a. Primary Store: `useAuthStore` (`stores/authStore.ts`)

Persisted via `zustand/persist` under key `"auth-store"`.

```javascript
// Shape
{
  user: User | null,         // { id, email, firstName, lastName, phone, role, isActive, createdAt, updatedAt }
  accessToken: string | null,
  refreshToken: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: ApiError | null,    // { success: false, message, code? }

  // Actions
  init: () => void,                                                   // reads persisted state and sets isAuthenticated
  login: (email, password) => Promise<void>,                          // POST /auth/login → sets user + tokens
  register: (email, password, firstName, lastName) => Promise<void>,  // POST /auth/register → sets user + tokens
  logout: () => void,                                                 // clears localStorage + resets state
  clearError: () => void,
  setUser: (user: User) => void,
}

// Persisted fields: user, accessToken, refreshToken, isAuthenticated
// Also writes tokens to localStorage (duplicated in store AND localStorage)
```

**Consumers:** `Navbar.tsx`, `CartPage.tsx`, `CheckoutPage.tsx`, `ProfilePage.tsx`, `RegisterPage.tsx`, `useAuth.ts`, `common/ProtectedRoute.tsx`

---

### 5b. Primary Store: `useCartStore` (`stores/cartStore.ts`)

Persisted under key `"cart-store"`.

```javascript
// Shape
{
  cart: Cart | null,   // { id, userId, items: CartItem[], total, subtotal, tax, shipping }
  isLoading: boolean,
  error: ApiError | null,

  // Actions
  fetchCart: () => Promise<void>,                                   // GET /cart
  addToCart: (productId, variantId?, quantity?) => Promise<void>,  // POST /cart/add
  updateCartItem: (cartItemId, quantity) => Promise<void>,         // PUT /cart/items/:id
  removeFromCart: (cartItemId) => Promise<void>,                   // DELETE /cart/items/:id
  clearCart: () => Promise<void>,                                  // DELETE /cart
  clearError: () => void,
  setCart: (cart: Cart) => void,
}

// Persisted fields: cart
```

**Consumers:** `Navbar.tsx` (cart badge count), `CartPage.tsx`, `CheckoutPage.tsx`, `ProductListingPage.tsx`, `ProductDetailPage.tsx`, `useCart.ts`

---

### 5c. Primary Store: `useProductStore` (`stores/productStore.ts`)

Not persisted.

```javascript
// Shape
{
  products: Product[],
  selectedProduct: Product | null,
  categories: Category[],
  isLoading: boolean,
  isFetching: boolean,
  error: ApiError | null,
  pagination: { page, limit, total, pages } | null,
  filters: {
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    search?: string,
    page: number,        // default: 1
    limit: number,       // default: 12
    sortBy?: string,
  },

  // Actions
  fetchProducts: (filters?) => Promise<void>,       // GET /products with params
  getProductById: (id) => Promise<void>,            // GET /products/:id → sets selectedProduct
  searchProducts: (query) => Promise<void>,         // GET /products/search?q=
  setFilters: (partialFilters) => void,             // merges + resets page to 1
  clearFilters: () => void,
  clearError: () => void,
  setSelectedProduct: (product | null) => void,
}
```

**Consumers:** `ProductListingPage.tsx`, `ProductDetailPage.tsx`, `LandingPage.tsx`, `useProduct.ts`

---

### 5d. Primary Store: `useOrderStore` (`stores/orderStore.ts`)

Persisted under key `"order-store"`.

```javascript
// Shape
{
  orders: Order[],
  selectedOrder: Order | null,
  isLoading: boolean,
  isFetching: boolean,
  error: ApiError | null,
  pagination: { page, limit, total, pages } | null,

  // Actions
  fetchOrders: (page?, limit?) => Promise<void>,   // GET /orders
  getOrderById: (id) => Promise<void>,              // GET /orders/:id → sets selectedOrder
  createOrder: (orderData) => Promise<Order>,       // POST /orders → prepends to list
  cancelOrder: (id) => Promise<void>,               // POST /orders/:id/cancel → local status update
  clearError: () => void,
  setSelectedOrder: (order | null) => void,
}

// Persisted fields: orders, selectedOrder
```

**Consumers:** `CheckoutPage.tsx`, `OrderSuccessPage.tsx`, `OrderHistoryPage.tsx`, `useOrder.ts`

---

### 5e. UI Store: `useUiStore` (`stores/uiStore.ts`)

Not persisted via zustand (uses `localStorage` directly).

```javascript
// Shape
{
  themeMode: 'light' | 'dark',   // initialized from localStorage.getItem('theme')

  // Actions
  toggleTheme: () => void,        // flips light↔dark, writes to localStorage
  setTheme: (mode) => void,       // sets specific mode, writes to localStorage
}
```

**Consumers:** `main.tsx` (ThemeProvider selector), `Navbar.tsx` (toggle button)

---

### 5f. Secondary / Prototype Store: `store/authStore.ts`

Used only by `App.tsx` and `components/guards/ProtectedRoute.tsx`. Cookie-based approach (no tokens stored in state).

```javascript
// Shape
{
  user: UserProfileDTO | null,
  isAuthenticated: boolean,
  isLoading: boolean,

  // Actions
  login: (credentials) => Promise<void>,   // POST /auth/login
  logout: () => Promise<void>,             // POST /auth/logout
  checkAuth: () => Promise<void>,          // GET /auth/me — used for session verification
}

// Persisted under "auth-storage": { user, isAuthenticated }
// Listens for custom event 'auth:unauthorized' (dispatched by lib/api.ts interceptor) to clear state
```

---

### 5g. Secondary / Prototype Store: `store/cartStore.ts`

Used only by `pages/shop/CheckoutPage.tsx`.

```javascript
// Shape
{
  items: Array<{ productId: string, sizeId: string, quantity: number }>,
  isLoading: boolean,

  // Actions
  fetchCart: () => Promise<void>,
  addItem: (item) => Promise<void>,
  updateItem: (itemId, quantity) => Promise<void>,
  removeItem: (itemId) => Promise<void>,
  clearLocalCart: () => void,
}

// Persisted under "cart-storage": { items }
```

---

## 6. Data Fetching

### 6a. HTTP Instances

There are **three separate Axios/fetch instances** in the codebase (a migration artifact):

| Instance | File | Base URL | Auth | Used By |
|----------|------|----------|------|---------|
| `apiClient` (class) | `api/client.ts` | `VITE_API_URL \|\| http://localhost:3000/api` | Bearer token from `localStorage.accessToken` | All `api/` services, stores in `stores/`, most TSX pages |
| `api` (axios instance) | `lib/api.ts` | `VITE_API_URL \|\| http://localhost:5000/api` | Cookie (`withCredentials: true`), no token header | `store/authStore.ts` only |
| `apiClient` (axios instance) | `services/api.ts` | `VITE_API_URL \|\| http://localhost:3000/api` | Bearer token from `localStorage.accessToken` | `services/index.ts` only |
| raw `fetch` | `hooks/useProducts.js` | `VITE_API_URL \|\| http://localhost:3000/api` | None | JSX legacy pages |

### 6b. Token Refresh Strategy

**`api/client.ts` (primary):**
- On every request: reads `localStorage.accessToken` → sets `Authorization: Bearer <token>`
- On 401 response: sets `_retry` flag, reads `localStorage.refreshToken`, POSTs to `/auth/refresh`, writes new tokens to localStorage, retries original request
- On refresh failure: calls `clearAuth()` (removes tokens), redirects to `/login`

**`lib/api.ts` (prototype):**
- On 401: dispatches `new CustomEvent('auth:unauthorized')` globally
- `store/authStore.ts` listens and clears state: `window.addEventListener('auth:unauthorized', () => {...})`
- No token refresh — expects server-side sessions/cookies

### 6c. Zod Validation at the API Boundary

`api/services/*.ts` classes use Zod to parse **every API response**. If the response doesn't match the schema, the call throws. This is the strictest validation layer; the `api/index.ts` helpers do not validate.

```typescript
// Pattern used in all service classes:
const response = await apiClient.post('/auth/login', validated);
return authResponseSchema.parse(response.data);  // throws ZodError on mismatch
```

### 6d. Loading & Error Patterns

**In Zustand stores:**
- `isLoading` is set `true` before the API call and `false` in `finally`/`catch`
- `error` is set in `catch` as `{ success: false, message, code? }`
- `clearError()` action provided for components to reset after displaying

**In TSX pages:**
- `isLoading ? <MUI Skeleton /> : <content />`  — used in ProductListingPage, ProductDetailPage, CartPage, OrderHistoryPage
- `if (!data) return <EmptyState />` — used when no error but no data either
- Inline error state in forms: `errors.fieldName?.message` via react-hook-form

**In JSX hooks (`useProducts.js`):**
- Local `useState` for `{ loading, error }` — no store involved
- Returns `{ products, loading, error, total, filters, updateFilters, resetFilters, refetch }`

**In `ProfilePage.tsx`:**
- Uses `profileApi` directly (from `api/index.ts`) without going through a store
- Local `useState` manages addresses array and loading state

---

## 7. File & Code Conventions

### File Naming

| Pattern | Example | Rule |
|---------|---------|------|
| PascalCase for React components | `ProductDetailPage.tsx` | All `.tsx` / `.jsx` component files |
| camelCase for hooks | `useProducts.js`, `useCart.ts` | All hook files, prefix `use` |
| camelCase for stores | `authStore.ts`, `cartStore.ts` | All store files, suffix `Store` |
| camelCase for services | `auth.service.ts` | Service files, suffix `.service.ts` |
| camelCase for utilities | `utils.ts`, `api.ts` | Non-component files |
| kebab-case for assets | `shoe-1.jpg`, `highlightFirstVideo.mp4` | Public assets |

### Component Conventions

- **`memo()`**: All full-page TSX components are wrapped in `React.memo()` with an explicit `displayName` set
- **Inline local components**: Small sub-components defined inside the same file (e.g., `ProductCard` inside `ProductListingPage.tsx`)
- **No PropTypes**: TypeScript interfaces are used instead
- **Form components**: Always use `react-hook-form` + `zodResolver` — no uncontrolled or direct `useState` forms in TSX pages
- **`noValidate`** on all `<form>` elements to disable browser validation in favor of zod

### Import Path Aliases (from `vite.config.ts`)

```typescript
'@'           → src/
'@api'        → src/api/
'@components' → src/components/
'@pages'      → src/pages/
'@services'   → src/services/
'@stores'     → src/stores/
'@types'      → src/types/
'@utils'      → src/utils/
'@ecommerce/shared' → ../shared/types.ts
```

The JSX files use **relative imports** exclusively (they predate the alias setup).

### Store Conventions

- All primary stores: `create<StateInterface>()(persist(fn, options))`
- All action names: verb-first camelCase (`fetchCart`, `addToCart`, `clearError`)
- All async actions: set `isLoading: true` before, set `isLoading: false` in finally/catch
- All errors stored as `ApiError | null` (not plain strings)

### Formatting

- Prettier: likely single quotes, 2-space indent (config in `prettier.config.js`)
- ESLint: flat config, TS rules, react-hooks rules enforced
- `lint` script: `--max-warnings 0` — zero warnings policy

---

## 8. Custom Hooks

### TypeScript Hooks

#### `useAuth` (`hooks/useAuth.ts`)

Thin orchestration layer over `useAuthStore`.

```typescript
Parameters: none

Returns: {
  user: User | null,
  isAuthenticated: boolean,          // derived: !!user && !!accessToken
  isLoading: boolean,
  error: ApiError | null,
  login: (email: string, password: string) => Promise<void>,
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>,
  logout: () => void,
  clearError: () => void,
  setUser: (user: User) => void,
}
```

All action handlers are memoized with `useCallback`.

---

#### `useCart` (`hooks/useCart.ts`)

Thin orchestration layer over `useCartStore` with derived totals.

```typescript
Parameters: none

Returns: {
  cart: Cart | null,
  itemCount: number,          // cart?.items?.length || 0
  total: number,              // cart?.total || 0
  subtotal: number,           // cart?.subtotal || 0
  tax: number,                // cart?.tax || 0
  shipping: number,           // cart?.shipping || 0
  isLoading: boolean,
  error: ApiError | null,
  fetchCart: () => Promise<void>,
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>,
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>,
  removeFromCart: (cartItemId: string) => Promise<void>,
  clearCart: () => Promise<void>,
  clearError: () => void,
  setCart: (cart: Cart) => void,
}
```

---

#### `useProduct` (`hooks/useProduct.ts`)

Thin orchestration layer over `useProductStore`.

```typescript
type Filters = {
  categoryId?: string,
  minPrice?: number,
  maxPrice?: number,
  search?: string,
  page: number,
  limit: number,
  sortBy?: string,
}

Parameters: none

Returns: {
  products: Product[],
  selectedProduct: Product | null,
  isLoading: boolean,
  isFetching: boolean,
  error: ApiError | null,
  pagination: { page, limit, total, pages } | null,
  filters: Filters,
  fetchProducts: (newFilters?: Filters) => Promise<void>,
  getProductById: (id: string) => Promise<void>,
  searchProducts: (query: string) => Promise<void>,
  setFilters: (newFilters: Partial<Filters>) => void,
  clearFilters: () => void,
  clearError: () => void,
  setSelectedProduct: (product: Product | null) => void,
}
```

---

#### `useOrder` (`hooks/useOrder.ts`)

Thin orchestration layer over `useOrderStore`.

```typescript
Parameters: none

Returns: {
  orders: Order[],
  selectedOrder: Order | null,
  isLoading: boolean,
  isFetching: boolean,
  error: ApiError | null,
  pagination: { page, limit, total, pages } | null,
  fetchOrders: (page?: number, limit?: number) => Promise<void>,
  getOrderById: (id: string) => Promise<void>,
  createOrder: (orderData: any) => Promise<Order>,
  cancelOrder: (id: string) => Promise<void>,
  clearError: () => void,
  setSelectedOrder: (order: Order | null) => void,
}
```

---

### JavaScript Hooks

#### `useRouter` (`hooks/useRouter.jsx`)

Custom SPA router. **Must be used inside `<RouterProvider>`.**

```javascript
Parameters: none (reads from RouterContext)

Returns: {
  currentPath: string,                              // window.location.pathname
  searchParams: URLSearchParams,
  navigate: (path: string, params?: object) => void, // pushState + scroll to top
  getParam: (key: string) => string | null,
  getAllParams: () => Record<string, string>,
  routeKey: number,                                  // increments on navigation (force re-render key)
}

// Also exports:
RouterProvider: React.FC<{ children: ReactNode }>
Link: React.FC<{ to: string, className?: string, children: ReactNode }>
```

---

#### `useProducts` (`hooks/useProducts.js`)

Standalone hook that fetches products directly via `fetch()` — does **not** use the Zustand productStore.

```javascript
Parameters: initialFilters?: {
  category?: string,   // maps to ?search= on the API
  search?: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: 'price-low' | 'price-high' | 'newest' | 'rating' | 'featured',
}

Returns: {
  products: MappedProduct[],   // DB shape → UI shape (name, brand, category, price, etc.)
  loading: boolean,
  error: string | null,
  total: number,
  filters: object,
  updateFilters: (newFilters: Partial<Filters>) => void,
  resetFilters: () => void,
  setFilters: (filters: Filters) => void,
  refetch: () => void,
}
```

Image URLs are resolved by `resolveImageUrl(url)`: passes through `http://` URLs, prepends server base for `/uploads/` paths, falls back to `/assets/shoes/shoe-5.avif`.

---

#### `useProduct` (`hooks/useProducts.js`)

Fetches a single product by ID via `fetch()`.

```javascript
Parameters: productId: string | undefined

Returns: {
  product: MappedProduct | null,
  loading: boolean,
  error: string | null,
}
```

---

#### `useRelatedProducts` (`hooks/useProducts.js`)

Fetches related products (currently just fetches all products with a limit).

```javascript
Parameters:
  productId: string | undefined
  limit?: number  // default: 4

Returns: {
  products: MappedProduct[],
  loading: boolean,
}
```

---

## 9. Utility Functions

### `src/lib/utils.ts`

```typescript
cn(...inputs: ClassValue[]): string
// Combines clsx() conditional logic with twMerge() deduplication.
// Usage: cn('base-class', condition && 'conditional-class', 'override-class')

formatPrice(amount: number): string
// Formats number as Indian Rupee. Uses Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
// formatPrice(1500) → "₹1,500"

formatDate(dateString: string): string
// Formats ISO date string for Indian locale: dd MMM yyyy
// formatDate("2025-01-15") → "15 Jan 2025"

truncate(str: string, length: number): string
// Returns str if str.length <= length, else str.slice(0, length) + "…"

getDiscountPercent(base: number, discounted: number): number
// Returns Math.round((base - discounted) / base * 100)
// Returns 0 if base <= 0
```

### `src/lib/utils.js` (legacy)

```javascript
cn(...inputs): string
// Same as utils.ts version — only cn(), nothing else.
```

### `src/utils/index.js`

Not utility functions — only static asset **re-exports**:

```javascript
export watchImg      // '/assets/images/watch.svg'
export rightImg      // '/assets/images/right.svg'
export playImg       // '/assets/icons/play.svg'
export pauseImg      // '/assets/icons/pause.svg'
export replayImg     // '/assets/icons/replay.svg'
export highlightFirstVideo   // '/assets/Videos/highlightFirstVideo.mp4'
export highlightSecondVideo  // '/assets/Videos/highlightSecondVideo.mp4'
export highlightThirdVideo   // '/assets/Videos/highlightThirdVideo.mp4'
export highlightFourthVideo  // '/assets/Videos/highlightFourthVideo.mp4'
```

### `src/lib/theme.ts`

```typescript
// Exported values (not functions):
lightTheme: Theme   // MUI theme, primary: orange (#E65100), secondary: blue (#1565C0), font: Inter
darkTheme: Theme    // MUI theme, primary: light orange (#FF833A), dark background
// Both override MuiButton (rounded, no textTransform) and MuiCard (borderRadius 12)
```

### `src/api/services/*.ts` — `resolveImageUrl` (internal, in `useProducts.js`)

```javascript
resolveImageUrl(url: string | undefined): string
// If url is falsy → '/assets/shoes/shoe-5.avif'
// If url starts with 'http' → url as-is
// If url starts with '/uploads' → SERVER_BASE + url (server base = API_BASE without '/api')
// Otherwise → url as-is
```

---

## 10. Environment & Config

### Environment Variables

Only **one** env variable is actively consumed:

| Variable | Default | Used In |
|----------|---------|---------|
| `VITE_API_URL` | `http://localhost:3000/api` | `api/client.ts`, `services/api.ts`, `hooks/useProducts.js` |
| `VITE_API_URL` | `http://localhost:5000/api` | `lib/api.ts` (**different default port — 5000 vs 3000**) |

Create a `.env` file in `client/`:

```ini
VITE_API_URL=http://localhost:3000/api
```

No other env variables are referenced in the source.

### Vite Config (`vite.config.ts`)

```typescript
plugins: [react()]             // @vitejs/plugin-react (SWC)
resolve.alias: {               // path aliases (see Section 7)
  '@', '@api', '@components', '@pages',
  '@services', '@stores', '@types', '@utils',
  '@ecommerce/shared' → '../shared/types.ts'
}
server: {
  port: 5173,
  proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true, secure: false } }
}
build: {
  outDir: 'dist',
  sourcemap: true,
  minify: 'terser',
  reportCompressedSize: false
}
```

**Proxy rule:** In development, any request to `/api/*` is forwarded to `http://localhost:3000`. This means `VITE_API_URL` should be set to `/api` (relative) in dev if you want the proxy to work, but the current defaults use absolute URLs — the proxy is effectively bypassed.

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Tailwind Config (`tailwind.config.js`)

```javascript
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
theme.extend.colors: {
  primary: '#1f2937',    // dark gray
  secondary: '#3b82f6',  // blue
  accent: '#ec4899',     // pink
}
theme.extend.fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif']
}
plugins: []              // no Tailwind plugins
```

> The Tailwind custom tokens (`primary`, `secondary`, `accent`) are defined but rarely used — components use MUI theme colors or raw Tailwind colors (`orange-600`, `gray-900`, etc.) directly.

### Build Scripts

```bash
npm run dev           # vite — dev server on port 5173
npm run build         # tsc && vite build — type-check then bundle
npm run preview       # vite preview — preview production build
npm run lint          # eslint with --max-warnings 0
npm run lint:fix      # eslint with auto-fix
npm run type-check    # tsc --noEmit — type-check without building
```

---

## 11. Known Issues & TODOs

### Critical: Dual App Trees

The most significant architectural issue: **two separate, parallel application trees exist simultaneously** and neither is complete:

1. **`main.tsx` / `App.tsx`** — TypeScript entry with React Router, MUI ThemeProvider, ErrorBoundary — but routes only `/`, `/login`, `/checkout` (placeholder), and `/profile` (placeholder). The real pages (`LandingPage.tsx`, `ProductListingPage.tsx`, etc.) are never mounted.
2. **`main.jsx` / `App.jsx`** — JSX entry with custom router — routes all JSX pages but uses mock/stub implementations for cart, checkout, and profile.

**The standalone TSX pages (`LandingPage.tsx`, `ProductListingPage.tsx`, `ProductDetailPage.tsx`, `CartPage.tsx`, `CheckoutPage.tsx` in checkout/, `ProfilePage.tsx`, `OrderHistoryPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `OtpVerificationPage.tsx`) are complete and production-ready but are currently unreachable by any router.**

**Fix needed:** Wire all TSX pages into `App.tsx` using `ClientLayout.tsx` as the shell.

---

### Critical: Dual Auth Stores (`store/` vs `stores/`)

Two auth stores with different API strategies coexist:

- `store/authStore.ts` — cookie/session approach via `lib/api.ts` (base: `:5000/api`)
- `stores/authStore.ts` — JWT bearer token approach via `api/client.ts` (base: `:3000/api`)

`components/guards/ProtectedRoute.tsx` uses `store/authStore.ts`.  
All TSX pages use `stores/authStore.ts`.  

**Fix needed:** Pick one auth strategy and delete the other. The `stores/authStore.ts` JWT approach is more fully implemented.

---

### Duplicate HTTP Clients

Three Axios/fetch instances (`api/client.ts`, `lib/api.ts`, `services/api.ts`) plus raw `fetch` in `useProducts.js`. They have different base URLs and different auth strategies.

**Fix needed:** Consolidate to `api/client.ts` as the single HTTP client.

---

### `recharts` Dependency Unused

`recharts@^2.10.4` is listed in `package.json` but no chart component exists in the client source.

---

### `@radix-ui/react-toast` Unused

Installed but `<Toast>` is never rendered. No toast notification system is wired.

---

### `CustomerPages.jsx` — All Stubs

The `CartPage`, `CheckoutPage`, `ProfilePage`, and `OrdersPage` exported from `pages/CustomerPages.jsx` contain only mock/placeholder implementations (no real API calls, static data). These are what `App.jsx` renders today.

---

### `ProductGallary.jsx` — Typo in Filename

The file is named `ProductGallary.jsx` (missing an 'e'). Should be `ProductGallery.jsx`.

---

### `App.tsx` — Stale Checkout

The `CheckoutPage` mounted at `/checkout` in `App.tsx` is `pages/shop/CheckoutPage.tsx`, which is an old prototype using `store/cartStore.ts` with a mock `alert('Order placed successfully')`. The real checkout page is at `pages/checkout/CheckoutPage.tsx`.

---

### Missing: Theme Persistence for Dark Mode

`useUiStore` reads from `localStorage.getItem('theme')` on initialization but the `ThemeProvider` in `main.tsx` calls `useUiStore()` inside the `Root` component — this is a synchronous read before React hydration, so there may be a brief flash of light theme on page load in dark mode.

---

### Missing: Global Error Toast Notifications

There is no global toast/snackbar system. API errors are silently stored in store `.error` fields, and only some components display them. The `@radix-ui/react-toast` package is installed but not implemented.

---

### Missing: Authentication Redirect After Login

`pages/auth/LoginPage.tsx` (used by `App.tsx`) navigates to `/` after login, ignoring `state.from` from the redirect. The full version in `pages/auth/RegisterPage.tsx` also navigates to `/` unconditionally.

---

### Missing: Pagination for Orders in `OrderHistoryPage.tsx`

`fetchOrders(1, 50)` is called with a hard-coded limit of 50. There is no pagination UI on the orders table despite the store supporting `pagination` state.

---

### `api/index.ts` — URL Mismatch with Service Classes

`cartApi.updateCartItem` calls `PUT /cart/items/:id` but `ClientCartService.updateCartItem` calls `PUT /cart/items/:id` — these match. However, `cartApi.addToCart` uses `/cart/add` while `ClientCartService.addToCart` uses `/cart/items` (POST). The actual backend endpoint needs to be the authoritative source.

---

### GSAP ScrollTrigger Not Cleaned Up

`VideoCarousel.jsx` calls `gsap.killTweensOf()` on each render inside a `useEffect`, but the `ScrollTrigger` instances created in `Highlights.jsx` via `useGSAP` are not explicitly reverted on unmount. This may cause memory leaks if the component is unmounted and remounted.

---

### Legacy `.js` Barrel Files

`stores/index.js`, `stores/authStore.js`, `stores/cartStore.js`, `stores/orderStore.js`, `stores/productStore.js` are all re-export wrappers that exist only for JSX backward compatibility. Once all JSX files are migrated to TSX, these can be deleted.
