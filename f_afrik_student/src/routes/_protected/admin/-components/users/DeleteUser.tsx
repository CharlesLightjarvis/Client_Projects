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
import { useUserStore } from '@/stores/user-store'
import type { User } from '@/types/user'

interface DeleteUserProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteUser({ user, open, onOpenChange }: DeleteUserProps) {
  const { deleteUser, loading } = useUserStore()

  const handleDelete = async () => {
    if (!user) return

    const result = await deleteUser(user.id.toString())

    if (result.success) {
      toast.success(result.message || 'Utilisateur supprimé avec succès')
      onOpenChange(false)
    } else {
      toast.error(result.message || "Erreur lors de la suppression de l'utilisateur")
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            <span className="font-semibold">
              {user.first_name} {user.last_name}
            </span>{' '}
            ({user.email}) ?
            <br />
            <br />
            Cette action est <span className="font-semibold text-destructive">
              irréversible
            </span>
            .
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
