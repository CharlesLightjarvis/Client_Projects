import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { usePosts } from '@/hooks/use-posts'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useEffect, useState } from 'react'
import { CreatePost } from '../../posts/CreatePost'
import { UpdatePost } from '../../posts/UpdatePost'
import { DeletePost } from '../../posts/DeletePost'
import type { Post } from '@/types/post'
import { toast } from 'sonner'
import { PERMISSIONS } from '@/lib/permissions'

export default function PostList() {
  const { posts, loading, fetchPosts } = usePosts()
  const { can } = usePermissions()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleEdit = (post: Post) => {
    if (!can.update('post')) {
      toast.error("Vous n'avez pas la permission de modifier ce post")
      return
    }
    setSelectedPost(post)
    setUpdateDialogOpen(true)
  }

  const handleDelete = (post: Post) => {
    if (!can.delete('post')) {
      toast.error("Vous n'avez pas la permission de supprimer ce post")
      return
    }
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des posts...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des posts
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez tous vos posts en un seul endroit
          </p>
        </div>
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={posts}
            searchFilter={{
              columnId: 'title',
              placeholder: 'Filter by title...',
            }}
            actionButton={
              can.create('post')
                ? {
                    label: 'Add Post',
                    onClick: () => setCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        </div>
      </div>

      <PermissionGuard permissions={PERMISSIONS.POST.CREATE}>
        <CreatePost
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.POST.UPDATE}>
        <UpdatePost
          post={selectedPost}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.POST.DELETE}>
        <DeletePost
          post={selectedPost}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </PermissionGuard>
    </>
  )
}
