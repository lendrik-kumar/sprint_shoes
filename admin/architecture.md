# Admin Panel — Architecture Reference

> **Generated:** 2026-03-08  
> **Status:** Mid-migration from JSX to TSX. Two parallel entry points coexist (see §11 Known Issues).

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
11. [Known Issues / TODOs](#11-known-issues--todos)

---

## 1. Full Folder Structure

```
admin/
├── .env                          # Active env (VITE_API_URL=http://localhost:3000/api)
├── .env.example                  # Env template (same single variable)
├── .env.template                 # Empty placeholder (not in use)
├── .gitignore
├── index.html                    # ⚠️ Entry — currently loads /src/main.jsx (JSX legacy)
├── package.json
├── postcss.config.js
├── prettier.config.js
├── tailwind.config.js
├── tsconfig.json                 # Strict TS config, paths alias map
├── tsconfig.node.json            # Vite config compilation settings
├── vite.config.ts                # Dev server :5174, proxy /api → :3000, terser build
├── architecture.md               # This file
│
├── public/
│   ├── logo.png
│   └── assets/
│       ├── icons/
│       ├── images/
│       ├── shoes/
│       └── Videos/
│
└── src/
    ├── main.jsx        ⚠️  ACTIVE entry — renders App.jsx (legacy JSX path)
    ├── main.tsx           NEW entry — renders App.tsx (TSX path, NOT loaded by index.html)
    ├── App.jsx         ⚠️  ACTIVE root — conditional auth gate → AdminDashboard.jsx
    ├── App.tsx            NEW root — BrowserRouter + AdminRoute guard + placeholder routes
    ├── index.css          Global Tailwind directives + base resets
    ├── vite-env.d.ts      Vite env type declarations
    │
    ├── api/               All HTTP interaction layer
    │   ├── client.ts      Class-based ApiClient (Axios, Bearer token from localStorage)
    │   ├── index.ts       All API function objects (authApi, adminDashboardApi, etc.)
    │   └── services/      Static class services with Zod runtime validation
    │       ├── auth.service.ts
    │       ├── product.service.ts
    │       ├── order.service.ts
    │       ├── user.service.ts
    │       └── index.ts   Re-exports all service classes
    │
    ├── components/
    │   ├── UI.jsx         Thin MUI wrappers: Button, Input, Alert, Spinner, Modal, Select, Textarea
    │   ├── index.js       Re-exports everything from UI.jsx (legacy barrel)
    │   ├── admin/
    │   │   ├── Sidebar.tsx    MUI Drawer nav (6 nav items, responsive mobile/desktop)
    │   │   └── Topbar.tsx     Sticky AppBar, theme toggle, user avatar menu, logout
    │   ├── common/
    │   │   └── ErrorBoundary.tsx  Class component error boundary with fallback UI
    │   └── guards/
    │       └── AdminRoute.tsx     Route guard — checks isAuthenticated + role via adminAuthStore
    │
    ├── hooks/
    │   ├── index.ts            Re-exports all 5 hooks
    │   ├── useAdminAuth.ts
    │   ├── useAdminDashboard.ts
    │   ├── useAdminOrders.ts
    │   ├── useAdminProducts.ts
    │   └── useAdminUsers.ts
    │
    ├── layouts/
    │   └── AdminLayout.tsx     MUI flex layout: Sidebar (240px) + Topbar + <Outlet />
    │
    ├── lib/
    │   ├── api.ts     Functional Axios instance (cookies, withCredentials, UUID header)
    │   ├── theme.ts   adminDarkTheme + adminLightTheme (MUI createTheme)
    │   └── utils.ts   cn(), formatPrice(), formatDate(), truncate()
    │
    ├── pages/
    │   ├── AdminDashboard.jsx   ⚠️ 959-line monolithic JSX — full tab-based admin UI
    │   ├── DashboardPage.tsx    TSX dashboard — stat cards + revenue chart + recent orders
    │   ├── AnalyticsPage.tsx    TSX analytics — line/pie/bar charts from recharts
    │   ├── AuditLogsPage.tsx    TSX audit log viewer — DataGrid + search
    │   ├── LoginPage.tsx        TSX login — react-hook-form + zod + MUI
    │   ├── OrderManagementPage.tsx  TSX order list — DataGrid + inline status select
    │   ├── ProductManagementPage.tsx TSX product CRUD — DataGrid + Dialog form + zod
    │   ├── UserManagementPage.tsx   TSX user list — DataGrid + inline role/status controls
    │   └── auth/
    │       └── AdminLoginPage.tsx   TSX login (older, used by App.tsx routes)
    │
    ├── store/                   (singular — separate from stores/)
    │   └── adminAuthStore.ts    Cookie-based auth store, listens for admin:unauthorized event
    │
    ├── stores/                  (plural — the main store directory)
    │   ├── index.ts             Barrel: exports all 7 stores
    │   ├── index.js             Legacy JS barrel: re-exports only useAuthStore + useAdminStore
    │   ├── authStore.ts         JWT/localStorage auth store with persist middleware
    │   ├── authStore.js         Legacy JS wrapper → re-exports from authStore.ts
    │   ├── adminStore.ts        ⚠️ Monolithic store (572 lines) — all domains in one store
    │   ├── adminStore.js        Legacy JS wrapper → re-exports from adminStore.ts
    │   ├── productAdminStore.ts Split store: products domain
    │   ├── orderAdminStore.ts   Split store: orders domain
    │   ├── userAdminStore.ts    Split store: users domain
    │   ├── dashboardAdminStore.ts Split store: dashboard stats domain
    │   ├── auditAdminStore.ts   Split store: audit logs domain
    │   └── uiStore.ts           Split store: theme mode (light/dark), persisted in localStorage
    │
    └── types/
        └── index.ts    Canonical TypeScript types for the entire admin app
```

---

## 2. Technology Stack

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | React DOM renderer |
| `react-router-dom` | ^6.20.1 | Client-side routing (`BrowserRouter`, `Routes`, `Outlet`) |
| `zustand` | ^4.4.1 | Global state management (split + monolithic stores) |
| `axios` | ^1.6.2 | HTTP client for both `ApiClient` and `lib/api.ts` |
| `@mui/material` | ^5.14.20 | Component library (layout, forms, data display) |
| `@mui/icons-material` | ^5.14.20 | MUI icon set |
| `@mui/x-data-grid` | ^7.0.0 | DataGrid for Products, Orders, Users, Audit Logs pages |
| `@emotion/react` | ^11.11.1 | MUI CSS-in-JS peer dependency |
| `@emotion/styled` | ^11.11.0 | MUI CSS-in-JS peer dependency |
| `recharts` | ^2.10.4 | Charts in DashboardPage and AnalyticsPage (Line, Bar, Pie) |
| `react-hook-form` | ^7.50.1 | Form state management in login and product pages |
| `@hookform/resolvers` | ^3.3.4 | Zod adapter for react-hook-form |
| `zod` | ^3.22.4 | Schema validation (forms + service layer) |
| `lucide-react` | ^0.460.0 | Icon set used throughout components and nav |
| `clsx` | ^2.0.0 | Conditional classname utility |
| `tailwind-merge` | ^2.2.0 | Merges Tailwind classes without conflicts |
| `class-variance-authority` | ^0.7.0 | CVA variant utility (imported but not widely used yet) |
| `@radix-ui/react-dialog` | ^1.1.1 | Headless dialog primitive (imported, not yet used in pages) |
| `@radix-ui/react-select` | ^1.2.2 | Headless select primitive (imported, not yet used in pages) |
| `@radix-ui/react-slot` | ^1.0.2 | Slot composition primitive |
| `@radix-ui/react-toast` | ^1.1.5 | Toast notifications (declared but no ToastProvider wired) |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.0.8 | Build tool & dev server |
| `@vitejs/plugin-react` | ^4.2.1 | Vite React plugin (Babel transform, fast refresh) |
| `typescript` | ^5.3.3 | TypeScript compiler |
| `@types/react` | ^19.0.0 | React type definitions |
| `@types/react-dom` | ^19.0.0 | React DOM type definitions |
| `@types/node` | ^20.10.6 | Node.js type definitions (path resolution in vite.config) |
| `tailwindcss` | ^3.3.6 | Utility-first CSS framework |
| `postcss` | ^8.4.32 | CSS processing (autoprefixer) |
| `autoprefixer` | ^10.4.16 | Vendor prefix automation |
| `eslint` | ^8.56.0 | Linter |
| `@eslint/js` | ^8.56.0 | ESLint JS config |
| `@typescript-eslint/eslint-plugin` | ^6.17.0 | TypeScript ESLint rules |
| `@typescript-eslint/parser` | ^6.17.0 | TypeScript ESLint parser |
| `eslint-plugin-react-hooks` | ^4.6.0 | Hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.4.5 | Fast refresh lint rules |
| `prettier` | ^3.1.1 | Code formatter |
| `terser` | ^5.46.0 | JS minifier used in production build |

---

## 3. Component Hierarchy

### Active Entry (JSX path — what `index.html` loads)

```
main.jsx
└── <StrictMode>
    └── App (App.jsx)
        ├── [if !isAuthenticated] AdminLoginPage (inline in App.jsx)
        │   ├── Alert (UI.jsx)
        │   ├── Input (UI.jsx)
        │   └── Button (UI.jsx)
        └── [if isAuthenticated] AdminDashboard (pages/AdminDashboard.jsx)
            ├── NavButton (inline)
            ├── [tab=dashboard]  DashboardTab (inline)
            │   ├── Spinner (inline)
            │   ├── StatCard (inline)
            │   └── Badge (inline)
            ├── [tab=users]      UserManagementTab (inline, ~200 lines)
            │   ├── Spinner
            │   └── Badge
            ├── [tab=products]   ProductManagementTab (inline, ~300 lines)
            │   ├── Spinner
            │   ├── ProductForm (inline modal)
            │   └── Badge
            ├── [tab=orders]     OrderManagementTab (inline, ~150 lines)
            │   ├── Spinner
            │   └── Badge
            └── [tab=analytics]  AnalyticsTab (inline, ~100 lines)
```

### TSX Entry (not yet loaded — `main.tsx` path)

```
main.tsx
└── <StrictMode>
    └── Root (inline in main.tsx)
        └── <ThemeProvider theme={adminDark|LightTheme}>
            └── <CssBaseline />
                └── <BrowserRouter>
                    └── <ErrorBoundary>
                        └── App (App.tsx)
                            └── <BrowserRouter>           ⚠️ double BrowserRouter
                                └── <Routes>
                                    ├── /login → AdminLoginPage (pages/auth/AdminLoginPage.tsx)
                                    ├── <AdminRoute>       (guards/AdminRoute.tsx)
                                    │   ├── /dashboard → DashboardPage (stub inline in App.tsx)
                                    │   └── /products  → <div> placeholder
                                    └── * → Navigate /dashboard
```

### AdminLayout (used by future full TSX routing — not yet wired into App.tsx)

```
AdminLayout (layouts/AdminLayout.tsx)
├── Sidebar (components/admin/Sidebar.tsx)
│   └── 6 × ListItemButton (Dashboard, Products, Orders, Users, Analytics, Audit Logs)
├── Topbar (components/admin/Topbar.tsx)
│   ├── IconButton (menu toggle)
│   ├── IconButton (theme toggle → useUiStore)
│   └── Avatar menu (user info + Sign Out → useAuthStore)
└── <Outlet />  (page content rendered here)
```

### TSX Page Components (self-contained, use split stores)

```
DashboardPage.tsx
├── StatCard × 4 (inline memoised component)
├── LineChart (recharts)
├── Recent orders list
└── Sales by Category progress bars

ProductManagementPage.tsx
├── DataGrid (MUI x-data-grid, columns: image/name/category/price/stock/actions)
├── Dialog (create/edit form)
│   └── react-hook-form + zod (productSchema)
└── Dialog (delete confirm)

OrderManagementPage.tsx
├── Select (status filter)
├── DataGrid (order#/date/total/status-select/actions)
└── Dialog (order detail view)

UserManagementPage.tsx
└── DataGrid (name/email/role-select/active-switch/joined/status-chip)

AnalyticsPage.tsx
├── Select (period: 7d/30d/90d/1y)
├── LineChart (revenue trend)
├── PieChart (sales by category)
└── BarChart (orders by status)

AuditLogsPage.tsx
├── TextField (search)
└── DataGrid (time/admin/action/resource/resourceId/details/IP)

LoginPage.tsx (the TSX login used by stores/authStore.ts)
└── react-hook-form + zodResolver
    ├── email input
    └── password input (with show/hide toggle)
```

---

## 4. Routing Architecture

### Active Route Config (App.jsx — conditional render, no react-router)

```
App.jsx is NOT router-based.
Authentication gate is purely conditional JSX:

  if (!isAuthenticated) → <AdminLoginPage />   (inline component)
  if (isAuthenticated)  → <AdminDashboard />   (tab-based SPA, no URL changes)
```

The active app has **no URL routing** — the entire admin UI is a single SPA with local tab state (`currentTab` useState in `AdminDashboard.jsx`).

---

### New Route Config (App.tsx — BrowserRouter, not yet active)

```
/login          → AdminLoginPage       (public)
/dashboard      → DashboardPage stub   (protected via AdminRoute)
/products       → <div> placeholder    (protected via AdminRoute)
*               → Navigate /dashboard
```

The navigation links in `Sidebar.tsx` reference these paths:

| Label | Path | Icon |
|---|---|---|
| Dashboard | `/dashboard` | `LayoutDashboard` |
| Products | `/products` | `Package` |
| Orders | `/orders` | `ShoppingBag` |
| Users | `/users` | `Users` |
| Analytics | `/analytics` | `BarChart3` |
| Audit Logs | `/audit-logs` | `ScrollText` |

> **None of `/orders`, `/users`, `/analytics`, `/audit-logs` are registered in `App.tsx` routes yet.** They exist in `Sidebar.tsx` as dead links.

---

### AdminRoute Guard (`src/components/guards/AdminRoute.tsx`)

```tsx
// Props
interface AdminRouteProps {
  allowedRoles?: UserRole[];   // default: ['ADMIN', 'SUPERADMIN']
}

// Behaviour
1. Calls checkAuth() from adminAuthStore on mount (useEffect)
2. While isLoading → renders "Loading Admin..." fullscreen
3. If !isAuthenticated || !admin → <Navigate to="/login" state={{ from: location }} replace />
4. If admin.role not in allowedRoles → <Navigate to="/unauthorized" replace />
5. Otherwise → <Outlet />
```

**Note:** `AdminRoute` uses `adminAuthStore` from `src/store/adminAuthStore.ts` (cookie-based).  
`App.tsx` also calls `checkAuth` in its own `useEffect`. This causes a **double checkAuth call** on every protected page load.

---

## 5. State Architecture

The codebase contains **two parallel state systems**:

| System | Files | Used By |
|---|---|---|
| **Split stores** (new) | `stores/productAdminStore.ts` etc. | All `.tsx` pages |
| **Monolithic store** (legacy) | `stores/adminStore.ts` (572 lines) | `AdminDashboard.jsx` (indirectly via `useAuthStore`) |
| **adminAuthStore** (cookie) | `store/adminAuthStore.ts` | `App.tsx`, `AdminRoute.tsx` |
| **authStore** (JWT/localStorage) | `stores/authStore.ts` | `App.jsx`, `AdminDashboard.jsx`, `Topbar.tsx` |

---

### 5.1 `useProductAdminStore` — `src/stores/productAdminStore.ts`

**State shape:**
```typescript
{
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
}
```

**Actions:**

| Action | Signature | Behaviour |
|---|---|---|
| `fetchProducts` | `(page=1, limit=10, search?) → Promise<void>` | GET `/admin/products`, populates `products` + `pagination` |
| `getProductById` | `(id: string) → Promise<void>` | GET `/admin/products/:id`, sets `selectedProduct` |
| `createProduct` | `(productData: Partial<Product>) → Promise<void>` | POST `/admin/products`, prepends to `products` list |
| `updateProduct` | `(id: string, productData: Partial<Product>) → Promise<void>` | PUT `/admin/products/:id`, replaces item in list + updates `selectedProduct` |
| `deleteProduct` | `(id: string) → Promise<void>` | DELETE `/admin/products/:id`, filters from list, nulls `selectedProduct` if it matches |
| `clearSelectedProduct` | `() → void` | Sets `selectedProduct: null` |
| `clearError` | `() → void` | Sets `error: null` |

**Used by:** `ProductManagementPage.tsx`, `useAdminProducts` hook.

---

### 5.2 `useOrderAdminStore` — `src/stores/orderAdminStore.ts`

**State shape:**
```typescript
{
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
}
```

**Actions:**

| Action | Signature | Behaviour |
|---|---|---|
| `fetchOrders` | `(page=1, limit=10, status?: OrderStatus) → Promise<void>` | GET `/admin/orders`, populates `orders` + `pagination` |
| `getOrderById` | `(id: string) → Promise<void>` | GET `/admin/orders/:id`, sets `selectedOrder` |
| `updateOrderStatus` | `(id: string, status: OrderStatus) → Promise<void>` | PUT `/admin/orders/:id/status`, updates item in list + `selectedOrder` |
| `processRefund` | `(id: string, reason: string) → Promise<void>` | POST `/admin/orders/:id/refund`, updates item in list |
| `clearSelectedOrder` | `() → void` | Sets `selectedOrder: null` |
| `clearError` | `() → void` | Sets `error: null` |

**Used by:** `OrderManagementPage.tsx`, `useAdminOrders` hook.

---

### 5.3 `useUserAdminStore` — `src/stores/userAdminStore.ts`

**State shape:**
```typescript
{
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
}
```

**Actions:**

| Action | Signature | Behaviour |
|---|---|---|
| `fetchUsers` | `(page=1, limit=10, search?) → Promise<void>` | GET `/admin/users`, populates `users` + `pagination` |
| `getUserById` | `(id: string) → Promise<void>` | GET `/admin/users/:id`, sets `selectedUser` |
| `updateUser` | `(id: string, userData: Partial<User>) → Promise<void>` | PUT `/admin/users/:id`, replaces item in list + `selectedUser` |
| `updateUserRole` | `(id: string, role: UserRole) → Promise<void>` | Calls `adminUserApi.updateUser(id, { role })`, updates list item |
| `toggleUserStatus` | `(id: string) → Promise<void>` | Reads current `isActive`, calls `updateUser` with toggled value |
| `deleteUser` | `(id: string) → Promise<void>` | DELETE `/admin/users/:id`, filters from list, nulls `selectedUser` if matches |
| `clearSelectedUser` | `() → void` | Sets `selectedUser: null` |
| `clearError` | `() → void` | Sets `error: null` |

**Used by:** `UserManagementPage.tsx`, `useAdminUsers` hook.

---

### 5.4 `useDashboardAdminStore` — `src/stores/dashboardAdminStore.ts`

**State shape:**
```typescript
{
  stats: DashboardStats | null;
  isLoading: boolean;
  error: ApiError | null;
}

// DashboardStats shape (defined inline in dashboardAdminStore.ts):
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueChange: number;          // % change vs last month
  ordersChange: number;
  usersChange: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
  salesByCategory: Array<{ category: string; sales: number }>;
  revenueOverTime: Array<{ date: string; revenue: number }>;
}
```

**Actions:**

| Action | Signature | Behaviour |
|---|---|---|
| `fetchStats` | `() → Promise<void>` | GET `/admin/stats`, sets `stats` |
| `clearError` | `() → void` | Sets `error: null` |

**Used by:** `DashboardPage.tsx`, `AnalyticsPage.tsx`, `useAdminDashboard` hook.

> **Note:** `DashboardStats` in `stores/dashboardAdminStore.ts` and `DashboardStats` in `types/index.ts` have **different shapes** (see §11).

---

### 5.5 `useAuditAdminStore` — `src/stores/auditAdminStore.ts`

**State shape:**
```typescript
{
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: ApiError | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
  filters: {
    search?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  };
}

// AuditLog shape (defined in auditAdminStore.ts):
interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}
```

**Actions:**

| Action | Signature | Behaviour |
|---|---|---|
| `fetchAuditLogs` | `(page=1, limit=20, filters?: AuditFilters) → Promise<void>` | GET `/admin/audit-logs`, populates `auditLogs` + `pagination` |
| `setFilters` | `(filters: AuditFilters) → void` | Updates `filters` in state (does not trigger fetch) |
| `clearError` | `() → void` | Sets `error: null` |

**Used by:** `AuditLogsPage.tsx`.

---

### 5.6 `useUiStore` — `src/stores/uiStore.ts`

**State shape:**
```typescript
{
  themeMode: 'light' | 'dark';  // initial value from localStorage('admin-theme') ?? 'dark'
}
```

**Actions:**

| Action | Signature | Behaviour |
|---|---|---|
| `toggleTheme` | `() → void` | Flips `themeMode` between `'light'` and `'dark'`, persists to `localStorage('admin-theme')` |
| `setTheme` | `(mode: 'light' \| 'dark') → void` | Directly sets theme, persists to localStorage |

**Used by:** `main.tsx` (ThemeProvider selector), `Topbar.tsx` (toggle button).

**Note:** This store is **not** using Zustand's `persist` middleware — it manually syncs to `localStorage` on every write.

---

### 5.7 Supporting Stores (Auth)

#### `useAuthStore` — `src/stores/authStore.ts` (JWT / localStorage)

Used by the **active JSX path** (`App.jsx`, `AdminDashboard.jsx`, `Topbar.tsx`).

```typescript
// State
{
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
}
// Persisted (Zustand persist middleware, key: 'admin-auth-store')
// Partialised: user, accessToken, refreshToken, isAuthenticated
```

| Action | Signature | Behaviour |
|---|---|---|
| `init` | `() → void` | Checks persisted state, sets `isAuthenticated` if `accessToken` + valid admin role |
| `login` | `(email, password) → Promise<void>` | POST `/auth/login`, decodes JWT if `user` not in response, validates role is ADMIN/SUPERADMIN |
| `logout` | `() → void` | Clears localStorage tokens, resets state |
| `clearError` | `() → void` | Sets `error: null` |

#### `useAdminAuthStore` — `src/store/adminAuthStore.ts` (HTTP cookies)

Used by the **new TSX path** (`App.tsx`, `AdminRoute.tsx`).

```typescript
// State
{
  admin: UserProfileDTO | null;   // from @ecommerce/shared
  isAuthenticated: boolean;
  isLoading: boolean;
}
// Persisted (Zustand persist, key: 'admin-auth-storage')
// Partialised: admin, isAuthenticated
// Also listens for window event: 'admin:unauthorized'
```

| Action | Signature | Behaviour |
|---|---|---|
| `login` | `(credentials: any) → Promise<void>` | POST `/admin/login`, sets `admin` + `isAuthenticated` |
| `logout` | `() → Promise<void>` | POST `/auth/logout`, clears state |
| `checkAuth` | `() → Promise<void>` | GET `/auth/me`, validates role is ADMIN/SUPERADMIN |

---

## 6. Data Fetching

### HTTP Clients

Two distinct Axios instances exist in parallel:

#### `src/api/client.ts` — `ApiClient` class (used by split stores)

```typescript
baseURL: VITE_API_URL || 'http://localhost:3000/api'
timeout: 10000
headers: { 'Content-Type': 'application/json' }

Request interceptor:
  - Reads accessToken from localStorage
  - Sets Authorization: Bearer <token>

Response interceptor:
  - On 401: retries once after refreshing tokens (POST /auth/refresh)
  - On refresh failure: clears localStorage, redirects to /login
```

#### `src/lib/api.ts` — `api` axios instance (used by `adminAuthStore`)

```typescript
baseURL: VITE_API_URL || 'http://localhost:5000/api'   ⚠️ different default port: 5000
withCredentials: true
timeout: 15000

Request interceptor:
  - Adds X-Request-Id: crypto.randomUUID() header

Response interceptor:
  - On 401 or 403: window.dispatchEvent(new CustomEvent('admin:unauthorized'))
  - Normalises errors: { message, status, code, details }
```

#### `AdminDashboard.jsx` — raw `fetch()` (bypasses both Axios instances)

```javascript
// Local helper in AdminDashboard.jsx — no Axios, no interceptors
async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `API error ${res.status}`);
  return json;
}
```

---

### API Endpoints Used

| Module | Method | Endpoint | Used by |
|---|---|---|---|
| Auth | POST | `/auth/login` | `authStore`, `AdminLoginPage.tsx` |
| Auth | POST | `/auth/logout` | `authStore`, `adminAuthStore` |
| Auth | POST | `/auth/refresh` | `ApiClient` interceptor |
| Auth | GET | `/auth/me` | `adminAuthStore.checkAuth` |
| Auth | POST | `/admin/login` | `adminAuthStore.login` |
| Dashboard | GET | `/admin/stats` | `useDashboardAdminStore`, `AdminDashboard.jsx` |
| Users | GET | `/admin/users` | `useUserAdminStore`, `AdminDashboard.jsx` |
| Users | GET | `/admin/users/:id` | `useUserAdminStore` |
| Users | PUT | `/admin/users/:id` | `useUserAdminStore` |
| Users | DELETE | `/admin/users/:id` | `useUserAdminStore`, `AdminDashboard.jsx` |
| Products | GET | `/admin/products` | `useProductAdminStore`, `AdminDashboard.jsx` |
| Products | GET | `/admin/products/:id` | `useProductAdminStore` |
| Products | POST | `/admin/products` | `useProductAdminStore`, `AdminDashboard.jsx` |
| Products | PUT | `/admin/products/:id` | `useProductAdminStore`, `AdminDashboard.jsx` |
| Products | DELETE | `/admin/products/:id` | `useProductAdminStore`, `AdminDashboard.jsx` |
| Products | PATCH | `/admin/products/:id/inventory` | `adminProductApi.updateInventory` |
| Orders | GET | `/admin/orders` | `useOrderAdminStore`, `AdminDashboard.jsx` |
| Orders | GET | `/admin/orders/:id` | `useOrderAdminStore` |
| Orders | PUT | `/admin/orders/:id/status` | `useOrderAdminStore`, `AdminDashboard.jsx` |
| Orders | POST | `/admin/orders/:id/refund` | `useOrderAdminStore` |
| Audit | GET | `/admin/audit-logs` | `useAuditAdminStore` |
| Audit | GET | `/admin/audit-logs/:id` | `adminAuditApi` (called from monolithic store) |
| Profile | GET | `/profile` | `profileApi` (defined, not consumed by any page) |
| Profile | PUT | `/profile` | `profileApi` (defined, not consumed by any page) |
| Profile | GET/POST/PUT/DELETE | `/profile/addresses` | `profileApi` (defined, not consumed by any page) |

---

### Loading / Error Handling Pattern (split stores)

Every async action in all 6 split stores follows the same pattern:

```typescript
actionName: async (...args) => {
  set({ isLoading: true, error: null });   // 1. Reset error, show loading
  try {
    const { data } = await apiCall(...args);
    if (data.success) {
      set({ ...updatedState, isLoading: false });  // 2. Success: update state
    }
  } catch (err) {
    set({ error: handleError(err), isLoading: false });  // 3. Error: store ApiError
    throw err;  // re-thrown on mutation actions (create/update/delete) to allow page-level catch
  }
}
```

The shared `handleError` helper (duplicated in each store — not extracted to a shared module):
```typescript
const handleError = (err: unknown): ApiError => {
  const e = err as { response?: { data?: { message?: string; code?: string } } };
  return {
    success: false,
    message: e?.response?.data?.message ?? 'An error occurred',
    code: e?.response?.data?.code,
  };
};
```

---

### Polling / Refresh

- **No polling or automatic refresh** is implemented anywhere.
- All data fetches are triggered manually: on `useEffect` mount, or on user actions (button clicks, filter changes).
- `AnalyticsPage.tsx` has a `period` state variable with a dropdown UI, but `fetchStats()` does not pass the period to the API — the endpoint is called the same way regardless of selection.

---

## 7. File & Code Conventions

### Naming Patterns

| Element | Convention | Example |
|---|---|---|
| React components | PascalCase | `DashboardPage`, `AdminLayout`, `ErrorBoundary` |
| Store hooks | `use` + domain + `AdminStore` | `useProductAdminStore`, `useOrderAdminStore` |
| Custom hooks | `useAdmin` + domain | `useAdminProducts`, `useAdminOrders` |
| API objects | domain + `Api` | `adminProductApi`, `adminOrderApi` |
| Service classes | `Admin` + domain + `Service` | `AdminProductService`, `AdminOrderService` |
| TypeScript types | PascalCase | `Product`, `OrderStatus`, `ApiError` |
| Store state files | domain + `AdminStore.ts` | `productAdminStore.ts`, `dashboardAdminStore.ts` |
| Page files | PascalCase + `Page.tsx` | `DashboardPage.tsx`, `AnalyticsPage.tsx` |
| Layout files | PascalCase + `Layout.tsx` | `AdminLayout.tsx` |
| Path aliases | `@/` prefix | `@/stores`, `@/types`, `@/api` |

### File Organization Patterns

- **Barrel files** (`index.ts`) exist for `hooks/`, `stores/`, `api/services/`, `components/`.
- **Legacy JS wrappers** (`*.js`) exist for stores undergoing JSX→TSX migration — each is a 1-line re-export pointing to the `.ts` version.
- **Co-located types** — `DashboardStats` is defined in `stores/dashboardAdminStore.ts`; `AuditLog` is defined in both `stores/auditAdminStore.ts` and `types/index.ts`.

### TypeScript Strictness

`tsconfig.json` enforces:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

### ESLint Rules (`.tsx` files only)

```javascript
'@typescript-eslint/no-explicit-any': 'error'           // any forbidden
'@typescript-eslint/explicit-function-return-types': 'error'
'@typescript-eslint/no-unused-vars': 'error'            // _ prefix allowed for args
'no-console': ['warn', { allow: ['warn', 'error'] }]    // console.log forbidden
'react-refresh/only-export-components': 'warn'
```

> **The ESLint config only covers `.ts/.tsx` files. All `.jsx` files (including the 959-line `AdminDashboard.jsx`) are exempt from these rules.**

---

## 8. Custom Hooks

All hooks live in `src/hooks/` and are re-exported from `src/hooks/index.ts`.

---

### `useAdminAuth` — `src/hooks/useAdminAuth.ts`

Thin wrapper around `useAuthStore` (from `src/stores/authStore.ts`).

```typescript
// Parameters: none
// Returns:
{
  user: User | null;
  isAuthenticated: boolean;     // computed: !!user && !!accessToken
  isAdmin: boolean;             // computed: role === 'ADMIN' || 'SUPERADMIN'
  isLoading: boolean;
  error: ApiError | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  init: () => void;
}
```

`login`, `logout`, `init` are each wrapped in `useCallback` to stabilise references.

---

### `useAdminDashboard` — `src/hooks/useAdminDashboard.ts`

Thin wrapper around `useDashboardAdminStore`.

```typescript
// Parameters: none
// Returns:
{
  stats: DashboardStats | null;
  isLoading: boolean;
  error: ApiError | null;
  fetchStats: () => Promise<void>;   // useCallback-wrapped
}
```

---

### `useAdminOrders` — `src/hooks/useAdminOrders.ts`

Thin wrapper around `useOrderAdminStore`.

```typescript
// Parameters: none
// Returns:
{
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;
  fetchOrders: (page?: number, limit?: number, status?: OrderStatus) => Promise<void>;
  getOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  clearSelectedOrder: () => void;    // direct from store (not wrapped)
}
```

`fetchOrders`, `getOrderById`, `updateOrderStatus` are wrapped in `useCallback`. `clearSelectedOrder` is passed directly from the store.

> **Note:** `processRefund` from `useOrderAdminStore` is **not** exposed by this hook.

---

### `useAdminProducts` — `src/hooks/useAdminProducts.ts`

Thin wrapper around `useProductAdminStore`.

```typescript
// Parameters: none
// Returns:
{
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearSelectedProduct: () => void;   // direct from store (not wrapped)
}
```

All five async actions are individually wrapped in `useCallback`. The `search` parameter from `fetchProducts(page, limit, search)` in the store is **not** surfaced by this hook (hook only passes `page` and `limit`).

---

### `useAdminUsers` — `src/hooks/useAdminUsers.ts`

Thin wrapper around `useUserAdminStore`.

```typescript
// Parameters: none
// Returns:
{
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;
  fetchUsers: (page?: number, limit?: number, search?: string) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;   // direct from store (not wrapped)
  deleteUser: (id: string) => Promise<void>;
  clearSelectedUser: () => void;                     // direct from store (not wrapped)
}
```

`fetchUsers`, `getUserById`, `updateUser`, `deleteUser` are wrapped in `useCallback`. `toggleUserStatus` and `clearSelectedUser` are passed directly from the store.

> **Note:** `updateUserRole` from `useUserAdminStore` is **not** exposed by this hook.

---

## 9. Utility Functions

### `src/lib/utils.ts`

```typescript
cn(...inputs: ClassValue[]): string
  // Merges Tailwind classes via clsx + tailwind-merge
  // Resolves conflicting Tailwind utility classes in favour of the last one
  // Example: cn('p-2 p-4') → 'p-4'

formatPrice(amount: number): string
  // Formats a number as Indian Rupees (INR) with en-IN locale
  // Uses Intl.NumberFormat, maximumFractionDigits: 0
  // Example: formatPrice(52000) → '₹52,000'

formatDate(dateString: string): string
  // Formats an ISO date string using en-IN locale
  // Output format: '08 Mar 2026'
  // Example: formatDate('2026-03-08T12:00:00Z') → '08 Mar 2026'

truncate(str: string, length: number): string
  // Truncates a string to `length` characters, appends '…' if truncated
  // Example: truncate('Hello World', 5) → 'Hello…'
```

> **Note:** `formatPrice` in `lib/utils.ts` is distinct from the inline `formatINR` function that is **copy-pasted** into `DashboardPage.tsx`, `ProductManagementPage.tsx`, `OrderManagementPage.tsx`, and `AnalyticsPage.tsx`. Those inline versions are not imported from `utils.ts`.

---

### `src/lib/api.ts` (not a utility module — see §6)

```typescript
// Exports:
api: AxiosInstance
// Cookie-based Axios instance with X-Request-Id header injection
// and admin:unauthorized event dispatch on 401/403
```

---

### `src/lib/theme.ts`

```typescript
adminDarkTheme: Theme
// MUI dark theme
// primary: #6366F1 (Indigo), secondary: #10B981 (Emerald)
// background.default: #0F172A, background.paper: #1E293B
// Font: Inter, Roboto, Helvetica, Arial
// Button: borderRadius 8, textTransform 'none', fontWeight 600
// Card: borderRadius 12

adminLightTheme: Theme
// MUI light theme — same primary/secondary colours
// background.default: #F8FAFC, background.paper: #FFFFFF
// Same Button/Card overrides
```

---

## 10. Environment & Config

### Environment Variables

| Variable | Default value | Used in |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | `src/api/client.ts`, `src/pages/AdminDashboard.jsx` |
| _(none)_ | `http://localhost:5000/api` | `src/lib/api.ts` has a **different hardcoded fallback** ⚠️ |

Only one env variable exists. Set it in `.env`:
```dotenv
VITE_API_URL=http://localhost:3000/api
```

---

### Vite Config (`vite.config.ts`)

```typescript
plugins:  [@vitejs/plugin-react]

resolve.alias:
  '@'             → src/
  '@api'          → src/api/
  '@components'   → src/components/
  '@pages'        → src/pages/
  '@services'     → src/services/          (directory doesn't exist in admin/)
  '@stores'       → src/stores/
  '@types'        → src/types/
  '@utils'        → src/utils/             (directory doesn't exist in admin/)
  '@ecommerce/shared' → ../shared/types.ts

server:
  port: 5174
  proxy:
    '/api' → http://localhost:3000  (changeOrigin: true, secure: false)

build:
  outDir: dist
  sourcemap: true
  minify: terser
  reportCompressedSize: false
```

---

### TypeScript Config (`tsconfig.json`)

```jsonc
{
  "target": "ES2020",
  "lib": ["ES2020", "DOM", "DOM.Iterable"],
  "module": "ESNext",
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "jsx": "react-jsx",
  "moduleResolution": "bundler",
  "allowImportingTsExtensions": true,
  "resolveJsonModule": true,
  "isolatedModules": true,
  "noEmit": true,
  "baseUrl": ".",
  // paths mirror vite.config.ts aliases
}
```

---

### Prettier Config (`prettier.config.js`)

```javascript
{
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
}
```

---

### Tailwind Config (`tailwind.config.js`)

```javascript
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
theme.extend.colors:
  primary:   '#1f2937'
  secondary: '#3b82f6'
  accent:    '#ec4899'
theme.extend.fontFamily:
  sans: ['Inter', 'system-ui', 'sans-serif']
```

---

### Build Commands

```bash
npm run dev          # vite dev server on :5174
npm run build        # tsc && vite build → dist/
npm run preview      # vite preview (serves dist/)
npm run lint         # eslint .tsx/.ts, max-warnings 0
npm run lint:fix     # eslint --fix
npm run type-check   # tsc --noEmit (no build output)
```

---

## 11. Known Issues / TODOs

### Critical

1. **`index.html` loads `main.jsx`, not `main.tsx`**  
   The entire TSX refactored path (`main.tsx` → `App.tsx` → `AdminLayout` → split stores) is **never executed**. All `.tsx` pages, `AdminLayout`, `AdminRoute`, and the 6 split stores are dead code in production. The active app is the 959-line `AdminDashboard.jsx` with no routing.  
   **Fix:** Change `<script src="/src/main.jsx">` to `/src/main.tsx` in `index.html`.

2. **Double `BrowserRouter`**  
   `main.tsx` wraps content in `<BrowserRouter>` inside `Root`, and `App.tsx` creates another `<BrowserRouter>` internally. This will cause warnings and broken navigation when the TSX path is activated.  
   **Fix:** Remove `<BrowserRouter>` from `App.tsx` — let `main.tsx` own it.

3. **Two conflicting auth stores**  
   - `stores/authStore.ts` uses Bearer tokens from `localStorage` (compatible with `api/client.ts`).  
   - `store/adminAuthStore.ts` uses HTTP-only cookies via `lib/api.ts`.  
   These are incompatible auth mechanisms. `Topbar.tsx` uses `useAuthStore` (localStorage) while `AdminRoute.tsx` uses `useAdminAuthStore` (cookies). Once the TSX path is activated, the app will be split between two auth sessions.  
   **Fix:** Pick one mechanism, delete the other store.

4. **`lib/api.ts` default API URL is `:5000`, `api/client.ts` default is `:3000`**  
   Both read `VITE_API_URL` so in practice they'll be the same if the env var is set, but the mismatch in fallbacks will cause silent bugs in environments where the env var is missing.  
   **Fix:** Align both defaults to `:3000/api` or remove the fallback from one.

---

### Architecture / Maintenance

5. **Monolithic `adminStore.ts` (572 lines) alongside split stores**  
   Both systems exist simultaneously. New `.tsx` pages correctly use the split stores. But `adminStore.ts` is still imported by `stores/index.js` (legacy barrel) and re-exports all the same API surface. Any developer using the legacy JS barrel will get the monolithic store, not the split ones.  
   **Fix:** Delete `adminStore.ts`, `adminStore.js`, and `stores/index.js` once all JSX pages are migrated.

6. **`handleError` duplicated in every split store**  
   The same 6-line `handleError` function is copy-pasted into `productAdminStore.ts`, `orderAdminStore.ts`, and `userAdminStore.ts` (dashboard and audit stores inline the same logic differently).  
   **Fix:** Extract to `src/stores/utils.ts` or `src/lib/storeUtils.ts`.

7. **`DashboardStats` type defined twice with different shapes**  
   - `src/stores/dashboardAdminStore.ts`: has `revenueChange`, `ordersChange`, `usersChange`, `totalProducts`, `salesByCategory[].sales`  
   - `src/types/index.ts`: has `pendingOrders`, `recentOrders: Order[]`, `topProducts: (Product & { sales })`  
   These are incompatible. `DashboardPage.tsx` uses the store version; the `types/` version is never used by any page.

8. **`AuditLog` type defined twice with different shapes**  
   - `src/stores/auditAdminStore.ts`: has `adminId`, `adminEmail`  
   - `src/types/index.ts`: has `userId`, `adminEmail`, `changes: Record<string, unknown>`  
   Pages import the type from `auditAdminStore.ts`. The `types/` definition is unused.

9. **`formatINR` inline function copy-pasted into 4 files**  
   `DashboardPage.tsx`, `ProductManagementPage.tsx`, `OrderManagementPage.tsx`, and `AnalyticsPage.tsx` each define an identical `formatINR` helper.  
   `lib/utils.ts` already has `formatPrice()` which does the same thing.  
   **Fix:** Import `formatPrice` from `@/lib/utils`.

10. **`AdminDashboard.jsx` uses raw `fetch()` bypassing `ApiClient`**  
    The active app makes all API calls via a local `fetch` wrapper that has no interceptors, no token refresh, and no unified error format. Token refresh on 401 does not work in the active app.

---

### Incomplete Features

11. **Sidebar nav items with no registered routes**  
    `/orders`, `/users`, `/analytics`, `/audit-logs` appear in `Sidebar.tsx` but are not registered in `App.tsx`. Clicking them in the TSX path would hit the `*` → `/dashboard` redirect.

12. **`AnalyticsPage.tsx` period selector is non-functional**  
    The period `Select` updates local state and triggers `fetchStats()`, but `fetchStats()` calls `GET /admin/stats` with no period parameter. The backend endpoint does not receive the selected period.

13. **`@radix-ui/*` packages installed but unused in pages**  
    `@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `@radix-ui/react-toast` are all in `dependencies` but no page component imports from them. The MUI Dialog and Select are used instead. The Toast system has no `<ToastProvider>` mounted anywhere.

14. **`profileApi` defined but never called**  
    `src/api/index.ts` exports a `profileApi` object with endpoints for `/profile` and `/profile/addresses`. No page, store, or hook consumes it.

15. **`@services` and `@utils` aliases point to non-existent directories**  
    Both `vite.config.ts` and `tsconfig.json` declare `@services → src/services/` and `@utils → src/utils/`. Neither `src/services/` nor `src/utils/` exists in the admin app. Service classes live in `src/api/services/` instead.

16. **`ErrorBoundary.componentDidCatch` is empty**  
    No error reporting service (Sentry, LogRocket, etc.) is wired up. Production errors are silently swallowed.

17. **`AdminRoute` calls `checkAuth()` and `App.tsx` also calls `checkAuth()`**  
    When a user navigates to a protected route, `checkAuth()` is called twice on mount — once from `App.tsx`'s `useEffect` and once from `AdminRoute`'s `useEffect`.

18. **`App.tsx` has an inline stub `DashboardPage` component**  
    The real `src/pages/DashboardPage.tsx` exists but is not imported by `App.tsx`. Instead, a hardcoded static component with fake INR values (`₹4,52,000`) is rendered at `/dashboard`.

19. **`index.html` title is `"vite-project"`**  
    The page `<title>` was never updated from the Vite scaffold default.

20. **`eslint.config.js` only lints `.ts/.tsx` files**  
    `AdminDashboard.jsx` (the active production file), `App.jsx`, `main.jsx`, `UI.jsx`, and all `*.js` store wrappers are **not linted**. They contain `console.log` calls, `any`-equivalent untyped code, and other patterns that would fail the TypeScript ESLint rules.
