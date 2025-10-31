# Sidebar Styling Reference

## 🎨 Active State Colors

The active navigation items use a distinctive **blue color scheme** that's visible in all states (expanded, collapsed, and nested items).

### Color Specifications

| State          | Light Mode                     | Dark Mode                      |
| -------------- | ------------------------------ | ------------------------------ |
| **Background** | `bg-blue-500/20` (20% opacity) | `bg-blue-500/30` (30% opacity) |
| **Text**       | `text-blue-600`                | `text-blue-400`                |
| **Icon**       | Inherits text color            | Inherits text color            |

### Visual Examples

#### Expanded Sidebar - Active Item

```
┌─────────────────────────────────┐
│ 🏠 Dashboard                    │ ← Normal state
│ 👥 Users                        │
│ 📄 Posts        [BLUE BG]       │ ← Active state (blue background)
│   ├─ All Posts  [BLUE BG]       │ ← Active sub-item
│   ├─ Create                     │
│   └─ Categories                 │
│ ⚙️  Settings                     │
└─────────────────────────────────┘
```

#### Collapsed Sidebar - Active Item

```
┌────┐
│ 🏠 │ ← Normal icon
│ 👥 │
│[📄]│ ← Active icon (blue background visible)
│ ⚙️  │
└────┘
```

## 🔧 Customization Guide

### Change Active Color to Green

**File**: `src/components/ui/sidebar.tsx`

**Line ~562** - Update `sidebarMenuButtonVariants`:

```typescript
// BEFORE (Blue)
data-[active=true]:bg-blue-500/20
data-[active=true]:text-blue-600
dark:data-[active=true]:bg-blue-500/30
dark:data-[active=true]:text-blue-400

// AFTER (Green)
data-[active=true]:bg-green-500/20
data-[active=true]:text-green-600
dark:data-[active=true]:bg-green-500/30
dark:data-[active=true]:text-green-400
```

**Line ~703** - Update `SidebarMenuSubButton`:

```typescript
// BEFORE (Blue)
'data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-600 dark:data-[active=true]:bg-blue-500/30 dark:data-[active=true]:text-blue-400 data-[active=true]:font-medium'

// AFTER (Green)
'data-[active=true]:bg-green-500/20 data-[active=true]:text-green-600 dark:data-[active=true]:bg-green-500/30 dark:data-[active=true]:text-green-400 data-[active=true]:font-medium'
```

### Change Active Color to Purple

```typescript
// Purple variant
data-[active=true]:bg-purple-500/20
data-[active=true]:text-purple-600
dark:data-[active=true]:bg-purple-500/30
dark:data-[active=true]:text-purple-400
```

### Change Active Color to Orange

```typescript
// Orange variant
data-[active=true]:bg-orange-500/20
data-[active=true]:text-orange-600
dark:data-[active=true]:bg-orange-500/30
dark:data-[active=true]:text-orange-400
```

### Custom Color with Exact Values

```typescript
// Custom color using arbitrary values
data-[active=true]:bg-[#3b82f6]/20      // Background with 20% opacity
data-[active=true]:text-[#2563eb]       // Text color (solid)
dark:data-[active=true]:bg-[#3b82f6]/30 // Dark mode background
dark:data-[active=true]:text-[#60a5fa] // Dark mode text
```

## 📐 Sidebar Size Constants

**File**: `src/components/ui/sidebar.tsx` (Lines 22-26)

```typescript
const SIDEBAR_WIDTH = '16rem' // 256px expanded
const SIDEBAR_WIDTH_MOBILE = '18rem' // 288px mobile
const SIDEBAR_WIDTH_ICON = '3rem' // 48px collapsed
```

### Adjust Sidebar Width

```typescript
// Wider sidebar
const SIDEBAR_WIDTH = '20rem' // 320px

// Narrower sidebar
const SIDEBAR_WIDTH = '14rem' // 224px

// Larger collapsed icons
const SIDEBAR_WIDTH_ICON = '4rem' // 64px
```

## 🎯 Hover & Focus States

### Current Hover Styling

```typescript
hover: bg - sidebar - accent
hover: text - sidebar - accent - foreground
```

### Custom Hover (matches active color)

```typescript
// Change hover to match active state
hover: bg - blue - 500 / 10
hover: text - blue - 600
```

## 🌈 Complete Color Palette Options

### Tailwind CSS Colors

