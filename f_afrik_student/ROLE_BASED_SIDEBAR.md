# Role-Based Dynamic Sidebar Implementation

## 🎯 Overview

This implementation provides a fully dynamic, role-based sidebar system for your application. The sidebar automatically adjusts its content based on whether the user is an **admin** or **client**, following modern best practices and maintaining a clean, maintainable file structure.

## 📁 File Structure

```
src/
├── config/
│   └── navigation.tsx          # Navigation configuration with role-based permissions
├── components/
│   ├── app-sidebar.tsx         # Main sidebar component with role filtering
│   ├── nav-main.tsx            # Navigation items with active state detection
│   ├── nav-projects.tsx        # Project items with active state detection
│   ├── team-switcher.tsx       # Role-aware team/user switcher
│   └── ui/
│       └── sidebar.tsx         # Updated with custom active states
├── routes/
│   ├── __root.tsx              # Root route with context
│   ├── _dashboard-layout.tsx   # Dashboard layout with dynamic breadcrumb
│   ├── _dashboard-layout.admin.tsx
│   └── _dashboard-layout.client.tsx
└── lib/
    └── router-context-state.tsx # Router context management
```

## 🔑 Key Features

### 1. **Role-Based Navigation Filtering**

- Navigation items are automatically filtered based on user role
- Defined in `src/config/navigation.tsx`
- Each item specifies allowed roles: `allowedRoles: ['admin']` or `allowedRoles: ['client']`

### 2. **Active State Highlighting**

- **Custom blue background** for active items
- Works in both expanded and collapsed sidebar states
- Active state persists even for nested sub-items
- Colors:
  - Light mode: `bg-blue-500/20` with `text-blue-600`
  - Dark mode: `bg-blue-500/30` with `text-blue-400`

### 3. **Dynamic Breadcrumbs**

- Automatically generated from current route
- Shows role-specific home: "Administration" for admin, "Espace Client" for client

### 4. **TanStack Router Integration**

- Uses `useMatchRoute()` for accurate active state detection
- Supports fuzzy matching for parent items
- Type-safe navigation with TypeScript

## 🚀 How It Works

### Navigation Configuration (`src/config/navigation.tsx`)

```typescript
export const navigationMain: NavigationItem[] = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    allowedRoles: ['admin'], // Only visible to admin
    items: [
      {
        title: "Vue d'ensemble",
        url: '/admin',
        allowedRoles: ['admin'],
      },
      // More sub-items...
    ],
  },
  {
    title: 'Mon espace',
    url: '/client',
    icon: UserCircle,
    allowedRoles: ['client'], // Only visible to client
    items: [
      // Client-specific items...
    ],
  },
]
```

### Sidebar Component (`src/components/app-sidebar.tsx`)

The sidebar automatically filters navigation based on the current user's role:

```typescript
const context = useRouteContext({ from: '__root__' }) as RouterContext
const { role } = context

const filteredNavMain = React.useMemo(() => {
  if (!role) return []
  return navigationMain
    .filter((item) => item.allowedRoles.includes(role))
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) =>
        subItem.allowedRoles.includes(role),
      ),
    }))
}, [role])
```

### Active State Detection (`src/components/nav-main.tsx`)

```typescript
const matchRoute = useMatchRoute()
const isParentActive = matchRoute({ to: item.url, fuzzy: true })
const isSubActive = matchRoute({ to: subItem.url })
```

## 🎨 Styling

### Active Item Styling

The active state uses a distinctive blue background that's visible in all states:

- **Expanded sidebar**: Full background with blue color
- **Collapsed sidebar**: Icon-only with blue background
- **Sub-items**: Same blue styling applied consistently

The styling is defined in `src/components/ui/sidebar.tsx`:

```typescript
data-[active=true]:bg-blue-500/20
data-[active=true]:text-blue-600
dark:data-[active=true]:bg-blue-500/30
dark:data-[active=true]:text-blue-400
group-data-[collapsible=icon]:data-[active=true]:bg-blue-500/20
```

