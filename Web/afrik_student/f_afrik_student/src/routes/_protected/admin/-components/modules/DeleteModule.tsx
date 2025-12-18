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
import { useModuleStore } from '@/stores/module-store'
import type { Module } from '@/types/module'

interface DeleteModuleProps {
  module: Module | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteModule({ module, open, onOpenChange }: DeleteModuleProps) {
  const { deleteModule, loading } = useModuleStore()

  const handleDelete = async () => {
    if (!module?.id) return

    const result = await deleteModule(module.id)

    if (result.success) {
      toast.success(result.message || 'Module supprimé avec succès')
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la suppression du module')
    }
  }

  if (!module) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le module{' '}
            <span className="font-semibold">"{module.title}"</span> ?
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
