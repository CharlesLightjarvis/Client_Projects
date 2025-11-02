import { createFileRoute } from '@tanstack/react-router'
import { useUsers } from '@/hooks/use-users'
import { useEffect } from 'react'
import UserList from '../-components/table/user/user-list'

export const Route = createFileRoute('/_protected/admin/users')({
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des utilisateurs...</div>
      </div>
    )
  },
  errorComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Erreur lors du chargement des utilisateurs
        </div>
      </div>
    )
  },
})

function RouteComponent() {
  const { users, loading, fetchUsers } = useUsers()

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading && users.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return <UserList />
}
