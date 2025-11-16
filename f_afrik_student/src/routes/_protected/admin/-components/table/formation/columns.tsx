import { type Formation } from '@/types/formation'
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
import { MoreHorizontal, Clock } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'

interface ColumnsProps {
  onEdit: (formation: Formation) => void
  onDelete: (formation: Formation) => void
}

// Helper pour formater le prix
const formatPrice = (price: number | null) => {
  if (price === null) return 'Gratuit'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

// Helper pour la couleur du badge de niveau
const getLevelBadgeVariant = (level: string): 'default' | 'secondary' | 'destructive' => {
  switch (level) {
    case 'easy':
      return 'secondary'
    case 'medium':
      return 'default'
    case 'hard':
      return 'destructive'
    default:
      return 'default'
  }
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Formation>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Titre" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('title')}</div>
    },
  },
  {
    id: 'level',
    accessorFn: (row) => row.level?.label,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Niveau" />,
    cell: ({ row }) => {
      const level = row.original.level
      if (!level) return <div>-</div>
      return (
        <Badge variant={getLevelBadgeVariant(level.value)}>
          {level.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Durée" />,
    cell: ({ row }) => {
      const duration = row.getValue('duration') as number
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{duration}h</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prix" />,
    cell: ({ row }) => {
      const price = row.getValue('price') as number | null
      return <div className="text-sm font-medium">{formatPrice(price)}</div>
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue('description') as string | null
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground" title={description || ''}>
          {description || '-'}
        </div>
      )
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
      const formation = row.original

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
            <DropdownMenuItem onClick={() => onEdit(formation)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(formation)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
