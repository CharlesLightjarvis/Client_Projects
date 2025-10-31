# 🎨 Visual Guide - Role-Based Sidebar

## 📐 Sidebar States Overview

### 1. Admin Sidebar - Expanded

```
┌─────────────────────────────────────────────┐
│ 🛡️  Administration                          │
│     Compte Administrateur                   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Platform                                    │
│                                             │
│ ▼ 📊 Dashboard                              │
│   ├─ Vue d'ensemble    [BLUE BACKGROUND]    │ ← Active
│   ├─ Statistiques                           │
│   └─ Rapports                               │
│                                             │
│ ▶ 👥 Gestion des utilisateurs               │
│   ├─ Tous les utilisateurs                  │
│   ├─ Ajouter un utilisateur                 │
│   └─ Rôles et permissions                   │
│                                             │
│ ▶ 📄 Gestion des posts                      │
│   ├─ Tous les posts                         │
│   ├─ Créer un post                          │
│   └─ Catégories                             │
│                                             │
│ ▶ ⚙️  Paramètres                             │
│   ├─ Général                                │
│   ├─ Sécurité                               │
│   └─ Notifications                          │
│                                             │
├─────────────────────────────────────────────┤
│ Projects                                    │
│                                             │
│ 📊 Analytiques                              │
│ 🛒 E-commerce                               │
│                                             │
├─────────────────────────────────────────────┤
│ 👤 shadcn                                   │
│     m@example.com                           │
└─────────────────────────────────────────────┘
```

### 2. Admin Sidebar - Collapsed

```
┌────┐
│ 🛡️  │
│    │
├────┤
│    │
│[📊]│ ← Active (blue background visible)
│ 👥 │
│ 📄 │
│ ⚙️  │
│    │
├────┤
│ 📊 │
│ 🛒 │
│    │
├────┤
│ 👤 │
└────┘
```

### 3. Client Sidebar - Expanded

```
┌─────────────────────────────────────────────┐
│ 👤 Espace Client                            │
│     Compte Client                           │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Platform                                    │
│                                             │
│ ▼ 👤 Mon espace                             │
│   ├─ Tableau de bord   [BLUE BACKGROUND]    │ ← Active
│   └─ Mon profil                             │
│                                             │
│ ▶ 📄 Mes posts                              │
│   ├─ Tous mes posts                         │
│   └─ Brouillons                             │
│                                             │
│ ▶ ⚙️  Paramètres                             │
│   ├─ Mon compte                             │
│   └─ Préférences                            │
│                                             │
├─────────────────────────────────────────────┤
│ Projects                                    │
│                                             │
│ 📊 Mes activités                            │
│                                             │
├─────────────────────────────────────────────┤
│ 👤 shadcn                                   │
│     m@example.com                           │
└─────────────────────────────────────────────┘
```

## 🎨 Color Scheme Visualization

### Light Mode

```
┌──────────────────────────────────┐
│ Active Item (Light)              │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 📊 Dashboard                 │ │
│ │                              │ │
│ │ Background: #3B82F6 at 20%   │ │  Blue with transparency
│ │ Text: #2563EB (blue-600)     │ │  Solid blue
│ │ Font: Medium/Bold            │ │
│ └──────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

### Dark Mode

```
┌──────────────────────────────────┐
│ Active Item (Dark)               │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 📊 Dashboard                 │ │
│ │                              │ │
│ │ Background: #3B82F6 at 30%   │ │  Brighter blue
│ │ Text: #60A5FA (blue-400)     │ │  Lighter blue
│ │ Font: Medium/Bold            │ │
│ └──────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

## 🔄 State Transitions

### Normal → Hover → Active

```
Normal State:
┌─────────────────┐
│ 📊 Dashboard    │  No background
└─────────────────┘

Hover State:
┌─────────────────┐
│ 📊 Dashboard    │  Subtle gray background
└─────────────────┘  (sidebar-accent)

Active State:
┌─────────────────┐
│ 📊 Dashboard    │  Blue background
└─────────────────┘  + Bold text
```

