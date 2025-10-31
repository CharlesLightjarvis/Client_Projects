import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ShoppingBag,
  BarChart3,
  UserCircle,
  type LucideIcon,
} from 'lucide-react'
import type { UserRole } from '@/routes/__root'

export interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  allowedRoles: Array<Exclude<UserRole, null>>
  items?: {
    title: string
    url: string
    allowedRoles: Array<Exclude<UserRole, null>>
  }[]
}

export interface NavigationProject {
  name: string
  url: string
  icon: LucideIcon
  allowedRoles: Array<Exclude<UserRole, null>>
}

export const navigationMain: NavigationItem[] = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    isActive: true,
    allowedRoles: ['admin'],
    items: [
      {
        title: "Vue d'ensemble",
        url: '/admin/dashboard',
        allowedRoles: ['admin'],
      },
      {
        title: 'Statistiques',
        url: '/admin/stats',
        allowedRoles: ['admin'],
      },
      {
        title: 'Rapports',
        url: '/admin/reports',
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    title: 'Gestion des payements',
    url: '/admin/payments',
    icon: Users,
    allowedRoles: ['admin'],
    items: [
      {
        title: 'Tous les payements',
        url: '/admin/payments',
        allowedRoles: ['admin'],
      },
      {
        title: 'Ajouter un utilisateur',
        url: '/admin/users/add',
        allowedRoles: ['admin'],
      },
      {
        title: 'Rôles et permissions',
        url: '/admin/users/roles',
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    title: 'Gestion des posts',
    url: '/admin/posts',
    icon: FileText,
    allowedRoles: ['admin'],
    items: [
      {
        title: 'Tous les posts',
        url: '/admin/posts',
        allowedRoles: ['admin'],
      },
      {
        title: 'Créer un post',
        url: '/admin/posts/create',
        allowedRoles: ['admin'],
      },
      {
        title: 'Catégories',
        url: '/admin/posts/categories',
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    title: 'Paramètres',
    url: '/admin/settings',
    icon: Settings,
    allowedRoles: ['admin'],
    items: [
      {
        title: 'Général',
        url: '/admin/settings',
        allowedRoles: ['admin'],
      },
      {
        title: 'Sécurité',
        url: '/admin/settings/security',
        allowedRoles: ['admin'],
      },
      {
        title: 'Notifications',
        url: '/admin/settings/notifications',
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    title: 'Mon espace',
    url: '/client',
    icon: UserCircle,
    isActive: true,
    allowedRoles: ['client'],
    items: [
      {
        title: 'Tableau de bord',
        url: '/client/dashboard',
        allowedRoles: ['client'],
      },
      {
        title: 'Mon profil',
        url: '/client/profile',
        allowedRoles: ['client'],
      },
    ],
  },
  {
    title: 'Mes posts',
    url: '/client/posts',
    icon: FileText,
    allowedRoles: ['client'],
    items: [
      {
        title: 'Tous mes posts',
        url: '/client/posts',
        allowedRoles: ['client'],
      },
      {
        title: 'Brouillons',
        url: '/client/posts/drafts',
        allowedRoles: ['client'],
      },
    ],
  },
  {
    title: 'Paramètres',
    url: '/client/settings',
    icon: Settings,
    allowedRoles: ['client'],
    items: [
      {
        title: 'Mon compte',
        url: '/client/settings',
        allowedRoles: ['client'],
      },
      {
        title: 'Préférences',
        url: '/client/settings/preferences',
        allowedRoles: ['client'],
      },
    ],
  },
]

export const navigationProjects: NavigationProject[] = [
  {
    name: 'Analytiques',
    url: '/admin/analytics',
    icon: BarChart3,
    allowedRoles: ['admin'],
  },
  {
    name: 'E-commerce',
    url: '/admin/ecommerce',
    icon: ShoppingBag,
    allowedRoles: ['admin'],
  },
  {
    name: 'Mes activités',
    url: '/client/activities',
    icon: BarChart3,
    allowedRoles: ['client'],
  },
]
