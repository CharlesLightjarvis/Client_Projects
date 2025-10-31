# Project Structure Overview

## 📂 Complete Directory Tree

```
postfrontnew/
│
├── public/
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   │
│   ├── components/              # UI Components
│   │   ├── ui/                  # Shadcn/UI components
│   │   │   ├── avatar.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx       # ✨ Updated with active state styling
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── app-sidebar.tsx       # ✨ Dynamic role-based sidebar
│   │   ├── nav-main.tsx          # ✨ Main navigation with active detection
│   │   ├── nav-projects.tsx      # ✨ Projects navigation with active detection
│   │   ├── nav-user.tsx          # User menu component
│   │   ├── team-switcher.tsx     # ✨ Role-aware switcher
│   │   ├── mode-toggle.tsx       # Dark/Light mode toggle
│   │   ├── theme-provider.tsx    # Theme context provider
│   │   │
│   │   ├── CreatePost.tsx        # Post creation component
│   │   ├── ReadPosts.tsx         # Posts display component
│   │   ├── UpdatePost.tsx        # Post update component
│   │   └── Header.tsx            # Header component
│   │
│   ├── config/                   # ✨ Configuration files
│   │   └── navigation.tsx        # ✨ Role-based navigation config
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-mobile.ts         # Mobile detection hook
│   │   └── use-posts.ts          # Posts data hook
│   │
│   ├── integrations/
│   │   └── tanstack-query/       # React Query integration
│   │       ├── devtools.tsx
│   │       └── root-provider.tsx
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── api.ts                # API client
│   │   ├── router-context-state.tsx  # Router context management
│   │   └── utils.ts              # Utility functions
│   │
│   ├── routes/                   # Application routes
│   │   ├── demo/
│   │   │   └── tanstack-query.tsx
│   │   │
│   │   ├── __root.tsx            # Root route with context
│   │   ├── index.tsx             # Home page
│   │   ├── login.tsx             # Login page
│   │   ├── _dashboard-layout.tsx       # ✨ Dashboard layout with breadcrumbs
│   │   ├── _dashboard-layout.admin.tsx # Admin dashboard
│   │   └── _dashboard-layout.client.tsx# Client dashboard
│   │
│   ├── schemas/                  # Validation schemas
│   │   └── post-schema.ts
│   │
│   ├── services/                 # Business logic services
│   │   └── post-service.ts
│   │
│   ├── stores/                   # State management
│   │   └── post-store.ts
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── post.ts
│   │
│   ├── main.tsx                  # Application entry point
│   ├── reportWebVitals.ts        # Performance monitoring
│   ├── routeTree.gen.ts          # Generated route tree
│   └── styles.css                # Global styles
│
├── CRUD_COMPONENTS.md            # CRUD components documentation
├── ROLE_BASED_SIDEBAR.md         # ✨ Sidebar implementation guide
├── README.md                     # Project readme
├── components.json               # Shadcn/UI config
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── package-lock.json             # Locked dependencies
├── prettier.config.js            # Prettier config
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite configuration
```

## 🎯 Key File Categories

### ✨ **Newly Created/Updated Files** (Role-Based Sidebar)

| File                               | Purpose                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `src/config/navigation.tsx`        | **NEW** - Centralized navigation configuration with role-based permissions |
| `src/components/app-sidebar.tsx`   | **UPDATED** - Dynamic sidebar with role filtering logic                    |
| `src/components/nav-main.tsx`      | **UPDATED** - Active state detection using TanStack Router                 |
| `src/components/nav-projects.tsx`  | **UPDATED** - Active state for project items                               |
| `src/components/team-switcher.tsx` | **UPDATED** - Role-aware team switcher                                     |
| `src/components/ui/sidebar.tsx`    | **UPDATED** - Custom active state styling (blue background)                |
| `src/routes/_dashboard-layout.tsx` | **UPDATED** - Dynamic breadcrumbs based on route                           |
| `ROLE_BASED_SIDEBAR.md`            | **NEW** - Complete implementation documentation                            |

### 🧩 **Component Organization**

```
components/
├── ui/              → Shadcn/UI primitives (buttons, inputs, etc.)
├── layout/          → Sidebar, navigation components
├── feature/         → CRUD components (Posts)
└── shared/          → Theme, mode toggle
```

