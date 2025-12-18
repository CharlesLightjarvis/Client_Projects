import { createFileRoute } from '@tanstack/react-router'
import LessonList from '../-components/table/lesson/lesson-list'

export const Route = createFileRoute('/_protected/admin/lessons')({
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des leçons...</div>
      </div>
    )
  },
  errorComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Erreur lors du chargement des leçons
        </div>
      </div>
    )
  },
})

function RouteComponent() {
  return <LessonList />
}
