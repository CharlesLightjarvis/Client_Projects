import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useLessonStore } from '@/stores/lesson-store'
import type { Lesson } from '@/types/lesson'

interface DeleteLessonProps {
  lesson: Lesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteLesson({ lesson, open, onOpenChange }: DeleteLessonProps) {
  const { deleteLesson, loading } = useLessonStore()

  const handleDelete = async () => {
    if (!lesson?.id) return

    const result = await deleteLesson(lesson.id)

    if (result.success) {
      toast.success(result.message || 'Leçon supprimée avec succès')
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la suppression de la leçon')
    }
  }

  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la leçon{' '}
            <span className="font-semibold">"{lesson.title}"</span> ?
            <br />
            <br />
            Cette action est{' '}
            <span className="font-semibold text-destructive">irréversible</span>.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
