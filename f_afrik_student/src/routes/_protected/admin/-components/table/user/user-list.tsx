import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useUsers } from '@/hooks/use-users'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useEffect, useState } from 'react'
import { CreateUser } from '../../users/CreateUser'
import { UpdateUser } from '../../users/UpdateUser'
import { DeleteUser } from '../../users/DeleteUser'
import { roles, type User } from '@/types/user'
import { toast } from 'sonner'
import { PERMISSIONS } from '@/lib/permissions'

export default function UserList() {
  const { users, loading, fetchUsers } = useUsers()
  const { can } = usePermissions()

  // Dialog state management
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Load users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle edit action with permission check
  const handleEdit = (user: User) => {
    if (!can.update('user')) {
      toast.error("Vous n'avez pas la permission de modifier les utilisateurs")
      return
    }
    setSelectedUser(user)
    setUpdateDialogOpen(true)
  }

  // Handle delete action with permission check
  const handleDelete = (user: User) => {
    if (!can.delete('user')) {
      toast.error("Vous n'avez pas la permission de supprimer les utilisateurs")
      return
    }
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez tous les utilisateurs de la plateforme
          </p>
        </div>

        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={users}
            searchFilter={{
              columnId: 'email',
              placeholder: 'Rechercher par email...',
            }}
            facetedFilters={[
              {
                columnId: 'role',
                title: 'Rôle',
                options: roles,
              },
            ]}
            actionButton={
              can.create('user')
                ? {
                    label: 'Ajouter un utilisateur',
                    onClick: () => setCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* Dialog components wrapped in PermissionGuard */}
      <PermissionGuard permissions={PERMISSIONS.USER.CREATE}>
        <CreateUser
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.USER.UPDATE}>
        <UpdateUser
          user={selectedUser}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.USER.DELETE}>
        <DeleteUser
          user={selectedUser}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </PermissionGuard>
    </>
  )
}