### 🛣️ **Routing Structure**

```
routes/
├── __root.tsx                    → Router context provider
├── index.tsx                     → / (home/redirect)
├── login.tsx                     → /login
├── _dashboard-layout.tsx         → Layout wrapper
│   ├── admin.tsx                 → /admin (admin dashboard)
│   └── client.tsx                → /client (client dashboard)
```

### 🔧 **Configuration Files**

| File                        | Description                            |
| --------------------------- | -------------------------------------- |
| `src/config/navigation.tsx` | Navigation items with role permissions |
| `components.json`           | Shadcn/UI component configuration      |
| `tsconfig.json`             | TypeScript compiler options            |
| `vite.config.ts`            | Vite build tool configuration          |
| `eslint.config.js`          | Code linting rules                     |
| `prettier.config.js`        | Code formatting rules                  |

## 🎨 **Navigation Config Structure**

```typescript
// src/config/navigation.tsx
navigationMain[]
  ├── Admin Items
  │   ├── Dashboard (with sub-items)
  │   ├── User Management (with sub-items)
  │   ├── Post Management (with sub-items)
  │   └── Settings (with sub-items)
  │
  └── Client Items
      ├── My Space (with sub-items)
      ├── My Posts (with sub-items)
      └── Settings (with sub-items)

navigationProjects[]
  ├── Admin Projects
  │   ├── Analytics
  │   └── E-commerce
  │
  └── Client Projects
      └── My Activities
```

## 🔐 **Authentication Flow**

```
User
  └─→ /login
       ├─→ Select Admin → localStorage.setItem('userRole', 'admin')
       │                 └─→ Redirect to /admin
       │
       └─→ Select Client → localStorage.setItem('userRole', 'client')
                          └─→ Redirect to /client

Dashboard Layout
  └─→ Read role from context
       └─→ Filter navigation based on role
            └─→ Render role-specific sidebar
```

## 📊 **Data Flow**

```
Router Context (src/lib/router-context-state.tsx)
  └─→ Provides: { role, login, logout, isAdmin, isClient }
       │
       ├─→ AppSidebar (src/components/app-sidebar.tsx)
       │    └─→ Filters navigationMain & navigationProjects
       │         └─→ NavMain & NavProjects components
       │              └─→ Render filtered items
       │
       ├─→ TeamSwitcher (src/components/team-switcher.tsx)
       │    └─→ Displays role-specific icon & label
       │
       └─→ DashboardLayout (src/routes/_dashboard-layout.tsx)
            └─→ Generates role-specific breadcrumbs
```

## 🎯 **Active State Detection**

```
NavMain/NavProjects Component
  └─→ useMatchRoute() from TanStack Router
       ├─→ Check parent route (fuzzy match)
       │    └─→ isParentActive = matchRoute({ to: item.url, fuzzy: true })
       │
       └─→ Check sub-item route (exact match)
            └─→ isSubActive = matchRoute({ to: subItem.url })
                 └─→ Apply data-active={true}
                      └─→ Trigger blue background styling
```

## 🏗️ **Best Practices Applied**

✅ **Separation of Concerns**

- Configuration separate from UI components
- Business logic in services/stores
- Type definitions in dedicated folder

✅ **Type Safety**

- Full TypeScript coverage
- Typed navigation items
- Typed router context

✅ **Scalability**

- Easy to add new routes
- Easy to add new roles
- Modular component structure

✅ **Maintainability**

- Clear folder structure
- Well-documented code
- Consistent naming conventions

✅ **Performance**

- React.useMemo for filtered navigation
- Lazy route loading
- Optimized re-renders

## 🔄 **Development Workflow**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## 📝 **Adding New Features**

### Add New Route:

1. Create file in `src/routes/`
2. Add to navigation config if needed
3. TanStack Router auto-generates route tree

### Add New Component:

1. Create in appropriate `src/components/` subfolder
2. Import and use in routes
3. Follow existing naming conventions

### Add New Navigation Item:

1. Edit `src/config/navigation.tsx`
2. Add icon, title, url, and allowedRoles
3. Sidebar updates automatically

---

**Last Updated**: 2025-10-16  
**Status**: ✅ Production Ready
