import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePostStore } from '@/stores/post-store'
import type { Post } from '@/types/post'

interface DeletePostProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePost({ post, open, onOpenChange }: DeletePostProps) {
  const { deletePost, loading } = usePostStore()

  const handleDelete = async () => {
    if (!post) return

    const result = await deletePost(post.id)

    if (result.success) {
      toast.success(result.message || 'Post supprimé avec succès')
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la suppression du post')
    }
  }

  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            Êtes-vous sûr de vouloir supprimer le post{' '}
            <strong>"{post.title}"</strong> ? Cette action est irréversible et
            supprimera définitivement ce post de la base de données.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