## 📱 Responsive Breakpoints

### Mobile (< 768px)

```
┌──────────────┐  ┌─────────────────────────┐
│ [≡] Header   │  │ Overlay Sidebar         │
└──────────────┘  │                         │
                  │ ▼ 📊 Dashboard          │
Content Area      │   ├─ Overview [BLUE]    │
Full Width        │   └─ Stats              │
                  │                         │
                  │ Swipe to close →        │
                  └─────────────────────────┘
```

### Tablet (768px - 1024px)

```
┌────┬────────────────────┐
│    │                    │
│[📊]│   Content Area     │
│ 👥 │                    │
│ 📄 │                    │
│    │                    │
└────┴────────────────────┘
 Icon Sidebar (collapsed)
```

### Desktop (> 1024px)

```
┌────────────────┬──────────────────────┐
│                │                      │
│ ▼ 📊 Dashboard │   Content Area       │
│   ├─ Overview  │                      │
│   └─ Stats     │                      │
│                │                      │
│ ▶ 👥 Users     │                      │
│                │                      │
└────────────────┴──────────────────────┘
 Full Sidebar (expanded)
```

## 🎯 Active State in Different Scenarios

### Scenario 1: Parent Active

```
URL: /admin

┌──────────────────────────┐
│ ▼ 📊 Dashboard [BLUE]    │ ← Parent active
│   ├─ Overview [BLUE]     │ ← First child also active
│   ├─ Stats              │
│   └─ Reports            │
└──────────────────────────┘
```

### Scenario 2: Child Active

```
URL: /admin/stats

┌──────────────────────────┐
│ ▼ 📊 Dashboard [BLUE]    │ ← Parent highlighted (child active)
│   ├─ Overview            │
│   ├─ Stats [BLUE]        │ ← Active child
│   └─ Reports            │
└──────────────────────────┘
```

### Scenario 3: Collapsed with Active

```
URL: /admin/posts

┌────┐
│ 📊 │
│ 👥 │
│[📄]│ ← Icon has blue background
│ ⚙️  │
└────┘
```

## 🌈 Color Variations Examples

### Blue (Current Implementation)

```
┌─────────────────┐
│ 📊 Dashboard    │ #3B82F6 (bg-blue-500/20)
└─────────────────┘
```

### Green Alternative

```
┌─────────────────┐
│ 📊 Dashboard    │ #10B981 (bg-green-500/20)
└─────────────────┘
```

### Purple Alternative

```
┌─────────────────┐
│ 📊 Dashboard    │ #8B5CF6 (bg-purple-500/20)
└─────────────────┘
```

### Orange Alternative

```
┌─────────────────┐
│ 📊 Dashboard    │ #F59E0B (bg-orange-500/20)
└─────────────────┘
```

## 🔍 Component Hierarchy

```
SidebarProvider
└── AppSidebar
    ├── SidebarHeader
    │   └── TeamSwitcher
    │       └── Role-specific icon & label
    │
    ├── SidebarContent
    │   ├── NavMain (filtered by role)
    │   │   └── SidebarMenu
    │   │       └── SidebarMenuItem
    │   │           ├── SidebarMenuButton (with isActive)
    │   │           └── SidebarMenuSub
    │   │               └── SidebarMenuSubButton (with isActive)
    │   │
    │   └── NavProjects (filtered by role)
    │       └── SidebarMenu
    │           └── SidebarMenuItem (with isActive)
    │
    └── SidebarFooter
        └── NavUser
            └── User info & logout
```

## 🎭 User Journey Flow

### Admin Login Journey

```
1. Visit /login
   ┌─────────────────┐
   │ Choose Role:    │
   │ [Admin] [Client]│
   └─────────────────┘
          ↓
2. Select Admin
          ↓
3. Redirect to /admin
          ↓
4. Sidebar shows:
   ┌─────────────────────┐
   │ 🛡️  Administration   │
   │ ─────────────────── │
   │ ▼ Dashboard [BLUE]  │
   │ ▶ Users            │
   │ ▶ Posts            │
   │ ▶ Settings         │
   └─────────────────────┘
```

