import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { enrollmentService } from '@/services/enrollment-service'
import type { User } from '@/types/user'
import type { Session } from '@/types/session'
import { toast } from 'sonner'
import { Search, UserPlus } from 'lucide-react'

interface EnrollStudentsProps {
  session: Session | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EnrollStudents({
  session,
  open,
  onOpenChange,
  onSuccess,
}: EnrollStudentsProps) {
  const [availableStudents, setAvailableStudents] = React.useState<User[]>([])
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>(
    [],
  )
  const [searchQuery, setSearchQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Fetch available students when dialog opens
  React.useEffect(() => {
    if (open && session) {
      fetchAvailableStudents()
    }
  }, [open, session])

  // Reset selection when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSelectedStudentIds([])
      setSearchQuery('')
    }
  }, [open])

  const fetchAvailableStudents = async () => {
    if (!session) return

    setLoading(true)
    try {
      const data = await enrollmentService.getAvailableStudents(session.id)
      setAvailableStudents(data)
      console.log('✅ Available students fetched:', data.length)
    } catch (error: any) {
      console.error('❌ Failed to fetch available students:', error.message)
      toast.error('Erreur lors du chargement des étudiants disponibles')
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on search query
  const filteredStudents = React.useMemo(() => {
    if (!searchQuery) return availableStudents

    const query = searchQuery.toLowerCase()
    return availableStudents.filter(
      (student) =>
        student.first_name.toLowerCase().includes(query) ||
        student.last_name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query),
    )
  }, [availableStudents, searchQuery])

  // Handle student selection toggle
  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    )
  }

  // Handle select all / deselect all
  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id.toString()))
    }
  }

  // Handle enrollment submission
  const handleEnroll = async () => {
    if (!session || selectedStudentIds.length === 0) {
      toast.error('Veuillez sélectionner au moins un étudiant')
      return
    }

    setSubmitting(true)
    try {
      if (selectedStudentIds.length === 1) {
        // Single enrollment
        await enrollmentService.enrollStudent({
          student_id: selectedStudentIds[0],
          course_session_id: session.id,
        })
        toast.success('Étudiant inscrit avec succès')
      } else {
        // Bulk enrollment
        await enrollmentService.bulkEnrollStudents({
          student_ids: selectedStudentIds,
          course_session_id: session.id,
        })
        toast.success(
          `${selectedStudentIds.length} étudiants inscrits avec succès`,
        )
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      console.error('❌ Failed to enroll students:', error.message)
      toast.error("Erreur lors de l'inscription des étudiants")
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) return null

  const allSelected =
    filteredStudents.length > 0 &&
    selectedStudentIds.length === filteredStudents.length
  const someSelected =
    selectedStudentIds.length > 0 &&
    selectedStudentIds.length < filteredStudents.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Inscrire des étudiants
          </DialogTitle>
          <DialogDescription>
            Session:{' '}
            <span className="font-semibold">{session.formation.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              {filteredStudents.length} étudiant
              {filteredStudents.length > 1 ? 's' : ''} disponible
              {filteredStudents.length > 1 ? 's' : ''}
            </p>
            <p className="font-medium">
              {selectedStudentIds.length} sélectionné
              {selectedStudentIds.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Students list */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chargement des étudiants...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">
                {searchQuery
                  ? 'Aucun étudiant trouvé'
                  : 'Aucun étudiant disponible'}
              </p>
              <p className="text-sm mt-2">
                {searchQuery
                  ? 'Essayez une autre recherche'
                  : 'Tous les étudiants sont déjà inscrits'}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto border rounded-lg">
              {/* Select all header */}
              <div className="sticky top-0 bg-muted/50 border-b p-3 flex items-center gap-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  ref={(el) => {
                    if (el) {
                      ;(el as HTMLInputElement).indeterminate = someSelected
                    }
                  }}
                />
                <span className="text-sm font-medium">
                  {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                </span>
              </div>

              {/* Students */}
              <div className="divide-y">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleStudent(student.id.toString())}
                  >
                    <Checkbox
                      checked={selectedStudentIds.includes(
                        student.id.toString(),
                      )}
                      onCheckedChange={() =>
                        toggleStudent(student.id.toString())
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={selectedStudentIds.length === 0 || submitting}
          >
            {submitting
              ? 'Inscription...'
              : `Inscrire ${selectedStudentIds.length > 0 ? `(${selectedStudentIds.length})` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
