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
import { useSessionStore } from '@/stores/session-store'
import type { Session } from '@/types/session'

interface DeleteSessionProps {
  session: Session | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSession({ session, open, onOpenChange }: DeleteSessionProps) {
  const { deleteSession, loading } = useSessionStore()

  const handleDelete = async () => {
    if (!session) return

    const result = await deleteSession(session.id)

    if (result.success) {
      toast.success(result.message || 'Session supprimée avec succès')
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la suppression de la session')
    }
  }

  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la session de formation{' '}
            <span className="font-semibold">"{session.formation.title}"</span>
            {session.current_instructors && session.current_instructors.length > 0 && (
              <>
                {' '}avec {session.current_instructors.length > 1 ? 'les instructeurs' : "l'instructeur"}{' '}
                <span className="font-semibold">
                  {session.current_instructors
                    .map((mi) =>
                      mi.instructor
                        ? `${mi.instructor.first_name} ${mi.instructor.last_name}`
                        : ''
                    )
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </>
            )}
            ?
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
