# StepStyle Admin — Complete Design Reference

> Generated from full codebase analysis of `admin/src/`. Use this document to recreate the exact admin UI from scratch.

---

## Table of Contents

1. [Design System Overview](#1-design-system-overview)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Admin Layout Structure](#5-admin-layout-structure)
6. [Sidebar Design](#6-sidebar-design)
7. [Topbar Design](#7-topbar-design)
8. [Table & Data Grid Design](#8-table--data-grid-design)
9. [Dashboard & Analytics Design](#9-dashboard--analytics-design)
10. [Component Design Patterns](#10-component-design-patterns)
11. [Page Layouts](#11-page-layouts)
12. [Responsive Design](#12-responsive-design)
13. [Theming](#13-theming)
14. [Animations & Transitions](#14-animations--transitions)
15. [Forms & Input Design](#15-forms--input-design)
16. [Status Indicators](#16-status-indicators)
17. [Design Inconsistencies](#17-design-inconsistencies)

---

## 1. Design System Overview

The admin panel is a **dual-implementation codebase** — it contains two separate, parallel admin UIs that coexist in the same folder:

| Layer | File | Technology |
|---|---|---|
| **Legacy (v1)** | `App.jsx` → `AdminDashboard.jsx` | Pure Tailwind CSS, tab-based SPA |
| **Modern (v2)** | `main.tsx` → `App.tsx` → `AdminLayout.tsx` + individual page TSX files | MUI v5 + Tailwind CSS hybrid, React Router, Zustand |

The **modern (TypeScript) stack** is the primary intended implementation. Key design decisions:

- **Framework**: Material UI v5 (`@mui/material`, `@mui/x-data-grid`)
- **Theme**: Custom MUI theme defined in `src/lib/theme.ts`, togglable between dark and light via `useUiStore`
- **Default theme on load**: **dark** (read from `localStorage` key `admin-theme`, falls back to `'dark'`)
- **Icons**: `lucide-react` library throughout (icon size consistently `18px` or `20px`)
- **Charts**: `recharts` (LineChart, BarChart, PieChart)
- **Styling approach**: MUI `sx` props for layout/theming + Tailwind utility classes for form internals (especially inside dialogs)
- **Font**: Inter (primary), fallback Roboto → Helvetica → Arial → sans-serif
- **Border radius philosophy**: Consistent rounded-corner system — cards `12px`, buttons `8px`, drawer items `8px`, dialogs `12px`
- **Elevation philosophy**: Flat design — `elevation={0}` on all Cards; borders used instead of shadows

---

## 2. Color Palette

### 2.1 MUI Theme Palette — Dark Mode (`adminDarkTheme`)

| Token | Hex | Usage |
|---|---|---|
| `primary.main` | `#6366F1` | Active nav item bg, avatar bg, primary buttons, progress bars, chart lines |
| `primary.light` | `#818CF8` | Hover states, lighter accents |
| `primary.dark` | `#4338CA` | Active nav item hover, darker primary accents |
| `primary.contrastText` | `#FFFFFF` | Text on primary-colored backgrounds |
| `secondary.main` | `#10B981` | Success/green accents, secondary actions |
| `secondary.light` | `#34D399` | Lighter green accents |
| `secondary.dark` | `#059669` | Darker green accents |
| `secondary.contrastText` | `#FFFFFF` | Text on secondary backgrounds |
| `background.default` | `#0F172A` | Page background (main content area) |
| `background.paper` | `#1E293B` | Card bg, sidebar bg, topbar bg, dropdown paper |
| `divider` | `rgba(255,255,255,0.08)` | All dividers, borders, table borders, sidebar border |
| `text.primary` | (MUI dark default: `#FFFFFF`) | Headings, body text |
| `text.secondary` | (MUI dark default: `rgba(255,255,255,0.7)`) | Captions, labels, secondary text |
| `text.disabled` | (MUI dark default: `rgba(255,255,255,0.5)`) | Footer version text |
| `error.main` | (MUI default: `#f44336`) | Sign Out menu item text |
| `success.main` | (MUI default: `#66bb6a`) | Positive change indicator text |

### 2.2 MUI Theme Palette — Light Mode (`adminLightTheme`)

| Token | Hex | Usage |
|---|---|---|
| `primary.main` | `#6366F1` | Same as dark |
| `primary.light` | `#818CF8` | Same as dark |
| `primary.dark` | `#4338CA` | Same as dark |
| `secondary.main` | `#10B981` | Same as dark |
| `secondary.light` | `#34D399` | Same as dark |
| `secondary.dark` | `#059669` | Same as dark |
| `background.default` | `#F8FAFC` | Page background |
| `background.paper` | `#FFFFFF` | Cards, sidebar, topbar |
| `divider` | (MUI light default: `rgba(0,0,0,0.12)`) | Borders, dividers |

### 2.3 Hardcoded Colors in Pages

These colors are used directly via `sx={{ color/bgcolor: '...' }}` or Tailwind classes, bypassing theme tokens:

| Color | Hex | Usage location |
|---|---|---|
| Indigo 600 | `#4f46e5` | Revenue chart line stroke, bar chart fill, stat card icon bg (Total Revenue) |
| Cyan 600 | `#0891b2` | Stat card icon bg (Total Orders) |
| Green 600 | `#16a34a` | Stat card icon bg (Total Users) |
| Orange 600 | `#ea580c` | Stat card icon bg (Products Listed) |
| Red 600 | `#dc2626` | Chart color[4] |
| Purple 700 | `#7c3aed` | Chart color[5] |

### 2.4 Analytics Chart Color Array

```js
const COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#ea580c', '#dc2626', '#7c3aed'];
```

Used in order for PieChart cells and future chart series.

### 2.5 Tailwind Config Extended Colors (largely unused in modern stack)

```js
// tailwind.config.js
colors: {
  primary: '#1f2937',   // dark gray — conflicts with MUI primary
  secondary: '#3b82f6', // blue
  accent: '#ec4899',    // pink
}
```

### 2.6 CSS Custom Properties in `index.css` (@theme block — client-app bleed)

```css
--color-primary: #f59e0b;          /* amber — NOT used in admin MUI theme */
--color-primary-dark: #d97706;
--color-primary-light: #fbbf24;
--color-dark-900: #0a0a0a;
--color-dark-800: #171717;
--color-dark-700: #262626;
--color-dark-600: #404040;
--color-dark-500: #525252;
--color-light-100: #ffffff;
--color-light-200: #fafafa;
--color-light-300: #f5f5f5;
--color-light-400: #e5e5e5;
--color-light-500: #d4d4d4;
--color-green: #22c55e;
--color-red: #ef4444;
--color-orange: #f97316;
```

> **Note**: These variables were copied from the client app and are not consumed by any admin component. The admin MUI theme is the true source of truth.

### 2.7 Legacy AdminDashboard.jsx Colors (v1 only)

| Usage | Tailwind class | Hex equivalent |
|---|---|---|
| App background | `bg-gray-100` | `#F3F4F6` |
| Sidebar bg | `bg-white` | `#FFFFFF` |
| Sidebar border | `border-gray-200` | `#E5E7EB` |
| Active nav item | `bg-black text-white` | `#000000` / `#FFFFFF` |
| Inactive nav item | `text-gray-700 hover:bg-gray-100` | `#374151` / `#F3F4F6` |
| Card bg | `bg-white border-gray-200` | `#FFFFFF` / `#E5E7EB` |
| Table header | `bg-gray-50` | `#F9FAFB` |
| Row divider | `divide-gray-200` | `#E5E7EB` |
| Row hover | `hover:bg-gray-50` | `#F9FAFB` |
| Page padding bg | `bg-slate-50` (App.tsx DashboardPage stub) | `#F8FAFC` |

### 2.8 Login Page (LoginPage.tsx) Colors

| Element | Tailwind class | Hex |
|---|---|---|
| Page background gradient | `from-slate-900 via-indigo-950 to-slate-900` | `#0F172A` → `#1E1B4B` → `#0F172A` |
| Card bg | `bg-white/5` | `rgba(255,255,255,0.05)` |
| Card border | `border-white/10` | `rgba(255,255,255,0.1)` |
| Input bg | `bg-white/5` | `rgba(255,255,255,0.05)` |
| Input border | `border-white/10` | `rgba(255,255,255,0.1)` |
| Input text | `text-white` | `#FFFFFF` |
| Placeholder | `placeholder-gray-500` | `#6B7280` |
| Focus ring | `focus:ring-indigo-500` | `#6366F1` |
| Submit button | `bg-indigo-600 hover:bg-indigo-700` | `#4F46E5` / `#4338CA` |
| Error box bg | `bg-red-500/10` | `rgba(239,68,68,0.1)` |
| Error box border | `border-red-500/30` | `rgba(239,68,68,0.3)` |
| Error text | `text-red-400` | `#F87171` |
| Label color | `text-gray-300` | `#D1D5DB` |
| Icon color | `text-gray-500` | `#6B7280` |
| Footer disclaimer | `text-gray-600` | `#4B5563` |

### 2.9 ErrorBoundary Colors

| Element | Class | Hex |
|---|---|---|
| Page bg | `bg-slate-900` | `#0F172A` |
| Heading | `text-white` | `#FFFFFF` |
| Body text | `text-slate-400` | `#94A3B8` |
| Reload button | `bg-indigo-600 hover:bg-indigo-700` | `#4F46E5` / `#4338CA` |

---

## 3. Typography

### 3.1 MUI Theme Font Stack

```ts
fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
```

Applied globally via `ThemeProvider` + `CssBaseline`.

### 3.2 MUI Variant Weights

| Variant | fontWeight | Applied via |
|---|---|---|
| `h1` | 700 | theme.typography.h1 |
| `h2` | 700 | theme.typography.h2 |
| `h3` | 600 | theme.typography.h3 |
| `h4` | 600 | theme.typography.h4 |
| `h5` | 700 (overridden via `fontWeight={700}` sx) | Page titles |
| `h6` | 700 (fontWeight={700} sx) | Sidebar brand name |
| `subtitle1` | 700 (fontWeight={700} sx) | Card section headings |
| `subtitle2` | 600 (fontWeight={600} sx) | User dropdown name |
| `body1` | 400 (MUI default) | General text |
| `body2` | varies | Order/product detail rows |
| `caption` | — | Labels, secondary info |

### 3.3 Specific Size Overrides Used in Components

| Component | Property | Value |
|---|---|---|
| Sidebar "ADMIN" badge | `fontSize` | `'0.65rem'` |
| Sidebar nav label | `fontSize` | `'0.875rem'` (14px) |
| Sidebar footer | MUI `caption` | default caption size |
| Stat card title | MUI `caption` | default |
| Stat card value | MUI `h5` | default h5 (~1.5rem) |
| Stat card trend | MUI `caption` | default |
| Dashboard recent orders order number | `variant="body2"` `fontWeight={600}` | default body2 |
| Dashboard recent orders caption | MUI `caption` | default |
| DataGrid cell font | inline `className="font-mono text-sm font-semibold text-indigo-600"` | `0.875rem`, monospace |
| DataGrid order # | `font-mono text-sm font-semibold` | Tailwind mono font |
| Order status Select | `fontSize: '0.8rem'` | 12.8px |
| Order payment Chip | `fontSize: '0.7rem'` | 11.2px |
| Audit log action badge | `text-xs font-bold` | `0.75rem`, 700 |
| Audit log details | `text-xs text-gray-500 truncate` | `0.75rem` |
| Login label | `text-sm font-medium` | `0.875rem`, 500 |
| Login input | `text-sm` | `0.875rem` |
| Form labels (dialogs) | `text-sm font-medium text-gray-700` | `0.875rem`, 500 |

### 3.4 Tailwind Typography (Legacy AdminDashboard.jsx)

| Usage | Classes | Size / Weight |
|---|---|---|
| Page headings | `text-3xl font-bold text-gray-900` | 30px, 700 |
| Section headings | `text-lg font-bold text-gray-900` | 18px, 700 |
| Stat card title | `text-gray-600 text-sm font-medium` | 14px, 500 |
| Stat card value | `text-2xl font-bold text-gray-900` | 24px, 700 |
| Table header | `text-sm font-semibold` | 14px, 600 |
| Table cell | `text-sm text-gray-900` | 14px, 400 |
| Nav button label | implicit body size | default |

### 3.5 CSS Custom Properties for Text Scale (index.css — unused in admin)

```css
--text-heading-1: 72px / line-height: 78px / weight: 700
--text-heading-2: 56px / line-height: 60px / weight: 700
--text-heading-3: 24px / line-height: 30px / weight: 500
--text-lead:      20px / line-height: 28px / weight: 500
--text-body:      16px / line-height: 24px / weight: 400
--text-body-medium: 16px / line-height: 24px / weight: 500
--text-caption:   14px / line-height: 20px / weight: 500
--text-footnote:  12px / line-height: 18px / weight: 400
```

---

## 4. Spacing & Layout

### 4.1 MUI Spacing Scale

MUI default: `1 spacing unit = 8px`.

| `sx` value | Computed px |
|---|---|
| `p: 1` | 8px |
| `p: 1.5` | 12px |
| `p: 2` | 16px |
| `p: 3` | 24px |
| `px: 3` | padding-left/right 24px |
| `py: 2` | padding-top/bottom 16px |
| `gap: 1` | 8px |
| `gap: 1.5` | 12px |
| `gap: 2` | 16px |
| `gap: 3` | 24px |
| `mb: 2` | margin-bottom 16px |
| `mb: 3` | margin-bottom 24px |
| `mb: 4` | margin-bottom 32px |
| `mt: 0.5` | margin-top 4px |
| `mt: 1` | margin-top 8px |
| `px: 0.75` | padding-left/right 6px |
| `py: 0.25` | padding-top/bottom 2px |

### 4.2 Key Dimensional Values

| Element | Value |
|---|---|
| Sidebar / Drawer width | `240px` (`DRAWER_WIDTH = 240`) |
| Topbar height | `64px` (MUI Toolbar `minHeight: '64px !important'`) |
| Main content padding | `p: 3` → `24px` all sides |
| Stat card icon box | `48×48px`, `borderRadius: 2.5` (10px) |
| Logo icon box | `32×32px`, `borderRadius: 1.5` (6px) |
| DataGrid height (Orders, Users, Audit) | `580px` |
| DataGrid height (Products) | `600px` |
| Chart height (Revenue/Trend LineChart) | `280px` |
| Chart height (Pie) | `280px` |
| Chart height (Bar chart) | `220px` |
| Category progress bar height | `6px` |
| User avatar (Topbar) | `34×34px` |
| Product image (DataGrid) | `40×40px`, `rounded-lg`, `object-cover` |
| Product image preview (ImageUploader) | `128×128px` |
| Product image (legacy table) | `48×48px`, `rounded-lg` |
| Scrollbar width | `8px` |

### 4.3 Grid System

All layout grids use MUI `<Grid container spacing={3}>` (24px gap between items).

| Page | Grid columns |
|---|---|
| Dashboard stat cards | `xs=12 sm=6 lg=3` (4 across on large, 2 on medium, 1 on small) |
| Dashboard chart area | `xs=12 md=7` (Recent Orders) + `xs=12 md=5` (Sales by Category) |
| Analytics charts | `xs=12 lg=8` (Line) + `xs=12 lg=4` (Pie), then `xs=12` (Bar) |
| Dialog form grid | `xs=6` (2-column for Price fields) |
| Order detail dialog | `xs=6` (2-column for status/payment/date/total) |

### 4.4 Border Radii

| MUI `sx` value | Computed px | Used on |
|---|---|---|
| `borderRadius: 1` | 4px | "ADMIN" badge |
| `borderRadius: 1.5` | 6px | Logo icon box |
| `borderRadius: 2` | 8px | Buttons, nav items, dialog action buttons, recent order rows, Topbar dropdown |
| `borderRadius: 2.5` | 10px | Stat card icon box |
| `borderRadius: 3` | 12px | Cards, DataGrids, Dialog papers, progress bar tracks |
| Tailwind `rounded-xl` | 12px | Login inputs, form inputs inside dialogs |
| Tailwind `rounded-2xl` | 16px | Login logo box outer |
| Tailwind `rounded-3xl` | 24px | Login card container |
| Tailwind `rounded-lg` | 8px | Legacy AdminDashboard cards, table, product images, modals |
| Tailwind `rounded-full` | 9999px | Status badges in legacy, image remove button |

---

## 5. Admin Layout Structure

**File**: `src/layouts/AdminLayout.tsx`

```
┌─────────────────────────────────────────────────────┐
│  <Box sx={{ display:'flex', minHeight:'100vh' }}>   │
│                                                       │
│  ┌──────────┐  ┌────────────────────────────────┐  │
│  │ Sidebar  │  │ <Box flexGrow=1 flexDirection=  │  │
│  │ 240px    │  │       column minHeight=100vh>   │  │
│  │ permanent│  │                                  │  │
│  │ (desktop)│  │  ┌──────────────────────────┐  │  │
│  │          │  │  │  <Topbar> sticky 64px    │  │  │
│  │          │  │  └──────────────────────────┘  │  │
│  │          │  │                                  │  │
│  │          │  │  ┌──────────────────────────┐  │  │
│  │          │  │  │  <Box component="main"   │  │  │
│  │          │  │  │   sx={{ flexGrow:1,      │  │  │
│  │          │  │  │   p:3,                   │  │  │
│  │          │  │  │   bgcolor:'background.   │  │  │
│  │          │  │  │   default' }}>           │  │  │
│  │          │  │  │   <Outlet />             │  │  │
│  │          │  │  └──────────────────────────┘  │  │
│  └──────────┘  └────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Exact sx props for the outer wrapper:**
```jsx
<Box sx={{ display: 'flex', minHeight: '100vh' }}>
```

**Exact sx props for the main column wrapper:**
```jsx
sx={{
  flexGrow: 1,
  ml: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },   // 240px or 0
  transition: 'margin 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}}
```

**Exact sx props for `<main>`:**
```jsx
sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}
```

**Z-index hierarchy:**
- Topbar AppBar: `theme.zIndex.drawer - 1` (Drawer default is 1200, so Topbar is 1199)
- Sidebar Drawer: MUI default `1200`
- Modal/Dialog: MUI default `1300`

---

## 6. Sidebar Design

**File**: `src/components/admin/Sidebar.tsx`

### 6.1 Dimensions & Structure

- Width: `240px` (injected as `drawerWidth` prop, sourced from `DRAWER_WIDTH = 240` constant in `AdminLayout.tsx`)
- Full height: `height: '100%'`, flex column layout
- Three sections: Logo header, Nav body (flex grows), Footer

### 6.2 MUI Drawer Override (via theme)

```ts
MuiDrawer: {
  styleOverrides: {
    paper: {
      backgroundColor: '#1E293B',          // dark mode only
      borderRight: '1px solid rgba(255,255,255,0.08)',
    },
  },
},
```

### 6.3 Logo / Header Section

```jsx
<Toolbar sx={{
  px: 3,
  borderBottom: '1px solid',
  borderColor: 'divider',
  minHeight: '64px !important',   // matches topbar height exactly
}}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    {/* Shield icon box */}
    <Box sx={{
      width: 32, height: 32,
      bgcolor: 'primary.main',      // #6366F1
      borderRadius: 1.5,            // 6px
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Shield size={18} color="white" />
    </Box>

    {/* Brand name */}
    <Typography variant="h6" fontWeight={700} color="text.primary">
      StepStyle
    </Typography>

    {/* ADMIN badge */}
    <Typography variant="caption" sx={{
      bgcolor: 'primary.main',    // #6366F1
      color: 'white',
      px: 0.75,                   // 6px
      py: 0.25,                   // 2px
      borderRadius: 1,            // 4px
      fontSize: '0.65rem',
      fontWeight: 700,
    }}>
      ADMIN
    </Typography>
  </Box>
</Toolbar>
```

### 6.4 Navigation Items

```jsx
// Nav item list padding
<Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
  <List disablePadding>
    <ListItem disablePadding sx={{ px: 1.5, mb: 0.5 }}>
      <ListItemButton
        component={Link}
        to={path}
        selected={active}
        sx={{
          borderRadius: 2,    // 8px
          py: 1,              // 8px
          px: 1.5,            // 12px
          '&.Mui-selected': {
            bgcolor: 'primary.main',   // #6366F1
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },   // #4338CA
            '& .MuiListItemIcon-root': { color: 'white' },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: active ? 'white' : 'text.secondary' }}>
          <Icon size={18} />
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: '0.875rem',              // 14px
            fontWeight: active ? 600 : 400,
          }}
        />
      </ListItemButton>
    </ListItem>
```

**Nav items list:**

| Label | Path | Icon (lucide-react) |
|---|---|---|
| Dashboard | `/dashboard` | `LayoutDashboard` |
| Products | `/products` | `Package` |
| Orders | `/orders` | `ShoppingBag` |
| Users | `/users` | `Users` |
| Analytics | `/analytics` | `BarChart3` |
| Audit Logs | `/audit-logs` | `ScrollText` |

**Active detection**: `location.pathname === path || location.pathname.startsWith(path + '/')`

### 6.5 Footer Section

```jsx
<>
  <Divider />
  <Box sx={{ p: 2 }}>
    <Typography variant="caption" color="text.disabled" textAlign="center" display="block">
      StepStyle Admin v1.0
    </Typography>
  </Box>
</>
```

### 6.6 Responsive / Collapsed Behavior

**Desktop (md and above):** `variant="permanent"` MUI Drawer

```jsx
sx={{
  display: { xs: 'none', md: 'block' },
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : 0,    // 240 or 0
    overflowX: 'hidden',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease',    // collapse animation
  },
}}
```

When `sidebarOpen = false`: width → `0`, content hidden via `overflowX: hidden`.

**Mobile (xs to sm):** `variant="temporary"` with `open` prop and `ModalProps={{ keepMounted: true }}`

```jsx
sx={{
  display: { xs: 'block', md: 'none' },
  '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
}}
```

Toggle button is the `<MenuIcon size={20}>` in the Topbar's `IconButton`.

---

## 7. Topbar Design

**File**: `src/components/admin/Topbar.tsx`

### 7.1 AppBar Styling

```jsx
<AppBar
  position="sticky"
  elevation={0}
  sx={{
    bgcolor: 'background.paper',          // #1E293B dark / #FFFFFF light
    borderBottom: '1px solid',
    borderColor: 'divider',               // rgba(255,255,255,0.08) dark
    color: 'text.primary',
    zIndex: (theme) => theme.zIndex.drawer - 1,   // 1199
  }}
>
```

### 7.2 Toolbar Contents (left → right)

```
[Hamburger IconButton]  ─── [flex spacer] ─── [Theme Toggle] [User Avatar]
```

1. **Hamburger menu button**
   - `IconButton size="small" edge="start"`
   - `<MenuIcon size={20} />` (lucide-react)
   - Calls `onMenuToggle` → toggles `sidebarOpen` in `AdminLayout`

2. **Flex spacer**: `<Box sx={{ flexGrow: 1 }} />`

3. **Theme toggle button**
   - `IconButton size="small"`
   - Shows `<Sun size={20} />` when dark mode (to switch to light)
   - Shows `<Moon size={20} />` when light mode (to switch to dark)
   - Wrapped in `<Tooltip title="Light mode" / "Dark mode">`
   - Calls `useUiStore().toggleTheme()`

4. **User avatar button**
   - `IconButton size="small"`
   - `<Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.8rem' }}>`
   - Shows first initial of first name + first initial of last name (e.g. "JD"), uppercased
   - Fallback: `'A'`
   - Opens dropdown `<Menu>` on click

### 7.3 User Dropdown Menu

```jsx
<Menu
  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2 } }}
>
  <Box sx={{ px: 2, py: 1.5 }}>
    <Typography variant="subtitle2" fontWeight={600}>{user.firstName} {user.lastName}</Typography>
    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
  </Box>
  <Divider />
  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mt: 0.5 }}>Sign Out</MenuItem>
</Menu>
```

- Opens anchored to avatar, top-right alignment
- Paper: `mt: 1` (8px below avatar), `minWidth: 180px`, `borderRadius: 2` (8px)
- Sign Out text is `error.main` color (MUI red)

---

## 8. Table & Data Grid Design

All management pages (`OrderManagementPage`, `ProductManagementPage`, `UserManagementPage`, `AuditLogsPage`) use `@mui/x-data-grid`.

### 8.1 Common DataGrid Config

```jsx
<Box sx={{ height: 580, width: '100%' }}>   // 600px for Products
  <DataGrid
    rows={data}
    columns={columns}
    loading={isLoading}
    slots={{ toolbar: GridToolbar }}
    slotProps={{ toolbar: { showQuickFilter: true } }}
    pageSizeOptions={[10, 25, 50]}   // [20, 50, 100] for AuditLogs
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,     // 12px
      '& .MuiDataGrid-cell': { alignItems: 'center', display: 'flex' },  // Products only
    }}
    disableRowSelectionOnClick
  />
</Box>
```

### 8.2 Column Definitions per Page

**OrderManagementPage columns:**

| Field | Header | Width | Notes |
|---|---|---|---|
| `orderNumber` | Order # | 140px | `font-mono text-sm font-semibold text-indigo-600` (Tailwind) |
| `createdAt` | Date | 130px | Formatted `dd MMM yyyy` |
| `total` | Total | 120px | Formatted as INR |
| `status` | Status | 180px | Inline `<Select>` with `fontSize:'0.8rem'`, `minWidth:150` |
| `payment` | Payment | 120px | `<Chip>` success if COMPLETED, else default, `fontSize:'0.7rem'` |
| `actions` | (empty) | 60px | `<Eye size={15}>` IconButton |

**ProductManagementPage columns:**

| Field | Header | Width | Notes |
|---|---|---|---|
| `image` | (empty) | 64px | `<img>` 40×40 rounded-lg object-cover |
| `name` | Product Name | flex 1.5, min 180px | Plain text |
| `category` | Category | 130px | `row.category?.name ?? '—'` |
| `basePrice` | Price | 110px | INR formatted |
| `discountPrice` | Sale Price | 120px | INR or `'—'` |
| `inStock` | Stock | 100px | `<Chip>` success=In Stock, error=Out of Stock |
| `actions` | Actions | 100px | Edit (Pencil 15px) + Delete (Trash2 15px, color="error") |

**UserManagementPage columns:**

| Field | Header | Width | Notes |
|---|---|---|---|
| `name` | Name | flex 1, min 160px | `firstName + ' ' + lastName` |
| `email` | Email | flex 1.5, min 200px | Plain text |
| `role` | Role | 170px | Inline `<Select>` with roles, `fontSize:'0.8rem'`, `minWidth:145` |
| `isActive` | Active | 90px | `<Switch>` size="small" color="success" |
| `createdAt` | Joined | 130px | Formatted date |
| `status` | Status | 110px | `<Chip>` success=Active, default=Inactive, `fontSize:'0.7rem'` |

**AuditLogsPage columns:**

| Field | Header | Width | Notes |
|---|---|---|---|
| `createdAt` | Time | 170px | Full datetime `dd MMM yyyy HH:MM` |
| `adminEmail` | Admin | flex 1, min 180px | Plain text |
| `action` | Action | 130px | Colored badge span (see §16) |
| `resource` | Resource | 130px | Plain text |
| `resourceId` | Resource ID | flex 1, min 160px | Plain text |
| `details` | Details | flex 1.5, min 200px | `text-xs text-gray-500 truncate` |
| `ipAddress` | IP | 130px | Plain text |

### 8.3 Page Header Pattern (consistent across all DataGrid pages)

```jsx
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
  <Typography variant="h5" fontWeight={700}>{Page Title}</Typography>
  <Box sx={{ display: 'flex', gap: 1.5 }}>
    {/* optional: filter controls */}
    <Tooltip title="Refresh">
      <IconButton onClick={handleRefresh} size="small">
        <RefreshCw size={18} />
      </IconButton>
    </Tooltip>
    {/* optional: primary action button */}
  </Box>
</Box>
```

### 8.4 Legacy AdminDashboard.jsx Tables (v1 only)

```html
<!-- Table container -->
<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
  <table class="w-full">
    <thead class="bg-gray-50 border-b border-gray-200">
      <tr>
        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">...</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 text-sm text-gray-900">...</td>
      </tr>
    </tbody>
  </table>
</div>
```

- No built-in pagination (loads limit=50 at once)
- Sorting: none (no visual sort indicators)
- Row hover: `hover:bg-gray-50` → `#F9FAFB`

---

## 9. Dashboard & Analytics Design

### 9.1 DashboardPage Layout (v2 TypeScript)

**File**: `src/pages/DashboardPage.tsx`

```
┌──────────────────────────────────────────────────┐
│ Typography h5 fontWeight=700 "Dashboard Overview" │
│ mb: 3                                             │
├──────────────────────────────────────────────────┤
│ Grid container spacing=3 mb=4                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│  │Stat Card │ │Stat Card │ │Stat Card │ │Stat  ││
│  │Revenue   │ │Orders    │ │Users     │ │Prods ││
│  └──────────┘ └──────────┘ └──────────┘ └──────┘│
├──────────────────────────────────────────────────┤
│ Revenue Over Time LineChart (height 280px) mb=4   │
├──────────────────────────────────────────────────┤
│ Grid spacing=3                                    │
│  ┌──────────────────────┐ ┌───────────────────┐  │
│  │ Recent Orders (md=7) │ │ Sales by Category │  │
│  │                      │ │ (md=5)            │  │
│  └──────────────────────┘ └───────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 9.2 StatCard Component

```jsx
<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
  <CardContent sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      {/* Left: title + value + trend */}
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <TrendingUp|TrendingDown size={14} />      {/* Tailwind class-colored */}
          <Typography variant="caption" sx={{ color: 'success.main'|'error.main', fontWeight: 600 }}>
            {change}% vs last month
          </Typography>
        </Box>
      </Box>
      {/* Right: icon box */}
      <Box sx={{
        width: 48, height: 48,
        bgcolor: color,           // hardcoded hex per card
        borderRadius: 2.5,        // 10px
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.9,
      }}>
        {icon}   {/* Lucide icon size={22} color="white" */}
      </Box>
    </Box>
  </CardContent>
</Card>
```

**Stat card icon box colors:**

| Card | Icon | Color |
|---|---|---|
| Total Revenue | `DollarSign` | `#4f46e5` |
| Total Orders | `ShoppingBag` | `#0891b2` |
| Total Users | `Users` | `#16a34a` |
| Products Listed | `Package` | `#ea580c` |

### 9.3 Revenue Chart

```jsx
<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
  <CardContent sx={{ p: 3 }}>
    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>Revenue Over Time</Typography>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={stats.revenueOverTime}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip formatter={(v) => [formatINR(v), 'Revenue']} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#4f46e5"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

### 9.4 Recent Orders Card

- Card: `elevation={0}`, `border: '1px solid'`, `borderColor: 'divider'`, `borderRadius: 3`
- Each row: `p: 1.5`, `borderRadius: 2`, `'&:hover': { bgcolor: 'grey.50' }`
- Order number: `variant="body2" fontWeight={600}`
- Customer + date caption: `variant="caption" color="text.secondary"`
- Amount: `variant="body2" fontWeight={600}`
- Status chip: `size="small"`, `fontSize: '0.65rem'`, `fontWeight: 700`
  - DELIVERED → `color="success"`, CANCELLED → `color="error"`, others → `color="default"`

### 9.5 Sales by Category Card

```jsx
{/* Category bar */}
<Box sx={{ mb: 2 }}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
    <Typography variant="caption" fontWeight={500}>{category}</Typography>
    <Typography variant="caption" color="text.secondary">{pct}%</Typography>
  </Box>
  <Box sx={{ height: 6, bgcolor: 'grey.100', borderRadius: 3, overflow: 'hidden' }}>
    <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: 'primary.main', borderRadius: 3 }} />
  </Box>
</Box>
```

### 9.6 Skeleton Loading State

```jsx
<Skeleton variant="text" height={40} width="30%" sx={{ mb: 3 }} />
<Grid container spacing={3} sx={{ mb: 4 }}>
  {Array.from({ length: 4 }).map((_, i) => (
    <Grid item xs={12} sm={6} lg={3} key={i}>
      <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
    </Grid>
  ))}
</Grid>
<Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
```

### 9.7 AnalyticsPage Charts

**File**: `src/pages/AnalyticsPage.tsx`

```
┌───────────────────────────────────────────────────────┐
│ h5 "Analytics"        [Period Select: 7d/30d/90d/1y]  │
├───────────────────────────────────────────────────────┤
│ Grid spacing=3                                        │
│  ┌────────────────────────────┐ ┌──────────────────┐  │
│  │ Revenue Trend LineChart    │ │ Sales by Category│  │
│  │ (lg=8, height 280px)      │ │ PieChart         │  │
│  │                            │ │ (lg=4, h 280px)  │  │
│  └────────────────────────────┘ └──────────────────┘  │
│  ┌────────────────────────────────────────────────┐   │
│  │ Orders Over Time BarChart (xs=12, height 220px)│   │
│  └────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

**Revenue Trend LineChart** (identical to dashboard):
- `stroke="#4f46e5"`, `strokeWidth={2.5}`, `dot={false}`
- Grid: `strokeDasharray="3 3" stroke="#f0f0f0"`
- Tick fontSize: `11` (slightly smaller than dashboard's `12`)

**Sales by Category PieChart:**
```jsx
<PieChart>
  <Pie
    data={stats.salesByCategory}
    dataKey="sales"
    nameKey="category"
    cx="50%" cy="50%"
    outerRadius={100}
    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
    labelLine={false}
  >
    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
  </Pie>
  <Tooltip formatter={(v) => [v.toLocaleString('en-IN'), 'Units']} />
</PieChart>
```

**Orders Over Time BarChart:**
```jsx
<BarChart data={stats.revenueOverTime}>
  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
  <YAxis tick={{ fontSize: 11 }} />
  <Tooltip />
  <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
</BarChart>
```

Note: bar top corners are rounded `4px`, bottom corners are square `0px`.

---

## 10. Component Design Patterns

**File**: `src/components/UI.jsx`

All components are thin wrappers around MUI primitives:

### 10.1 `Button`

```jsx
export const Button = React.forwardRef(({ children, ...props }, ref) => (
  <MuiButton ref={ref} variant="contained" {...props}>
    {children}
  </MuiButton>
));
```

- Default variant: `contained`
- Theme override: `borderRadius: 8px`, `textTransform: 'none'`, `fontWeight: 600`
- Color: depends on `color` prop (default MUI primary = `#6366F1`)
- States: MUI handles hover (darken), active (ripple), disabled (opacity reduced)
- All `sx` overrides must be passed via props

**Usage patterns in pages:**
```jsx
// Primary action
<Button variant="contained" startIcon={<Plus size={18} />} sx={{ borderRadius: 2, textTransform: 'none' }}>
  Add Product
</Button>

// Neutral (no variant="contained" override needed — uses theme default)
<Button onClick={handleClose} sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>

// Danger
<Button color="error" variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }}>Delete</Button>
```

### 10.2 `Input`

```jsx
export const Input = React.forwardRef(({ ...props }, ref) => (
  <TextField ref={ref} variant="outlined" size="small" {...props} />
));
```

- Variant: `outlined`
- Size: `small` (height ~36px)
- All styling inherits MUI TextField
- Used in `App.jsx` login page form

### 10.3 `Alert`

```jsx
export const Alert = ({ children, ...props }) => <MuiAlert {...props}>{children}</MuiAlert>;
```

- Pass-through to MUI Alert
- Used with `severity="error"` in login form
- Renders as colored banner with icon

### 10.4 `Spinner`

```jsx
export const Spinner = ({ size = 40 }) => <CircularProgress size={size} />;
```

- Default size: 40px
- MUI CircularProgress with MUI primary color

### 10.5 `Modal`

```jsx
export const Modal = ({ open, onClose, children, ...props }) => (
  <Dialog open={open} onClose={onClose} {...props}>
    {children}
  </Dialog>
);
```

- Pass-through to MUI Dialog
- No default styling applied (consumers add `PaperProps`)

### 10.6 `Select`

```jsx
export const Select = ({ children, ...props }) => (
  <MuiSelect variant="outlined" size="small" {...props}>
    {children}
  </MuiSelect>
);
```

- Variant: `outlined`, size: `small`

### 10.7 `Textarea`

```jsx
export const Textarea = React.forwardRef(({ ...props }, ref) => (
  <TextareaAutosize ref={ref} style={{ fontFamily: 'inherit' }} {...props} />
));
```

- MUI `TextareaAutosize` with `fontFamily: 'inherit'` to match body font

---

## 11. Page Layouts

### 11.1 LoginPage (v2 TypeScript)

**File**: `src/pages/LoginPage.tsx` (rendered by `App.tsx` route `/login`)

```
Full viewport: min-h-screen
Background: gradient from-slate-900 via-indigo-950 to-slate-900
flex items-center justify-center p-4

  ┌─────────────────────────────────────────┐
  │       w-full max-w-md                   │
  │                                         │
  │  Logo (center):                         │
  │   w-16 h-16 bg-indigo-600 rounded-2xl  │
  │   Lock icon w-8 h-8 text-white         │
  │   "Admin Portal" (h5 white fontWeight700│
  │   "Restricted to Administrators only"   │
  │   (body2 grey.400)                      │
  │  mb-8                                   │
  │                                         │
  │  ┌───────────────────────────────────┐  │
  │  │ bg-white/5 backdrop-blur-xl       │  │
  │  │ border border-white/10            │  │
  │  │ rounded-3xl p-8                   │  │
  │  │                                   │  │
  │  │  [Error banner if error]          │  │
  │  │                                   │  │
  │  │  Email Address field              │  │
  │  │  Password field (with eye toggle) │  │
  │  │                                   │  │
  │  │  [Sign in to Admin] button        │  │
  │  └───────────────────────────────────┘  │
  │                                         │
  │  "Unauthorized access..." (xs grey.600) │
  └─────────────────────────────────────────┘
```

### 11.2 DashboardPage (v2)

**File**: `src/pages/DashboardPage.tsx`

Full-width page, `p: 3` from AdminLayout main box.

- Title: `Typography h5 fontWeight=700 mb=3`
- 4-column stat cards grid
- Full-width revenue chart
- 7/5 split recent orders + category bars

### 11.3 OrderManagementPage

**File**: `src/pages/OrderManagementPage.tsx`

```
Title "Order Management" + [Filter Status Select + Refresh button]
─────────────────────────────────────────────────────────────────
DataGrid height=580px (with GridToolbar + quick filter)
─────────────────────────────────────────────────────────────────
[Order Detail Dialog — triggered by Eye icon]
```

Order Detail Dialog structure:
```
DialogTitle "Order #{orderNumber}" fontWeight=700
DialogContent dividers
  Grid 2-col: Status (Chip) | Payment
  Grid 2-col: Date | Total (fontWeight=700)
  <Divider>
  Items list: product × qty     price
  <Divider>
  Shipping address text
DialogActions p=2
  [Close button]
```

### 11.4 ProductManagementPage

**File**: `src/pages/ProductManagementPage.tsx`

```
Title "Product Management" + [Refresh + Add Product button]
──────────────────────────────────────────────────────────
DataGrid height=600px
──────────────────────────────────────────────────────────
[Create/Edit Dialog]
[Delete Confirm Dialog]
```

Create/Edit Dialog:
```
DialogTitle (Edit Product / Add New Product) fontWeight=700
DialogContent dividers
  form id="product-form"
    Product Name input
    Image URL input
    Description textarea (rows=3)
    Base Price / Sale Price (2-col grid)
    In Stock checkbox
DialogActions p=2 gap=1
  [Cancel] [Create Product / Save Changes]
```

Delete Confirm Dialog:
```
DialogTitle "Delete Product?" fontWeight=700
DialogContent
  Typography body2 color="text.secondary" (explanation text)
DialogActions p=2 gap=1
  [Cancel] [Delete (error color, contained)]
```

### 11.5 UserManagementPage

**File**: `src/pages/UserManagementPage.tsx`

```
Title "User Management" + [Refresh button]
──────────────────────────────────────────
DataGrid height=580px
```

No dialogs — all actions (role change, toggle active) happen inline in DataGrid cells.

### 11.6 AnalyticsPage

**File**: `src/pages/AnalyticsPage.tsx`

```
Title "Analytics" + [Period Select: 7d / 30d / 90d / 1y]
─────────────────────────────────────────────────────────
Grid lg=8: Revenue Trend LineChart
Grid lg=4: Sales by Category PieChart
Grid xs=12: Orders Over Time BarChart
```

### 11.7 AuditLogsPage

**File**: `src/pages/AuditLogsPage.tsx`

```
Title "Audit Logs" + [Search TextField + Refresh button]
────────────────────────────────────────────────────────
DataGrid height=580px pageSizeOptions=[20,50,100]
```

Search field: `size="small"`, `InputProps.startAdornment = <Search size={14}>`, `InputProps.sx.borderRadius=2`

### 11.8 AdminDashboard.jsx — Legacy Tab Layout (v1)

**File**: `src/pages/AdminDashboard.jsx`

```
h-screen flex bg-gray-100

┌──────────────────────────────────────────────────────┐
│ ┌───────────────────┐  ┌────────────────────────┐   │
│ │ w-64 bg-white     │  │ flex-1 overflow-auto    │   │
│ │ border-r          │  │                         │   │
│ │                   │  │  [DashboardTab]         │   │
│ │ Logo: p-6 border-b│  │  [UserManagementTab]    │   │
│ │  "Admin"          │  │  [ProductManagementTab] │   │
│ │  text-2xl bold    │  │  [OrderManagementTab]   │   │
│ │                   │  │  [AnalyticsTab]         │   │
│ │ Nav: p-4 space-y-2│  │                         │   │
│ │ (NavButton items) │  │  (all rendered as p-8   │   │
│ │                   │  │   padding sections)     │   │
│ │ Logout: p-4       │  │                         │   │
│ │  border-t         │  │                         │   │
│ └───────────────────┘  └────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## 12. Responsive Design

### 12.1 Breakpoints (MUI defaults)

| Breakpoint | Min-width |
|---|---|
| `xs` | 0px |
| `sm` | 600px |
| `md` | 900px |
| `lg` | 1200px |
| `xl` | 1536px |

### 12.2 Sidebar Behavior

| Viewport | Behavior |
|---|---|
| `< 900px` (xs, sm) | `variant="temporary"` overlay drawer. Hidden by default. Opens via hamburger. |
| `≥ 900px` (md, lg, xl) | `variant="permanent"` sidebar. Width `240px` when open, `0px` when closed. |

### 12.3 Main Content Margin

```jsx
ml: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 }
// xs/sm: no margin (sidebar is overlay, not permanent)
// md+: 240px margin left when sidebar open, 0 when collapsed
```

### 12.4 Grid Column Responsiveness

| Grid | xs | sm | md | lg |
|---|---|---|---|---|
| Dashboard stat cards | 12 (1 col) | 6 (2 cols) | 6 (2 cols) | 3 (4 cols) |
| Dashboard charts bottom | 12 | 12 | 7 + 5 | 7 + 5 |
| Analytics top row | 12 | 12 | 12 | 8 + 4 |

### 12.5 Legacy AdminDashboard.jsx Responsiveness

- Sidebar: always visible, always `w-64` — **no mobile adaptation**
- Dashboard stats: `grid-cols-4 gap-6` — **not responsive** on mobile
- Analytics summary: `grid-cols-3 gap-6` — **not responsive**
- Product modal: `fixed inset-0 z-50 flex items-center justify-center bg-black/40`, modal `w-full max-w-lg`

---

## 13. Theming

### 13.1 Theme Entry Point

**File**: `src/main.tsx`

```tsx
const Root: React.FC = () => {
  const { themeMode } = useUiStore();
  return (
    <ThemeProvider theme={themeMode === 'dark' ? adminDarkTheme : adminLightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};
```

Theme is reactive — changing `themeMode` in the store re-renders the `Root` component and swaps the theme.

### 13.2 Theme Persistence

**File**: `src/stores/uiStore.ts`

- Stored in `localStorage` under key `admin-theme`
- Default value if not set: `'dark'`
- Toggle via topbar Sun/Moon button

### 13.3 All Theme Tokens Defined

**Dark theme (`adminDarkTheme`)**:

```ts
createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366F1', light: '#818CF8', dark: '#4338CA', contrastText: '#fff' },
    secondary: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#fff' },
    background: { default: '#0F172A', paper: '#1E293B' },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundImage: 'none' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#1E293B', borderRight: '1px solid rgba(255,255,255,0.08)' },
      },
    },
  },
});
```

**Light theme (`adminLightTheme`)** — does NOT override MuiDrawer or MuiCard `backgroundImage`:

```ts
createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366F1', light: '#818CF8', dark: '#4338CA', contrastText: '#fff' },
    secondary: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#fff' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    // divider: MUI light default = rgba(0,0,0,0.12)
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    // MuiDrawer NOT overridden — uses MUI light defaults (white bg)
  },
});
```

### 13.4 CssBaseline Effects

MUI `CssBaseline` (injected in `main.tsx`) resets browser defaults and applies:
- `box-sizing: border-box`
- `body { margin: 0; background: background.default; color: text.primary }`
- Font stack applied to `body`

---

## 14. Animations & Transitions

### 14.1 MUI Component Transitions

| Component | Property | Value | Notes |
|---|---|---|---|
| Sidebar (desktop) | `transition: 'width 0.3s ease'` | 300ms ease | On open/close toggle |
| Main content margin | `transition: 'margin 0.3s ease'` | 300ms ease | Matches sidebar |
| Topbar button hover | MUI default ripple | `~300ms` | All IconButtons |
| User dropdown Menu | MUI default fade | ~200ms | Menu open/close |
| Dialog | MUI default fade+scale | ~225ms | Dialog open/close |
| DataGrid loading | MUI LinearProgress | default | Skeleton overlay |

### 14.2 CSS Keyframe Animations (index.css)

These are defined but **not actively applied to any admin component in code**. They exist because `index.css` was shared/copied from the client app.

```css
@keyframes fade-in        { from: opacity 0; to: opacity 1 }             /* 0.5s ease-out */
@keyframes slide-up       { from: opacity 0 + translateY(20px); to: visible }  /* 0.5s ease-out */
@keyframes slide-down     { from: opacity 0 + translateY(-10px); to: visible } /* 0.3s ease-out */
@keyframes scale-in       { from: opacity 0 + scale(0.95); to: visible }  /* 0.3s ease-out */
@keyframes bounce-in      { 0% scale(0.3) → 50% scale(1.05) → 70% scale(0.9) → 100% scale(1) }
@keyframes float          { 0%/100% translateY(0) → 50% translateY(-10px) } /* 3s ease-in-out infinite */
@keyframes pulse-glow     { box-shadow amber glow pulse }                  /* 2s infinite */
@keyframes slide-in-right { from translateX(100%) → to visible }           /* 0.3s ease-out */
@keyframes slide-in-left  { from translateX(-100%) → to visible }          /* 0.3s ease-out */
@keyframes shimmer        { background-position 200% sweep }               /* 1.5s infinite */
```

### 14.3 Utility Classes Available (index.css)

```css
.animate-fade-in       /* 0.5s */
.animate-slide-up      /* 0.5s */
.animate-slide-down    /* 0.3s */
.animate-scale-in      /* 0.3s */
.animate-bounce-in     /* 0.5s */
.animate-float         /* 3s infinite */
.animate-pulse-glow    /* 2s infinite */
.animate-slide-in-right /* 0.3s */
.animate-slide-in-left  /* 0.3s */
.animate-shimmer        /* shimmer skeleton, 1.5s infinite */

/* Stagger delays */
.stagger-1  { animation-delay: 0.1s }
.stagger-2  { animation-delay: 0.2s }
.stagger-3  { animation-delay: 0.3s }
.stagger-4  { animation-delay: 0.4s }
.stagger-5  { animation-delay: 0.5s }
```

### 14.4 Login Page Transitions

```jsx
// Submit button active scale
className="... active:scale-[0.98] transition-all ..."

// Submit button disabled state
className="... disabled:opacity-70 ..."

// Password toggle button
className="... hover:text-gray-300"  // color transition on hover
```

### 14.5 Tailwind Config Transition Tokens

Not explicitly extended — uses Tailwind defaults:
- `transition-all`: `transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1)`
- `transition-colors`: color-related props 150ms

---

## 15. Forms & Input Design

### 15.1 Login Form (LoginPage.tsx — v2 dark glassmorphism style)

All inputs use raw `<input>` HTML elements styled with Tailwind:

```html
<!-- Base input -->
<input class="
  w-full pl-10 pr-4 py-3
  bg-white/5 border border-white/10
  rounded-xl text-white placeholder-gray-500 text-sm
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
" />

<!-- With left icon: Mail or Lock at left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 -->
<!-- With right eye-toggle button: right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 -->
```

**Label style:**
```html
<label class="block text-sm font-medium text-gray-300 mb-1.5">...</label>
```

**Validation error:**
```html
<p class="mt-1 text-xs text-red-400">{error message}</p>
```

**Error banner (at top of form):**
```html
<div class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
  {error.message}
</div>
```

**Submit button:**
```html
<button class="
  w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl
  hover:bg-indigo-700 active:scale-[0.98] transition-all
  disabled:opacity-70 flex items-center justify-center gap-2
">
```

### 15.2 Login Form (App.jsx — v1 light card style)

Uses MUI `<Input>` (TextField outlined small) via the shared UI component:

```jsx
<Input label="Email Address" type="email" variant="outlined" size="small" />
<Input label="Password" type="password" />
<Button type="submit" fullWidth disabled={isLoading} variant="contained" />
```

Card container: `bg-white rounded-lg shadow-2xl p-8`, max-w-md

### 15.3 Product Form (inside Dialog)

Mixed Tailwind inputs inside a MUI Dialog:

```html
<!-- Text input / number input -->
<input class="
  w-full px-3 py-2.5
  border border-gray-300 rounded-xl text-sm
  focus:outline-none focus:ring-2 focus:ring-indigo-500
" />

<!-- Textarea -->
<textarea class="
  w-full px-3 py-2.5
  border border-gray-300 rounded-xl text-sm
  focus:outline-none focus:ring-2 focus:ring-indigo-500
" rows="3" />

<!-- Checkbox -->
<input type="checkbox" class="rounded" />
```

**Label style:**
```html
<label class="block text-sm font-medium text-gray-700 mb-1">...</label>
```

**Validation error:**
```html
<p class="mt-1 text-xs text-red-600">{error message}</p>
```

Note: error text is `text-red-600` (darker) inside light dialogs vs `text-red-400` (lighter) in dark login.

### 15.4 Filter Controls in Page Headers

Using MUI components directly (not from UI.jsx):
```jsx
<FormControl size="small" sx={{ minWidth: 150 }}>
  <InputLabel>Filter Status</InputLabel>
  <Select value={filterStatus} label="Filter Status">
    <MenuItem value="">All</MenuItem>
    {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
  </Select>
</FormControl>
```

### 15.5 Audit Logs Search Field

```jsx
<TextField
  size="small"
  placeholder="Search logs…"
  InputProps={{
    startAdornment: <Search size={14} className="mr-1 text-gray-400" />,
    sx: { borderRadius: 2 },
  }}
/>
```

### 15.6 Legacy AdminDashboard.jsx Forms

```html
<!-- Standard input -->
<input class="
  w-full px-3 py-2 border border-gray-300
  rounded-lg text-sm
  focus:outline-none focus:ring-2 focus:ring-blue-500
" />

<!-- Textarea -->
<textarea class="
  w-full px-3 py-2 border border-gray-300
  rounded-lg text-sm
  focus:ring-2 focus:ring-blue-500 focus:outline-none
" />

<!-- Select dropdown -->
<select class="
  w-full px-3 py-2 border border-gray-300
  rounded-lg text-sm
  focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white
" />
```

Focus ring: `ring-blue-500` (`#3B82F6`) — different from v2's `ring-indigo-500` (`#6366F1`).

### 15.7 Image Uploader (legacy AdminDashboard.jsx)

```
┌────────────────────────────────────────────────────┐
│  [Preview image if set: w-32 h-32 rounded-lg]       │
│  [×] remove button (absolute -top-2 -right-2)       │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ flex flex-col items-center justify-center     │   │
│  │ border-2 border-dashed border-gray-300        │   │
│  │ rounded-lg cursor-pointer                     │   │
│  │ hover:border-blue-400 hover:bg-blue-50        │   │
│  │ transition-colors                             │   │
│  │                                               │   │
│  │  Upload icon (gray.400)                       │   │
│  │  "Click to upload or drag & drop"             │   │
│  │  "PNG, JPG, WEBP, AVIF up to 5MB"            │   │
│  └──────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

---

## 16. Status Indicators

### 16.1 Order Status — MUI Chip Colors

**Defined in `OrderManagementPage.tsx`:**

```ts
const STATUS_COLOR: Record<OrderStatus, MuiChipColor> = {
  PENDING:    'warning',   // MUI amber/orange
  PROCESSING: 'info',      // MUI light blue
  SHIPPED:    'primary',   // #6366F1 (indigo)
  DELIVERED:  'success',   // MUI green
  CANCELLED:  'error',     // MUI red
  RETURNED:   'default',   // MUI gray
};
```

Used as `<Chip color={STATUS_COLOR[status]} size="small" />` in the order detail dialog.

The inline status `<Select>` in the DataGrid row uses no chip — it's a dropdown for editing.

### 16.2 Order Status — Legacy AdminDashboard.jsx Badge

```ts
const statusColors = {
  PENDING:    'yellow',   // bg-yellow-100 text-yellow-800
  PROCESSING: 'blue',     // bg-blue-100   text-blue-800
  SHIPPED:    'purple',   // bg-purple-100 text-purple-800
  DELIVERED:  'green',    // bg-green-100  text-green-800
  CANCELLED:  'red',      // bg-red-100    text-red-800
};
```

Rendered as `<span class="px-2.5 py-1 rounded-full text-xs font-medium {color}">`.

### 16.3 Dashboard Recent Orders Chip

```ts
color={
  order.status === 'DELIVERED' ? 'success' :
  order.status === 'CANCELLED' ? 'error' :
  'default'
}
```

Size: `small`, `fontSize: '0.65rem'`, `fontWeight: 700`

### 16.4 User Status

In `UserManagementPage.tsx` DataGrid:
- **Active column**: `<Switch checked={row.isActive} size="small" color="success">` — green toggle
- **Status column**: `<Chip label={isActive ? 'Active' : 'Inactive'} color={isActive ? 'success' : 'default'} size="small" sx={{ fontSize: '0.7rem' }}>`

In `AdminDashboard.jsx` (v1):
- `<Badge color={isActive ? 'green' : 'red'}>`
- Classes: Active = `bg-green-100 text-green-800`, Inactive = `bg-red-100 text-red-800`

### 16.5 User Role

In `UserManagementPage.tsx`: inline `<Select>` for editing, no visual chip
In `AdminDashboard.jsx` (v1): `<Badge color={role === 'ADMIN' ? 'purple' : 'gray'}>`

### 16.6 Product Stock Status

In `ProductManagementPage.tsx`:
```jsx
<Chip
  label={inStock ? 'In Stock' : 'Out of Stock'}
  color={inStock ? 'success' : 'error'}
  size="small"
/>
```

In `AdminDashboard.jsx` (v1):
```jsx
<Badge color={product.isActive ? 'green' : 'red'}>
  {product.isActive ? 'Active' : 'Inactive'}
</Badge>
```

(Note: the legacy uses `isActive`, the v2 uses `inStock` — different fields)

### 16.7 Payment Status

In `OrderManagementPage.tsx`:
```jsx
<Chip
  label={row.payment?.status ?? 'N/A'}
  color={row.payment?.status === 'COMPLETED' ? 'success' : 'default'}
  size="small"
  sx={{ fontSize: '0.7rem' }}
/>
```

### 16.8 Audit Log Action Badges

**File**: `src/pages/AuditLogsPage.tsx` — raw HTML `<span>` with Tailwind:

```tsx
<span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
  value === 'DELETE' ? 'bg-red-100 text-red-700'   :
  value === 'CREATE' ? 'bg-green-100 text-green-700':
  value === 'UPDATE' ? 'bg-blue-100 text-blue-700'  :
                       'bg-gray-100 text-gray-700'
}`}>
  {value}
</span>
```

| Action | Background | Text |
|---|---|---|
| DELETE | `bg-red-100` (#FEE2E2) | `text-red-700` (#B91C1C) |
| CREATE | `bg-green-100` (#DCFCE7) | `text-green-700` (#15803D) |
| UPDATE | `bg-blue-100` (#DBEAFE) | `text-blue-700` (#1D4ED8) |
| other | `bg-gray-100` (#F3F4F6) | `text-gray-700` (#374151) |

### 16.9 Order # Monospace Styling

```tsx
<span className="font-mono text-sm font-semibold text-indigo-600">{value}</span>
```

Color: `text-indigo-600` = `#4F46E5`

---

## 17. Design Inconsistencies

The codebase contains significant design inconsistencies across the two admin implementations and even within the modern stack.

### 17.1 Two Parallel Admin Implementations

| Aspect | Legacy (`App.jsx` + `AdminDashboard.jsx`) | Modern (`main.tsx` + TSX pages) |
|---|---|---|
| Entry point | `App.jsx` (imported in `main.jsx`) | `App.tsx` (imported in `main.tsx`) |
| Both `main.jsx` and `main.tsx` exist | `main.jsx` mounts `App.jsx` | `main.tsx` mounts `App.tsx` |
| Layout | Tab-based single page, no URL routing | React Router with nested routes |
| Sidebar bg | `bg-white` (white) | `#1E293B` (dark slate) |
| Active nav color | `bg-black text-white` | `bg-primary.main` (#6366F1 indigo) |
| Tables | Plain HTML `<table>` | MUI X DataGrid |
| Charts | None (text list only) | Recharts |
| Theme support | None (hardcoded light) | Dark + Light toggle |
| Form validation | None (browser native) | Zod + react-hook-form |

### 17.2 Login Page Styles Conflict

Two login pages exist with opposite visual designs:

| Property | App.jsx Login | LoginPage.tsx |
|---|---|---|
| Background | `from-gray-900 to-gray-800` | `from-slate-900 via-indigo-950 to-slate-900` |
| Card style | White opaque (`bg-white`) | Glassmorphism (`bg-white/5 backdrop-blur-xl`) |
| Card shape | `rounded-lg` (8px) | `rounded-3xl` (24px) |
| Input type | MUI `TextField` | Raw `<input>` HTML |
| Input style | MUI outlined small | Dark glass `bg-white/5 border-white/10` |
| Focus ring | MUI default (indigo) | `focus:ring-indigo-500` (same color, different impl) |
| Error style | MUI `<Alert severity="error">` | Custom dark `bg-red-500/10` div |
| Submit button | MUI `Button variant="contained"` | Raw `<button>` Tailwind styled |

### 17.3 Focus Ring Colors Inconsistent

| Location | Focus ring color |
|---|---|
| LoginPage.tsx inputs | `#6366F1` (indigo-500) via `focus:ring-indigo-500` |
| Dialog form inputs (Product) | `#6366F1` (indigo-500) via `focus:ring-indigo-500` |
| Legacy AdminDashboard.jsx forms | `#3B82F6` (blue-500) via `focus:ring-blue-500` |
| `*:focus-visible` in index.css | `#F59E0B` (amber, client-app color!) — `outline: 2px solid #f59e0b` |

The global `*:focus-visible` in `index.css` uses the client app's amber brand color, which would affect any focused admin element not overriding it.

### 17.4 Color Inconsistency: Primary Revenue Color

| Location | Color | Value |
|---|---|---|
| MUI theme `primary.main` | Indigo | `#6366F1` |
| Hardcoded chart stroke | Indigo 700 | `#4f46e5` |
| Tailwind config `primary` | Dark gray | `#1f2937` |
| index.css `--color-primary` | Amber | `#f59e0b` |

Three different "primary" colors exist in the same admin build.

### 17.5 `::selection` Color (index.css)

```css
::selection {
  background: #fde68a;   /* amber-200 — client-app brand color */
  color: #1a1a1a;
}
```

Applied globally including in admin. Amber selection highlight is inconsistent with the indigo primary color of the admin UI.

### 17.6 App.tsx DashboardPage Stub vs DashboardPage.tsx

`App.tsx` contains an **inline stub DashboardPage** component:
```jsx
const DashboardPage = () => (
  <div className="p-8 min-h-screen bg-slate-50">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white shadow rounded-lg border-l-4 border-blue-500">...</div>
      <div className="p-6 bg-white shadow rounded-lg border-l-4 border-green-500">...</div>
      <div className="p-6 bg-white shadow rounded-lg border-l-4 border-purple-500">...</div>
    </div>
  </div>
);
```

This is NOT the `DashboardPage.tsx` — it's a prototype stub using border-left colored cards (`border-l-4 border-blue/green/purple-500`), which is a completely different design pattern from the icon-box stat cards in the real `DashboardPage.tsx`.

### 17.7 `src/pages/auth/` Directory

The `src/pages/auth/` directory is referenced in `App.tsx` as `import { AdminLoginPage } from './pages/auth/AdminLoginPage'`, but the primary login implementation used by the TypeScript stack (`main.tsx`) is `src/pages/LoginPage.tsx`. Both exist simultaneously.

### 17.8 Duplicate Store Files

```
stores/adminStore.js  (JS, older)
stores/adminStore.ts  (TS, newer — 572 lines, much more complete)
stores/authStore.js   (JS, older)
stores/authStore.ts   (TS, newer)
stores/index.js       (JS, exports from .js files)
stores/index.ts       (TS, exports from .ts files)
```

The `.js` store files use a different API client and may produce different data shapes, but both are bundled.

### 17.9 CartesianGrid Stroke Hardcoded to Light Mode Only

```jsx
<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
```

`#f0f0f0` is a near-white color — nearly invisible on dark mode backgrounds. There is no dark-mode variant for the chart grid color.

### 17.10 Dialog Form Inputs Use Light-Mode Tailwind Classes

Inside MUI `<Dialog>` components (which respond to theme), the form inputs use hardcoded Tailwind light-mode classes:
```html
border-gray-300  <!-- always light gray border, regardless of theme -->
text-gray-700    <!-- always dark text on label -->
```

These will look correct in light mode but have insufficient contrast in dark mode since the Dialog paper background becomes `#1E293B` while labels remain `text-gray-700` (#374151 — not white).

---

*End of StepStyle Admin Design Reference — Last updated: March 8, 2026*
