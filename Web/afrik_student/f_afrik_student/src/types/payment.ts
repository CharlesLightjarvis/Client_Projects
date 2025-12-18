import {
  HelpCircle,
  Circle,
  Timer,
  CheckCircle,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
} from 'lucide-react'

// ✅ 1. Tableau des statuts
export const statuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: HelpCircle,
  },
  {
    value: 'processing',
    label: 'Processing',
    icon: Circle,
  },
  {
    value: 'success',
    label: 'Success',
    icon: Timer,
  },
  {
    value: 'failed',
    label: 'Failed',
    icon: CheckCircle,
  },
] as const

// ✅ 2. Type dérivé automatiquement
export type Statuses = (typeof statuses)[number]['value']
// → "pending" | "processing" | "success" | "failed"

// ✅ 3. Tableau des priorités
export const priorities = [
  {
    value: 'low',
    label: 'Low',
    icon: ArrowDown,
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: AlertTriangle,
  },
  {
    value: 'high',
    label: 'High',
    icon: ArrowUp,
  },
] as const

// ✅ 4. Type dérivé automatiquement
export type Priorities = (typeof priorities)[number]['value']
// → "low" | "medium" | "high"

// ✅ 5. Type Payment complet
export type Payment = {
  id: string
  name: string
  surname: string
  amount: number
  status: Statuses
  priority: Priorities
  email: string
}

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]
