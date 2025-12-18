import { createFileRoute } from '@tanstack/react-router'
import { InstructorSessionList } from '../-components/table/instructor-session/instructor-session-list'

export const Route = createFileRoute('/_protected/instructor/sessions')({
  component: InstructorSessionsPage,
  pendingComponent: () => (
    <div className="flex h-[450px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex h-[450px] items-center justify-center rounded-lg border border-red-200 bg-red-50">
      <div className="text-center">
        <p className="text-sm font-medium text-red-600">
          {error?.message || 'Une erreur est survenue'}
        </p>
      </div>
    </div>
  ),
})

function InstructorSessionsPage() {
  return <InstructorSessionList />
}
