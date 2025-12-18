import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useInstructorLessons } from '@/hooks/use-instructor-lessons'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useEffect, useState, useRef } from 'react'
import { CreateLessonStepper } from '../../lessons/CreateLessonStepper'
import { UpdateLessonStepper } from '../../lessons/UpdateLessonStepper'
import { DeleteLesson } from '../../lessons/DeleteLesson'
import type { Lesson } from '@/types/lesson'
import { toast } from 'sonner'
import { PERMISSIONS } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { BookText } from 'lucide-react'

export default function LessonList() {
  const { lessons, loading, fetchLessons } = useInstructorLessons()
  const { can } = usePermissions()
  const hasFetched = useRef(false)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    if (!hasFetched.current) {
      fetchLessons()
      hasFetched.current = true
    }
  }, [fetchLessons])

  const handleEdit = (lesson: Lesson) => {
    if (!can.update('lesson')) {
      toast.error("Vous n'avez pas la permission de modifier les leçons")
      return
    }
    setSelectedLesson(lesson)
    setUpdateDialogOpen(true)
  }

  const handleDelete = (lesson: Lesson) => {
    if (!can.delete('lesson')) {
      toast.error("Vous n'avez pas la permission de supprimer les leçons")
      return
    }
    setSelectedLesson(lesson)
    setDeleteDialogOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (loading && lessons.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des leçons...</p>
        </div>
      </div>
    )
  }

  if (!loading && lessons.length === 0) {
    return (
      <>
        <div className="container mx-auto space-y-6 p-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Gestion des leçons</h1>
            <p className="text-muted-foreground">
              Créez, modifiez et gérez toutes les leçons de vos modules
            </p>
          </div>

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <BookText className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Aucune leçon pour le moment
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Vous n'avez pas encore créé de leçon. Commencez par ajouter votre
                première leçon.
              </p>
              {can.create('lesson') && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <BookText className="mr-2 h-4 w-4" />
                  Créer une leçon
                </Button>
              )}
            </div>
          </div>
        </div>

        <PermissionGuard permissions={PERMISSIONS.LESSON.CREATE}>
          <CreateLessonStepper open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </PermissionGuard>
      </>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des leçons</h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez toutes les leçons de vos modules
          </p>
        </div>

        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={lessons}
            searchFilter={{
              columnId: 'title',
              placeholder: 'Rechercher par titre...',
            }}
            actionButton={
              can.create('lesson')
                ? {
                    label: 'Ajouter une leçon',
                    onClick: () => setCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        </div>
      </div>

      <PermissionGuard permissions={PERMISSIONS.LESSON.CREATE}>
        <CreateLessonStepper open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.LESSON.UPDATE}>
        <UpdateLessonStepper
          lesson={selectedLesson}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.LESSON.DELETE}>
        <DeleteLesson
          lesson={selectedLesson}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </PermissionGuard>
    </>
  )
}