## 📝 Adding New Navigation Items

### For Admin Only:

```typescript
{
  title: 'New Admin Feature',
  url: '/admin/new-feature',
  icon: YourIcon,
  allowedRoles: ['admin'],
  items: [
    {
      title: 'Sub Feature',
      url: '/admin/new-feature/sub',
      allowedRoles: ['admin'],
    },
  ],
}
```

### For Client Only:

```typescript
{
  title: 'Client Feature',
  url: '/client/feature',
  icon: YourIcon,
  allowedRoles: ['client'],
}
```

### For Both Roles:

```typescript
{
  title: 'Shared Feature',
  url: '/shared',
  icon: YourIcon,
  allowedRoles: ['admin', 'client'],
}
```

## 🔄 Role Switching

The application uses the context from `__root.tsx`:

```typescript
export type UserRole = 'admin' | 'client' | null
export type RouterContext = {
  role: UserRole
  login: (role: 'admin' | 'client') => void
  logout: () => void
  isAdmin: boolean
  isClient: boolean
  isAuthenticated: boolean
}
```

Current role is stored in localStorage via `src/lib/router-context-state.tsx`.

## 🛠️ Maintenance Best Practices

### 1. **Centralized Configuration**

- All navigation items are defined in one place: `src/config/navigation.tsx`
- Easy to add, remove, or modify items
- Type-safe with TypeScript interfaces

### 2. **Separation of Concerns**

- Navigation data separated from UI components
- Role filtering logic in sidebar component
- Active state detection in nav components

### 3. **Scalability**

- Easy to add new roles by extending `UserRole` type
- Support for nested sub-items (sub-sub-items)
- Flexible permission system

### 4. **Type Safety**

- Full TypeScript support
- Auto-completion for navigation items
- Compile-time error checking

## 🎯 Testing the Implementation

1. **Login as Admin**:
   - Navigate to `/login`
   - Select "Admin" role
   - Verify admin-specific navigation items appear

2. **Login as Client**:
   - Navigate to `/login`
   - Select "Client" role
   - Verify client-specific navigation items appear

3. **Active State**:
   - Click on different navigation items
   - Verify blue background appears on active item
   - Collapse sidebar and verify active state still visible

4. **Breadcrumbs**:
   - Navigate to different pages
   - Verify breadcrumb updates correctly
   - Check role-specific home label

## 🔧 Customization

### Change Active Color

Edit `src/components/ui/sidebar.tsx` and modify the `data-[active=true]` classes:

```typescript
// Current: Blue
data-[active=true]:bg-blue-500/20

// Example: Green
data-[active=true]:bg-green-500/20
data-[active=true]:text-green-600
```

### Add New Role

1. Update `src/routes/__root.tsx`:

```typescript
export type UserRole = 'admin' | 'client' | 'manager' | null
```

2. Add navigation items in `src/config/navigation.tsx`:

```typescript
allowedRoles: ['admin', 'manager']
```

3. Update role switcher in `src/components/team-switcher.tsx`

## 📊 Benefits

✅ **Maintainable**: Clean separation of data and UI  
✅ **Scalable**: Easy to add new roles and navigation items  
✅ **Type-Safe**: Full TypeScript support  
✅ **User-Friendly**: Clear visual feedback with active states  
✅ **Responsive**: Works on mobile and desktop  
✅ **Accessible**: Proper ARIA labels and keyboard navigation

## 🎓 Related Files

- **Router Context**: `src/lib/router-context-state.tsx`
- **Root Route**: `src/routes/__root.tsx`
- **Login Page**: `src/routes/login.tsx`
- **Admin Dashboard**: `src/routes/_dashboard-layout.admin.tsx`
- **Client Dashboard**: `src/routes/_dashboard-layout.client.tsx`

---

**Implementation Date**: 2025-10-16  
**Framework**: React + TanStack Router + Shadcn/UI  
**State Management**: React Context + localStorage
