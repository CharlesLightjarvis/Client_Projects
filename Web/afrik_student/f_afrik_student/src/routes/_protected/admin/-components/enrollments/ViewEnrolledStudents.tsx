import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { enrollmentService } from '@/services/enrollment-service'
import type { EnrolledStudent } from '@/types/enrollment'
import type { Session } from '@/types/session'
import { toast } from 'sonner'
import { UserPlus, Users, UserMinus, Search } from 'lucide-react'

interface ViewEnrolledStudentsProps {
  session: Session | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEnrollClick?: () => void
}

export function ViewEnrolledStudents({
  session,
  open,
  onOpenChange,
  onEnrollClick,
}: ViewEnrolledStudentsProps) {
  const [students, setStudents] = React.useState<EnrolledStudent[]>([])
  const [selectedEnrollmentIds, setSelectedEnrollmentIds] = React.useState<
    string[]
  >([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [unenrolling, setUnenrolling] = React.useState(false)

  // Fetch enrolled students when dialog opens
  React.useEffect(() => {
    if (open && session) {
      fetchEnrolledStudents()
    }
  }, [open, session])

  // Reset selection when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSelectedEnrollmentIds([])
      setSearchQuery('')
    }
  }, [open])

  const fetchEnrolledStudents = async () => {
    if (!session) return

    setLoading(true)
    try {
      const data = await enrollmentService.getSessionStudents(session.id)
      setStudents(data)
      console.log('✅ Enrolled students fetched:', data.length)
      console.log('📋 Students data:', data.map(s => ({
        name: `${s.first_name} ${s.last_name}`,
        id: s.id,
        enrollment_id: s.enrollment_id
      })))
    } catch (error: any) {
      console.error('❌ Failed to fetch enrolled students:', error.message)
      toast.error('Erreur lors du chargement des étudiants inscrits')
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on search query
  const filteredStudents = React.useMemo(() => {
    if (!searchQuery) return students

    const query = searchQuery.toLowerCase()
    return students.filter(
      (student) =>
        student.first_name.toLowerCase().includes(query) ||
        student.last_name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query),
    )
  }, [students, searchQuery])

  // Get filtered IDs
  const filteredIds = React.useMemo(
    () => filteredStudents.map((s) => s.enrollment_id),
    [filteredStudents],
  )

  // Check selection states
  const allSelected = React.useMemo(
    () =>
      filteredStudents.length > 0 &&
      filteredIds.every((id) => selectedEnrollmentIds.includes(id)),
    [filteredIds, selectedEnrollmentIds, filteredStudents.length],
  )

  const someSelected = React.useMemo(
    () =>
      filteredIds.some((id) => selectedEnrollmentIds.includes(id)) &&
      !allSelected,
    [filteredIds, selectedEnrollmentIds, allSelected],
  )

  // Handle student selection toggle
  const toggleStudent = (enrollmentId: string) => {
    console.log('🔄 Toggle student:', enrollmentId)
    setSelectedEnrollmentIds((prev) => {
      const isSelected = prev.includes(enrollmentId)
      const newSelection = isSelected
        ? prev.filter((id) => id !== enrollmentId)
        : [...prev, enrollmentId]
      console.log('📌 Previous selection:', prev)
      console.log('📌 New selection:', newSelection)
      return newSelection
    })
  }

  // Handle select all / deselect all
  const toggleSelectAll = () => {
    if (allSelected) {
      // Deselect only filtered IDs
      setSelectedEnrollmentIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id)),
      )
    } else {
      // Select all filtered IDs (merge with existing selection)
      setSelectedEnrollmentIds((prev) => {
        const newIds = filteredIds.filter((id) => !prev.includes(id))
        return [...prev, ...newIds]
      })
    }
  }

  // Handle unenrollment
  const handleUnenroll = async () => {
    if (!session || selectedEnrollmentIds.length === 0) {
      toast.error('Veuillez sélectionner au moins un étudiant')
      return
    }

    setUnenrolling(true)
    try {
      if (selectedEnrollmentIds.length === 1) {
        // Single unenrollment
        await enrollmentService.unenrollStudents({
          enrollment_id: selectedEnrollmentIds[0],
        })
        toast.success('Étudiant désinscrit avec succès')
      } else {
        // Bulk unenrollment
        await enrollmentService.unenrollStudents({
          enrollment_ids: selectedEnrollmentIds,
        })
        toast.success(
          `${selectedEnrollmentIds.length} étudiants désinscrits avec succès`,
        )
      }

      // Refresh the list
      await fetchEnrolledStudents()
      setSelectedEnrollmentIds([])
    } catch (error: any) {
      console.error('❌ Failed to unenroll students:', error.message)
      toast.error('Erreur lors de la désinscription des étudiants')
    } finally {
      setUnenrolling(false)
    }
  }

  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Étudiants inscrits
          </DialogTitle>
          <DialogDescription>
            Session:{' '}
            <span className="font-semibold">{session.formation.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Header avec stats */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total inscrits</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Places disponibles
              </p>
              <p className="text-2xl font-bold">
                {session.max_students - students.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacité max</p>
              <p className="text-2xl font-bold">{session.max_students}</p>
            </div>
          </div>

          {/* Search bar */}
          {students.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Stats */}
          {students.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                {filteredStudents.length} étudiant
                {filteredStudents.length > 1 ? 's' : ''} affiché
                {filteredStudents.length > 1 ? 's' : ''}
              </p>
              <p className="font-medium">
                {selectedEnrollmentIds.length} sélectionné
                {selectedEnrollmentIds.length > 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Liste des étudiants */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chargement des étudiants...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Aucun étudiant inscrit</p>
              <p className="text-sm mt-2">
                Commencez par inscrire des étudiants à cette session
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Aucun étudiant trouvé</p>
              <p className="text-sm mt-2">Essayez une autre recherche</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto border rounded-lg">
              {/* Select all header */}
              <div className="sticky top-0 bg-muted/50 border-b p-3 flex items-center gap-3">
                <Checkbox
                  checked={
                    allSelected ? true : someSelected ? 'indeterminate' : false
                  }
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">
                  {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                </span>
                {someSelected && !allSelected && (
                  <span className="text-xs text-muted-foreground">
                    ({selectedEnrollmentIds.length} sélectionné
                    {selectedEnrollmentIds.length > 1 ? 's' : ''})
                  </span>
                )}
              </div>

              {/* Students */}
              <div className="divide-y">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleStudent(student.enrollment_id)}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedEnrollmentIds.includes(
                          student.enrollment_id,
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <div className="flex gap-2">
            {selectedEnrollmentIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleUnenroll}
                disabled={unenrolling}
                className="gap-2"
              >
                {unenrolling ? (
                  'Désinscription...'
                ) : (
                  <>
                    <UserMinus className="h-4 w-4" />
                    Désinscrire ({selectedEnrollmentIds.length})
                  </>
                )}
              </Button>
            )}
            {!session.is_full && onEnrollClick && (
              <Button onClick={onEnrollClick} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Inscrire des étudiants
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
