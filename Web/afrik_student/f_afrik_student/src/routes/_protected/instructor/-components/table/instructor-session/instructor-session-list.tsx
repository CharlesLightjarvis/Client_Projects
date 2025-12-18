import { instructorSessionColumns } from './instructor-session-columns'
import { DataTable } from '@/components/ui/data-table'
import { useInstructorSessions } from '@/hooks/use-instructor-sessions'
import { useEffect, useRef } from 'react'
import { Calendar } from 'lucide-react'

export function InstructorSessionList() {
  const { sessions, loading, fetchSessions } = useInstructorSessions()
  const hasFetched = useRef(false)

  // Load sessions on mount (only once)
  useEffect(() => {
    if (!hasFetched.current) {
      fetchSessions()
      hasFetched.current = true
    }
  }, [fetchSessions])

  // Loading state
  if (loading && sessions.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg">Chargement des sessions...</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state - no sessions yet
  if (!loading && sessions.length === 0) {
    return (
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mes Sessions</h1>
          <p className="text-muted-foreground">
            Consultez et gérez vos sessions de formation
          </p>
        </div>

        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Calendar className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              Aucune session pour le moment
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Vous n'avez pas encore de sessions de formation assignées. Les sessions
              vous seront attribuées par l'administrateur.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mes Sessions</h1>
        <p className="text-muted-foreground">
          Consultez et gérez vos sessions de formation
        </p>
      </div>

      <div className="space-y-4">
        <DataTable
          columns={instructorSessionColumns}
          data={sessions}
          searchFilter={{
            columnId: 'formation',
            placeholder: 'Rechercher par formation...',
          }}
        />
      </div>
    </div>
  )
}