### Client Login Journey

```
1. Visit /login
   ┌─────────────────┐
   │ Choose Role:    │
   │ [Admin] [Client]│
   └─────────────────┘
          ↓
2. Select Client
          ↓
3. Redirect to /client
          ↓
4. Sidebar shows:
   ┌─────────────────────┐
   │ 👤 Espace Client    │
   │ ─────────────────── │
   │ ▼ Mon espace [BLUE] │
   │ ▶ Mes posts        │
   │ ▶ Paramètres       │
   └─────────────────────┘
```

## 📊 Data Flow Diagram

```
localStorage (userRole: 'admin')
          ↓
useRouterContextState()
          ↓
RouterContext { role: 'admin' }
          ↓
    ┌─────┴─────┬──────────────┬─────────────┐
    ↓           ↓              ↓             ↓
AppSidebar  TeamSwitcher  NavMain     DashboardLayout
    │           │              │             │
    ├─ Filter   ├─ Show      ├─ Detect    ├─ Show
    │  nav by   │  Shield    │  active    │  "Admin"
    │  role     │  icon      │  route     │  breadcrumb
    ↓           ↓              ↓             ↓
Display       Display        Apply         Display
admin items   "Admin"        blue bg       context
```

## 🎬 Animation Sequences

### Sidebar Collapse Animation

```
Frame 1 (Expanded):
┌──────────────────┐
│ 📊 Dashboard     │ Width: 256px
└──────────────────┘

Frame 2 (Transition):
┌────────────┐
│ 📊 Dash... │ Width: 128px
└────────────┘

Frame 3 (Collapsed):
┌────┐
│ 📊 │ Width: 48px
└────┘

Duration: 200ms ease-linear
```

### Menu Expand Animation

```
Frame 1 (Closed):
▶ 📊 Dashboard

Frame 2 (Opening):
▼ 📊 Dashboard
  ├─ Over...

Frame 3 (Open):
▼ 📊 Dashboard
  ├─ Overview
  ├─ Stats
  └─ Reports

Duration: Smooth with ChevronRight rotation (90deg)
```

## 🖱️ Interactive Elements

### Hover States

```
Before Hover:
┌─────────────────┐
│ 📊 Dashboard    │
└─────────────────┘

During Hover:
┌─────────────────┐
│ 📊 Dashboard    │ ← Light gray background
└─────────────────┘   Cursor: pointer

Active + Hover:
┌─────────────────┐
│ 📊 Dashboard    │ ← Blue background (slightly darker)
└─────────────────┘
```

### Focus States (Keyboard Navigation)

```
Tab Navigation:
┌─────────────────┐
│ 📊 Dashboard    │ ← Focus ring visible
└─────────────────┘   Accessible outline

Active + Focus:
┌─────────────────┐
│ 📊 Dashboard    │ ← Blue bg + focus ring
└─────────────────┘
```

## 📐 Spacing & Dimensions

```
Sidebar Widths:
- Expanded: 256px (16rem)
- Collapsed: 48px (3rem)
- Mobile: 288px (18rem)

Item Heights:
- Default: 32px (h-8)
- Small: 28px (h-7)
- Large: 48px (h-12)

Padding:
- Horizontal: 8px (p-2)
- Group: 8px (gap-2)

Border Radius:
- Items: 6px (rounded-md)
- Sidebar: 8px (rounded-lg)
```

## 🎨 Complete Visual Legend

```
Symbol Legend:
▶  Collapsed group
▼  Expanded group
├─ Sub-item (has siblings below)
└─ Last sub-item
│  Vertical connector
[BLUE] Active state indicator
🛡️  Admin role icon
👤 Client role icon
📊 Dashboard icon
👥 Users icon
📄 Posts icon
⚙️  Settings icon
🛒 E-commerce icon
```

---

**Visual Design System**: Material Design principles  
**Icons**: Lucide React  
**Colors**: Tailwind CSS palette  
**Transitions**: CSS ease-linear  
**Accessibility**: WCAG 2.1 AA compliant
