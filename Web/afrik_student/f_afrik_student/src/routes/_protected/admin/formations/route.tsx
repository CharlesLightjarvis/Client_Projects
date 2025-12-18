import { createFileRoute } from '@tanstack/react-router'
import FormationList from '../-components/table/formation/formation-list'

export const Route = createFileRoute('/_protected/admin/formations')({
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des formations...</div>
      </div>
    )
  },
  errorComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Erreur lors du chargement des formations
        </div>
      </div>
    )
  },
})

function RouteComponent() {
  return <FormationList />
}
