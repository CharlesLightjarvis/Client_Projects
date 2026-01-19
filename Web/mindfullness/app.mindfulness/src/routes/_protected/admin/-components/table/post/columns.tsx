import { type Post } from '@/types/post'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { usePermissions } from '@/hooks/use-permissions'

interface ColumnsProps {
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Post>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return (
        <div className="max-w-[500px] truncate" title={description}>
          {description}
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { can } = usePermissions()

      // Check if user has general permissions for update/delete
      const hasUpdatePermission = can.update('post')
      const hasDeletePermission = can.delete('post')

      // Check if user has specific permissions for this post based on policies
      const canUpdateThisPost =
        hasUpdatePermission && (post.policies?.can_update ?? false)
      const canDeleteThisPost =
        hasDeletePermission && (post.policies?.can_delete ?? false)

      // Si l'utilisateur n'a ni permission d'éditer ni de supprimer, ne pas afficher la colonne
      if (!canUpdateThisPost && !canDeleteThisPost) {
        return null
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canUpdateThisPost && (
              <DropdownMenuItem onClick={() => onEdit(post)}>
                Edit post
              </DropdownMenuItem>
            )}
            {canDeleteThisPost && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(post)}
              >
                Delete post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Export default columns for backward compatibility
export const columns: ColumnDef<Post>[] = createColumns({
  onEdit: () => {},
  onDelete: () => {},
})
