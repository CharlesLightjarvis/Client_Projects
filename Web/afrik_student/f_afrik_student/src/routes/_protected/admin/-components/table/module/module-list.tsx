import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useModules } from '@/hooks/use-modules'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useEffect, useState, useRef } from 'react'
import { CreateModuleStepper } from '../../modules/CreateModuleStepper'
import { UpdateModuleStepper } from '../../modules/UpdateModuleStepper'
import { DeleteModule } from '../../modules/DeleteModule'
import type { Module } from '@/types/module'
import { toast } from 'sonner'
import { PERMISSIONS } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Blocks } from 'lucide-react'

export default function ModuleList() {
  const { modules, loading, fetchModules } = useModules()
  const { can } = usePermissions()
  const hasFetched = useRef(false)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  useEffect(() => {
    if (!hasFetched.current) {
      fetchModules()
      hasFetched.current = true
    }
  }, [fetchModules])

  const handleEdit = (module: Module) => {
    if (!can.update('module')) {
      toast.error("Vous n'avez pas la permission de modifier les modules")
      return
    }
    setSelectedModule(module)
    setUpdateDialogOpen(true)
  }

  const handleDelete = (module: Module) => {
    if (!can.delete('module')) {
      toast.error("Vous n'avez pas la permission de supprimer les modules")
      return
    }
    setSelectedModule(module)
    setDeleteDialogOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (loading && modules.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des modules...</p>
        </div>
      </div>
    )
  }

  if (!loading && modules.length === 0) {
    return (
      <>
        <div className="container mx-auto space-y-6 p-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Gestion des modules</h1>
            <p className="text-muted-foreground">
              Créez, modifiez et gérez tous les modules de vos formations
            </p>
          </div>

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <Blocks className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Aucun module pour le moment
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Vous n'avez pas encore créé de module. Commencez par ajouter votre
                premier module.
              </p>
              {can.create('module') && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Blocks className="mr-2 h-4 w-4" />
                  Créer un module
                </Button>
              )}
            </div>
          </div>
        </div>

        <PermissionGuard permissions={PERMISSIONS.MODULE.CREATE}>
          <CreateModuleStepper open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </PermissionGuard>
      </>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des modules</h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez tous les modules de vos formations
          </p>
        </div>

        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={modules}
            searchFilter={{
              columnId: 'title',
              placeholder: 'Rechercher par titre...',
            }}
            actionButton={
              can.create('module')
                ? {
                    label: 'Ajouter un module',
                    onClick: () => setCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        </div>
      </div>

      <PermissionGuard permissions={PERMISSIONS.MODULE.CREATE}>
        <CreateModuleStepper open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.MODULE.UPDATE}>
        <UpdateModuleStepper
          module={selectedModule}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.MODULE.DELETE}>
        <DeleteModule
          module={selectedModule}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </PermissionGuard>
    </>
  )
}
