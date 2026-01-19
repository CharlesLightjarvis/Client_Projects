import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ShoppingBag,
  BarChart3,
  UserCircle,
  BookOpen,
  Award,
  type LucideIcon,
  Layers,
  Boxes,
  Brackets,
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
  // ============= ADMIN =============
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin'],
  },
  {
    title: 'Gestion des utilisateurs',
    url: '/admin/users',
    icon: Users,
    allowedRoles: ['admin'],
  },
  {
    title: 'Gestion des formations',
    url: '/admin/formations',
    icon: BookOpen,
    allowedRoles: ['admin'],
  },
  {
    title: 'Gestion des Modules',
    url: '/admin/modules',
    icon: Layers,
    allowedRoles: ['admin'],
  },
  {
    title: 'Gestion des Leçons',
    url: '/admin/lessons',
    icon: Boxes,
    allowedRoles: ['admin'],
  },
  {
    title: 'Gestion des Sessions',
    url: '/admin/sessions',
    icon: Brackets,
    allowedRoles: ['admin'],
  },
  {
    title: 'Gestion des paiements',
    url: '/admin/payments',
    icon: ShoppingBag,
    allowedRoles: ['admin'],
    items: [
      {
        title: 'Tous les paiements',
        url: '/admin/payments',
        allowedRoles: ['admin'],
      },
      {
        title: 'Paiements en attente',
        url: '/admin/payments/pending',
        allowedRoles: ['admin'],
      },
      {
        title: 'Historique',
        url: '/admin/payments/history',
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

  // ============= CLIENT =============
  {
    title: 'Dashboard',
    url: '/client/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['client'],
  },
  {
    title: 'Mes formations',
    url: '/client/formations',
    icon: BookOpen,
    allowedRoles: ['client'],
  },
  {
    title: 'Mes certifications',
    url: '/client/certificates',
    icon: Award,
    allowedRoles: ['client'],
    items: [
      {
        title: 'Mes certificats',
        url: '/client/certificates',
        allowedRoles: ['client'],
      },
      {
        title: "En cours d'obtention",
        url: '/client/certificates/pending',
        allowedRoles: ['client'],
      },
    ],
  },
  {
    title: 'Mon profil',
    url: '/client/profile',
    icon: UserCircle,
    allowedRoles: ['client'],
    items: [
      {
        title: 'Informations personnelles',
        url: '/client/profile',
        allowedRoles: ['client'],
      },
      {
        title: 'Mes paiements',
        url: '/client/profile/payments',
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
  // ADMIN
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
  // CLIENT
  {
    name: 'Mon parcours',
    url: '/client/learning-path',
    icon: BarChart3,
    allowedRoles: ['client'],
  },
  {
    name: 'Mes quiz',
    url: '/client/quiz',
    icon: FileText,
    allowedRoles: ['client'],
  },
]
