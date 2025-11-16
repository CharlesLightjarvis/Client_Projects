import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useFormations } from '@/hooks/use-formations'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useEffect, useState, useRef } from 'react'
import { CreateFormationStepper } from '../../formations/CreateFormationStepper'
import { UpdateFormationStepper } from '../../formations/UpdateFormationStepper'
import { DeleteFormation } from '../../formations/DeleteFormation'
import type { Formation } from '@/types/formation'
import { toast } from 'sonner'
import { PERMISSIONS } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { PackagePlus } from 'lucide-react'

export default function FormationList() {
  const { formations, loading, fetchFormations } = useFormations()
  const { can } = usePermissions()
  const hasFetched = useRef(false)

  // Dialog state management
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null)

  // Load formations on mount (only once)
  useEffect(() => {
    if (!hasFetched.current) {
      fetchFormations()
      hasFetched.current = true
    }
  }, [fetchFormations])

  // Handle edit action with permission check
  const handleEdit = (formation: Formation) => {
    if (!can.update('formation')) {
      toast.error("Vous n'avez pas la permission de modifier les formations")
      return
    }
    setSelectedFormation(formation)
    setUpdateDialogOpen(true)
  }

  // Handle delete action with permission check
  const handleDelete = (formation: Formation) => {
    if (!can.delete('formation')) {
      toast.error("Vous n'avez pas la permission de supprimer les formations")
      return
    }
    setSelectedFormation(formation)
    setDeleteDialogOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  // Loading state
  if (loading && formations.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des formations...</p>
        </div>
      </div>
    )
  }

  // Empty state - no formations yet
  if (!loading && formations.length === 0) {
    return (
      <>
        <div className="container mx-auto space-y-6 p-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestion des formations
            </h1>
            <p className="text-muted-foreground">
              Créez, modifiez et gérez toutes les formations de la plateforme
            </p>
          </div>

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <PackagePlus className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Aucune formation pour le moment
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Vous n'avez pas encore créé de formation. Commencez par ajouter votre
                première formation.
              </p>
              {can.create('formation') && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Créer une formation
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Dialog component for creating */}
        <PermissionGuard permissions={PERMISSIONS.FORMATION.CREATE}>
          <CreateFormationStepper
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
          />
        </PermissionGuard>
      </>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des formations
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez toutes les formations de la plateforme
          </p>
        </div>

        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={formations}
            searchFilter={{
              columnId: 'title',
              placeholder: 'Rechercher par titre...',
            }}
            actionButton={
              can.create('formation')
                ? {
                    label: 'Ajouter une formation',
                    onClick: () => setCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* Dialog components wrapped in PermissionGuard */}
      <PermissionGuard permissions={PERMISSIONS.FORMATION.CREATE}>
        <CreateFormationStepper
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.FORMATION.UPDATE}>
        <UpdateFormationStepper
          formation={selectedFormation}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.FORMATION.DELETE}>
        <DeleteFormation
          formation={selectedFormation}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </PermissionGuard>
    </>
  )
}
