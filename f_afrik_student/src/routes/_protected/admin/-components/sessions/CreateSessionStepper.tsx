import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Stepper, StepperHeader, StepperContent } from '@/components/ui/stepper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSessionStore } from '@/stores/session-store'
import { useFormationStore } from '@/stores/formation-store'
import { useModuleStore } from '@/stores/module-store'
import { useUserStore } from '@/stores/user-store'
import {
  sessionBasicInfoSchema,
  sessionInstructorsSchema,
} from '@/schemas/session-schema'
import type {
  SessionBasicInfoSchema,
  SessionInstructorsSchema,
} from '@/schemas/session-schema'
import type { Module } from '@/types/module'
import type { User } from '@/types/user'

interface CreateSessionStepperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STEPS = [
  {
    id: 'basic-info',
    title: 'Informations',
    description: 'Détails de la session',
  },
  {
    id: 'instructors',
    title: 'Instructeurs',
    description: 'Affectation des instructeurs',
  },
]

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Planifiée' },
  { value: 'ongoing', label: 'En cours' },
  { value: 'completed', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
]

export function CreateSessionStepper({
  open,
  onOpenChange,
}: CreateSessionStepperProps) {
  const { createSession, loading } = useSessionStore()
  const { formations, fetchFormations } = useFormationStore()
  const { modules, fetchModules } = useModuleStore()
  const { users, fetchUsers } = useUserStore()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [basicInfoData, setBasicInfoData] =
    React.useState<SessionBasicInfoSchema | null>(null)
  const [selectedFormationId, setSelectedFormationId] =
    React.useState<string>('')
  const [formationModules, setFormationModules] = React.useState<Module[]>([])
  const [instructors, setInstructors] = React.useState<User[]>([])

  // Form for step 1 (basic info)
  const basicInfoForm = useForm<SessionBasicInfoSchema>({
    resolver: zodResolver(sessionBasicInfoSchema),
    defaultValues: {
      formation_id: '',
      start_date: '',
      end_date: '',
      status: 'scheduled',
      max_students: null,
      location: null,
    },
    mode: 'onChange',
  })

  // Form for step 2 (instructors)
  const instructorsForm = useForm<SessionInstructorsSchema>({
    resolver: zodResolver(sessionInstructorsSchema),
    defaultValues: {
      module_instructors: [],
    },
    mode: 'onChange',
  })

  // Fetch formations, modules and users when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchFormations()
      fetchModules()
      fetchUsers()
    }
  }, [open, fetchFormations, fetchModules, fetchUsers])

  // Filter instructors from users
  React.useEffect(() => {
    if (users.length > 0) {
      const filteredInstructors = users.filter(
        (user) => user.role === 'instructor',
      )
      setInstructors(filteredInstructors)
    } else {
      setInstructors([])
    }
  }, [users])

  // Filter modules by selected formation
  React.useEffect(() => {
    if (selectedFormationId && modules.length > 0) {
      const filtered = modules.filter(
        (module) => module.formation_id === selectedFormationId,
      )
      setFormationModules(filtered)
    } else {
      setFormationModules([])
    }
  }, [selectedFormationId, modules])

  // Watch formation_id changes
  React.useEffect(() => {
    const subscription = basicInfoForm.watch((value, { name }) => {
      if (name === 'formation_id' && value.formation_id) {
        setSelectedFormationId(value.formation_id)
      }
    })
    return () => subscription.unsubscribe()
  }, [basicInfoForm])

  // Handle next for basic info
  const handleBasicInfoNext = async () => {
    const isValid = await basicInfoForm.trigger()
    if (isValid) {
      const data = basicInfoForm.getValues()
      setBasicInfoData(data)
      setCurrentStep(1)
    }
  }

  // Handle previous
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle final submission
  const handleSubmit = async () => {
    if (!basicInfoData) {
      toast.error('Données de base manquantes')
      return
    }

    const instructorsData = instructorsForm.getValues()

    // Only include fields that have values (remove null/undefined)
    const dataToSend: any = {
      formation_id: basicInfoData.formation_id,
      start_date: basicInfoData.start_date,
      end_date: basicInfoData.end_date,
      module_instructors: instructorsData.module_instructors || [],
    }

    // Only add status if it's not null
    if (basicInfoData.status) {
      dataToSend.status = basicInfoData.status
    }

    // Only add max_students if it's not null
    if (basicInfoData.max_students !== null && basicInfoData.max_students !== undefined) {
      dataToSend.max_students = basicInfoData.max_students
    }

    // Only add location if it's not null
    if (basicInfoData.location) {
      dataToSend.location = basicInfoData.location
    }

    console.log('📦 Data to send:', dataToSend)

    const result = await createSession(dataToSend)

    if (result.success) {
      toast.success(result.message || 'Session créée avec succès')
      handleReset()
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la création de la session')

      // Show validation errors if any
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`)
          })
        })
      }
    }
  }

  // Reset everything
  const handleReset = () => {
    setCurrentStep(0)
    basicInfoForm.reset()
    instructorsForm.reset()
    setBasicInfoData(null)
    setSelectedFormationId('')
    setFormationModules([])
  }

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      handleReset()
    }
  }, [open])

  // Handle instructor change for a module
  const handleInstructorChange = (moduleId: string, instructorId: string) => {
    const currentAssignments =
      instructorsForm.getValues().module_instructors || []
    const existingIndex = currentAssignments.findIndex(
      (a) => a.module_id === moduleId,
    )

    if (existingIndex >= 0) {
      // Update existing assignment
      const updated = [...currentAssignments]
      updated[existingIndex] = {
        module_id: moduleId,
        instructor_id: instructorId,
      }
      instructorsForm.setValue('module_instructors', updated)
    } else {
      // Add new assignment
      instructorsForm.setValue('module_instructors', [
        ...currentAssignments,
        { module_id: moduleId, instructor_id: instructorId },
      ])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle session</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle session de
            formation
          </DialogDescription>
        </DialogHeader>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        >
          <StepperHeader />

          <div className="space-y-6">
            {/* STEP 0: Basic Info */}
            <StepperContent step={0}>
              <form className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="formation_id"
                    control={basicInfoForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="formation_id">
                          Formation
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loading}
                        >
                          <SelectTrigger id="formation_id">
                            <SelectValue placeholder="Sélectionnez une formation" />
                          </SelectTrigger>
                          <SelectContent>
                            {formations.map((formation) => (
                              <SelectItem
                                key={formation.id}
                                value={formation.id!}
                              >
                                {formation.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="start_date"
                      control={basicInfoForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="start_date">
                            Date de début
                          </FieldLabel>
                          <Input
                            {...field}
                            id="start_date"
                            type="date"
                            disabled={loading}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="end_date"
                      control={basicInfoForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="end_date">
                            Date de fin
                          </FieldLabel>
                          <Input
                            {...field}
                            id="end_date"
                            type="date"
                            disabled={loading}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="status"
                    control={basicInfoForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="status">Statut</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || 'scheduled'}
                          disabled={loading}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Sélectionnez un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="max_students"
                      control={basicInfoForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="max_students">
                            Nombre max d'étudiants
                          </FieldLabel>
                          <Input
                            {...field}
                            id="max_students"
                            type="number"
                            min={1}
                            max={100}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(
                                value === '' ? null : parseInt(value, 10),
                              )
                            }}
                            placeholder="Ex: 30"
                            disabled={loading}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="location"
                      control={basicInfoForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="location">Lieu</FieldLabel>
                          <Input
                            {...field}
                            id="location"
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                            placeholder="Ex: Salle A101"
                            disabled={loading}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>
              </form>
            </StepperContent>

            {/* STEP 1: Instructors */}
            <StepperContent step={1}>
              <div className="space-y-4">
                {formationModules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucun module trouvé pour cette formation.</p>
                    <p className="text-sm mt-2">
                      Les instructeurs ne seront pas affectés pour le moment.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>
                        Affectez un instructeur à chaque module (optionnel). Si
                        vous ne sélectionnez pas d'instructeur, les instructeurs
                        par défaut seront utilisés.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {formationModules.map((module) => (
                        <div
                          key={module.id}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{module.title}</h4>
                            {module.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {module.description}
                              </p>
                            )}
                          </div>

                          <div className="w-64">
                            <Select
                              onValueChange={(instructorId) =>
                                handleInstructorChange(module.id!, instructorId)
                              }
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner instructeur" />
                              </SelectTrigger>
                              <SelectContent>
                                {instructors.map((instructor) => (
                                  <SelectItem
                                    key={instructor.id}
                                    value={instructor.id.toString()}
                                  >
                                    {instructor.first_name}{' '}
                                    {instructor.last_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </StepperContent>
          </div>
        </Stepper>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={loading}
                >
                  Précédent
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Annuler
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleBasicInfoNext} disabled={loading}>
                  Suivant
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Création...' : 'Créer la session'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
