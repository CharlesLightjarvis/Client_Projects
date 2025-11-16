import { type User, roles } from '@/types/user'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, UserCircle } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { cn } from '@/lib/utils'

// Helper pour obtenir l'icône selon le rôle
const getRoleIcon = (role: string | null) => {
  const roleConfig = roles.find((r) => r.value === role)
  return roleConfig?.icon || UserCircle
}

// Couleurs subtiles pour les rôles (compatibles dark mode)
const roleStyles: Record<string, string> = {
  admin:
    'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50',
  instructor:
    'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50',
  student:
    'text-green-700 dark:text-green-400  dark:bg-green-150/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50',
}

interface ColumnsProps {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: 'first_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium max-w-[150px] truncate">
          {row.getValue('first_name')}
        </div>
      )
    },
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium max-w-[150px] truncate">
          {row.getValue('last_name')}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="lowercase max-w-[200px] truncate">
          {row.getValue('email')}
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
    cell: ({ row }) => {
      const user = row.original
      const roleConfig = roles.find((r) => r.value === user.role)
      const roleLabel = user.roleLabel || roleConfig?.label || 'N/A'
      const RoleIcon = getRoleIcon(user.role)

      if (!user.role) return <div className="text-sm">-</div>

      return (
        <Badge
          variant="outline"
          className={cn(
            'gap-1.5',
            roleStyles[user.role] || 'text-gray-600 bg-gray-50 border-gray-200',
          )}
        >
          <RoleIcon className="size-3" />
          {roleLabel}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de Création" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="text-sm">
          {date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(user)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
