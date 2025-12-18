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
import { useFormationStore } from '@/stores/formation-store'
import type { Formation } from '@/types/formation'

interface DeleteFormationProps {
  formation: Formation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteFormation({
  formation,
  open,
  onOpenChange,
}: DeleteFormationProps) {
  const { deleteFormation, loading } = useFormationStore()

  const handleDelete = async () => {
    if (!formation) return

    const result = await deleteFormation(formation.id)

    if (result.success) {
      toast.success(result.message || 'Formation supprimée avec succès')
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la suppression de la formation')
    }
  }

  if (!formation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la formation{' '}
            <span className="font-semibold">"{formation.title}"</span> ?
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
