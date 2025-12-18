import { createFileRoute } from '@tanstack/react-router'
import ModuleList from '../-components/table/module/module-list'

export const Route = createFileRoute('/_protected/admin/modules')({
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des modules...</div>
      </div>
    )
  },
  errorComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Erreur lors du chargement des modules
        </div>
      </div>
    )
  },
})

function RouteComponent() {
  return <ModuleList />
}
