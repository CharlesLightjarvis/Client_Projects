import { createFileRoute } from '@tanstack/react-router'
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
  return <UserList />
}