| Color              | Light BG           | Light Text        | Dark BG            | Dark Text         |
| ------------------ | ------------------ | ----------------- | ------------------ | ----------------- |
| **Blue** (Current) | `bg-blue-500/20`   | `text-blue-600`   | `bg-blue-500/30`   | `text-blue-400`   |
| **Green**          | `bg-green-500/20`  | `text-green-600`  | `bg-green-500/30`  | `text-green-400`  |
| **Purple**         | `bg-purple-500/20` | `text-purple-600` | `bg-purple-500/30` | `text-purple-400` |
| **Pink**           | `bg-pink-500/20`   | `text-pink-600`   | `bg-pink-500/30`   | `text-pink-400`   |
| **Red**            | `bg-red-500/20`    | `text-red-600`    | `bg-red-500/30`    | `text-red-400`    |
| **Orange**         | `bg-orange-500/20` | `text-orange-600` | `bg-orange-500/30` | `text-orange-400` |
| **Yellow**         | `bg-yellow-500/20` | `text-yellow-600` | `bg-yellow-500/30` | `text-yellow-400` |
| **Teal**           | `bg-teal-500/20`   | `text-teal-600`   | `bg-teal-500/30`   | `text-teal-400`   |
| **Cyan**           | `bg-cyan-500/20`   | `text-cyan-600`   | `bg-cyan-500/30`   | `text-cyan-400`   |
| **Indigo**         | `bg-indigo-500/20` | `text-indigo-600` | `bg-indigo-500/30` | `text-indigo-400` |

## 🔍 Debugging Active States

### Check if Active State is Applied

Open browser DevTools and inspect an active navigation item:

```html
<!-- Active item should have -->
<button data-active="true" ...>Dashboard</button>

<!-- Inactive item -->
<button data-active="false" ...>Settings</button>
```

### Test Active Detection

Add this to `src/components/nav-main.tsx` for debugging:

```typescript
console.log('Active routes:', {
  item: item.title,
  isParentActive,
  hasActiveChild,
  currentPath: window.location.pathname,
})
```

## 🎨 Advanced Customization Examples

### Gradient Background for Active Items

```typescript
// In sidebar.tsx, replace bg-blue-500/20 with:
'data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500/20 data-[active=true]:to-blue-600/20'
```

### Border Left Indicator

```typescript
// Add to sidebarMenuButtonVariants:
'data-[active=true]:border-l-4 data-[active=true]:border-blue-600'
```

### Shadow Effect

```typescript
// Add subtle shadow to active items:
'data-[active=true]:shadow-md data-[active=true]:shadow-blue-500/50'
```

### Rounded Corners

```typescript
// More pronounced border radius:
'data-[active=true]:rounded-xl'
```

## 📱 Responsive Considerations

### Mobile Sidebar

- Sidebar opens as a sheet overlay on mobile
- Active states apply equally on mobile
- Touch targets are appropriately sized

### Tablet

- Sidebar can be toggled
- Collapsed state shows icons with tooltips
- Active state visible in both expanded/collapsed

### Desktop

- Sidebar persists
- Smooth transitions between expanded/collapsed
- Keyboard navigation support (Ctrl/Cmd + B to toggle)

## 🚀 Performance Tips

### Memoization

Active state filtering uses `React.useMemo`:

```typescript
const filteredNavMain = React.useMemo(() => {
  // Filtering logic
}, [role])
```

### Avoid Re-renders

The `useMatchRoute` hook is optimized to avoid unnecessary re-renders.

## 🐛 Common Issues & Solutions

### Issue: Active State Not Showing

**Solution**: Check that routes match exactly in navigation config:

```typescript
// Config
url: '/admin/posts'

// Route file
export const Route = createFileRoute('/_dashboard-layout/admin/posts')
```

### Issue: Multiple Items Active

**Solution**: Use exact matching for sub-items:

```typescript
// Use exact match, not fuzzy
const isSubActive = matchRoute({ to: subItem.url }) // ✅
const isSubActive = matchRoute({ to: subItem.url, fuzzy: true }) // ❌
```

### Issue: Active State in Collapsed Sidebar

**Solution**: Ensure collapsed styling is included:

```typescript
group-data-[collapsible=icon]:data-[active=true]:bg-blue-500/20
```

## 📚 Related Files to Modify

| File                              | Purpose                      |
| --------------------------------- | ---------------------------- |
| `src/components/ui/sidebar.tsx`   | Main styling definitions     |
| `src/components/nav-main.tsx`     | Active state detection logic |
| `src/components/nav-projects.tsx` | Project items active states  |
| `src/styles.css`                  | Global CSS variables         |

## 💡 Pro Tips

1. **Use opacity for backgrounds**: `/20` for light, `/30` for dark
2. **Consistent color scale**: Use same color family for bg and text
3. **Test both themes**: Always check light and dark modes
4. **Check accessibility**: Ensure sufficient color contrast
5. **Use Tailwind's color system**: Easier to maintain and consistent

---

**Need different styling?** Edit the Tailwind classes in `src/components/ui/sidebar.tsx` at:

- Line ~562: `sidebarMenuButtonVariants`
- Line ~703: `SidebarMenuSubButton`
