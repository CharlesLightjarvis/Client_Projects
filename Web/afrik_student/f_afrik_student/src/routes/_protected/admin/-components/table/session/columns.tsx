import { type Session } from '@/types/session'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Users, UserPlus } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { cn } from '@/lib/utils'

interface ColumnsProps {
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onViewEnrolled: (session: Session) => void
  onEnrollStudents: (session: Session) => void
}

const statusColors: Record<string, string> = {
  scheduled: 'text-blue-600 bg-blue-50 border-blue-200',
  ongoing: 'text-green-600 bg-green-50 border-green-200',
  completed: 'text-gray-600 bg-gray-50 border-gray-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
}

export const createColumns = ({
  onEdit,
  onDelete,
  onViewEnrolled,
  onEnrollStudents,
}: ColumnsProps): ColumnDef<Session>[] => [
  {
    id: 'formation',
    accessorFn: (row) => row.formation?.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Formation" />
    ),
    cell: ({ row }) => {
      const formation = row.original.formation
      return <div className="font-medium">{formation?.title || '-'}</div>
    },
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de Début" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('start_date'))
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
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de Fin" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('end_date'))
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const statusLabel = row.original.statusLabel
      if (!status) return <div className="text-sm">-</div>
      return (
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-md border px-2.5 py-0.5',
            statusColors[status] || 'text-gray-600 bg-gray-50 border-gray-200',
          )}
        >
          <span className="text-xs font-medium">{statusLabel || status}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'enrolled_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inscrits / Max" />
    ),
    cell: ({ row }) => {
      const session = row.original
      return (
        <div className="text-sm">
          {session.enrolled_count} / {session.max_students}
        </div>
      )
    },
  },

  {
    id: 'instructors',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Instructeurs" />
    ),
    cell: ({ row }) => {
      const session = row.original
      const instructors = session.current_instructors || []
      if (instructors.length === 0) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      return (
        <div className="max-w-[200px]">
          {instructors.map((mi, idx) => (
            <div key={idx} className="text-sm">
              {mi.instructor
                ? `${mi.instructor.first_name} ${mi.instructor.last_name}`
                : '-'}
              {mi.module && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({mi.module.title})
                </span>
              )}
            </div>
          ))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const session = row.original

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
            <DropdownMenuItem onClick={() => onViewEnrolled(session)}>
              <Users className="mr-2 h-4 w-4" />
              Voir les inscrits
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEnrollStudents(session)}
              disabled={session.is_full}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Inscrire des étudiants
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(session)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(session)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
