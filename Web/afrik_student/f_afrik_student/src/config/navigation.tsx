import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ShoppingBag,
  BarChart3,
  UserCircle,
  BookOpen,
  GraduationCap,
  Award,
  FolderOpen,
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

  // ============= INSTRUCTOR =============
  {
    title: 'Dashboard',
    url: '/instructor/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['instructor'],
  },
  {
    title: 'Mes Sessions',
    url: '/instructor/sessions',
    icon: Brackets,
    allowedRoles: ['instructor'],
  },
  {
    title: 'Gestion des Leçons',
    url: '/instructor/lessons',
    icon: Boxes,
    allowedRoles: ['instructor'],
  },
  {
    title: 'Mes étudiants',
    url: '/instructor/students',
    icon: GraduationCap,
    allowedRoles: ['instructor'],
    items: [
      {
        title: 'Tous les étudiants',
        url: '/instructor/students',
        allowedRoles: ['instructor'],
      },
      {
        title: 'Progressions',
        url: '/instructor/students/progress',
        allowedRoles: ['instructor'],
      },
      {
        title: 'Questions reçues',
        url: '/instructor/students/questions',
        allowedRoles: ['instructor'],
      },
    ],
  },
  {
    title: 'Mes ressources',
    url: '/instructor/resources',
    icon: FolderOpen,
    allowedRoles: ['instructor'],
    items: [
      {
        title: 'Tous les documents',
        url: '/instructor/resources',
        allowedRoles: ['instructor'],
      },
      {
        title: 'Ajouter une ressource',
        url: '/instructor/resources/create',
        allowedRoles: ['instructor'],
      },
    ],
  },
  {
    title: 'Paramètres',
    url: '/instructor/settings',
    icon: Settings,
    allowedRoles: ['instructor'],
    items: [
      {
        title: 'Mon profil',
        url: '/instructor/settings',
        allowedRoles: ['instructor'],
      },
      {
        title: 'Préférences',
        url: '/instructor/settings/preferences',
        allowedRoles: ['instructor'],
      },
    ],
  },

  // ============= STUDENT =============
  {
    title: 'Dashboard',
    url: '/student/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['student'],
  },
  {
    title: 'Mes formations',
    url: '/student/formations',
    icon: BookOpen,
    allowedRoles: ['student'],
  },
  {
    title: 'Mes certifications',
    url: '/student/certificates',
    icon: Award,
    allowedRoles: ['student'],
    items: [
      {
        title: 'Mes certificats',
        url: '/student/certificates',
        allowedRoles: ['student'],
      },
      {
        title: "En cours d'obtention",
        url: '/student/certificates/pending',
        allowedRoles: ['student'],
      },
    ],
  },
  {
    title: 'Mon profil',
    url: '/student/profile',
    icon: UserCircle,
    allowedRoles: ['student'],
    items: [
      {
        title: 'Informations personnelles',
        url: '/student/profile',
        allowedRoles: ['student'],
      },
      {
        title: 'Mes paiements',
        url: '/student/profile/payments',
        allowedRoles: ['student'],
      },
    ],
  },
  {
    title: 'Paramètres',
    url: '/student/settings',
    icon: Settings,
    allowedRoles: ['student'],
    items: [
      {
        title: 'Mon compte',
        url: '/student/settings',
        allowedRoles: ['student'],
      },
      {
        title: 'Préférences',
        url: '/student/settings/preferences',
        allowedRoles: ['student'],
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
  // INSTRUCTOR
  {
    name: 'Mes activités',
    url: '/instructor/activities',
    icon: BarChart3,
    allowedRoles: ['instructor'],
  },
  {
    name: 'Mes évaluations',
    url: '/instructor/evaluations',
    icon: FileText,
    allowedRoles: ['instructor'],
  },
  // STUDENT
  {
    name: 'Mon parcours',
    url: '/student/learning-path',
    icon: BarChart3,
    allowedRoles: ['student'],
  },
  {
    name: 'Mes quiz',
    url: '/student/quiz',
    icon: FileText,
    allowedRoles: ['student'],
  },
]
