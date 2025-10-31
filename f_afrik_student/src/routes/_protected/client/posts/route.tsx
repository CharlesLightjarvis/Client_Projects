import { usePosts } from '@/hooks/use-posts'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import PostList from '../../admin/-components/table/post/post-list'

export const Route = createFileRoute('/_protected/client/posts')({
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des posts...</div>
      </div>
    )
  },
  errorComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">Erreur lors du chargement</div>
      </div>
    )
  },
})

function RouteComponent() {
  const { posts, loading, fetchPosts } = usePosts()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    await fetchPosts()
  }

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des posts...</p>
        </div>
      </div>
    )
  }

  return <PostList />
}
