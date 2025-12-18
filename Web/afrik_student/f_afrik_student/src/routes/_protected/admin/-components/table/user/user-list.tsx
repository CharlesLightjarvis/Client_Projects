import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useUsers } from '@/hooks/use-users'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useEffect, useState, useRef } from 'react'
import { CreateUser } from '../../users/CreateUser'
import { UpdateUser } from '../../users/UpdateUser'
import { DeleteUser } from '../../users/DeleteUser'
import { roles, type User } from '@/types/user'
import { toast } from 'sonner'
import { PERMISSIONS } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

export default function UserList() {
  const { users, loading, fetchUsers } = useUsers()
  const { can } = usePermissions()
  const hasFetched = useRef(false)

  // Dialog state management
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Load users on mount (only once)
  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers()
      hasFetched.current = true
    }
  }, [fetchUsers])

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

  // Empty state - no users yet
  if (!loading && users.length === 0) {
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

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <UserPlus className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Aucun utilisateur pour le moment
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Vous n'avez pas encore créé d'utilisateur. Commencez par ajouter votre
                premier utilisateur.
              </p>
              {can.create('user') && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Créer un utilisateur
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Dialog component for creating */}
        <PermissionGuard permissions={PERMISSIONS.USER.CREATE}>
          <CreateUser open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </PermissionGuard>
      </>
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
