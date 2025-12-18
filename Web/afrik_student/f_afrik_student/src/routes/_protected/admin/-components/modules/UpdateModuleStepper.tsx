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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Stepper, StepperHeader, StepperContent } from '@/components/ui/stepper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModuleStore } from '@/stores/module-store'
import { useFormationStore } from '@/stores/formation-store'
import { useLessonStore } from '@/stores/lesson-store'
import { z } from 'zod'
import type { Module } from '@/types/module'
import { Badge } from '@/components/ui/badge'
import { XIcon } from 'lucide-react'

interface UpdateModuleStepperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  module: Module | null
}

const STEPS = [
  {
    id: 'basic-info',
    title: 'Informations',
    description: 'Détails du module',
  },
  {
    id: 'lessons',
    title: 'Leçons',
    description: 'Gérer les leçons',
  },
]

// Schema for module
const moduleSchema = z.object({
  formation_id: z.string().min(1, 'Veuillez sélectionner une formation'),
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z
    .string()
    .min(10, 'La description requiert au moins 10 caractères')
    .max(1000, 'La description ne doit pas dépasser 1000 caractères')
    .nullable()
    .optional(),
  order: z.number().min(1, "L'ordre doit être au moins 1"),
})

type ModuleFormData = z.infer<typeof moduleSchema>

export function UpdateModuleStepper({
  open,
  onOpenChange,
  module,
}: UpdateModuleStepperProps) {
  const { updateModule, loading } = useModuleStore()
  const { formations, fetchFormations } = useFormationStore()
  const { lessons: existingLessons, fetchLessons } = useLessonStore()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [lessonsToDelete, setLessonsToDelete] = React.useState<string[]>([])
  const [lessonsToAdd, setLessonsToAdd] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')

  // Form for module
  const moduleForm = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      formation_id: '',
      title: '',
      description: '',
      order: 1,
    },
    mode: 'onChange',
  })

  // Handle next for module step
  const handleNext = async () => {
    const isValid = await moduleForm.trigger()
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle delete lesson from module
  const handleDeleteLesson = (lessonId: string) => {
    setLessonsToDelete((prev) => [...prev, lessonId])
  }

  // Check if lesson is marked for deletion
  const isMarkedForDeletion = (lessonId: string) => {
    return lessonsToDelete.includes(lessonId)
  }

  // Handle toggle lesson (add or remove from selection)
  const handleToggleLesson = (lessonId: string) => {
    if (lessonsToAdd.includes(lessonId)) {
      setLessonsToAdd((prev) => prev.filter((id) => id !== lessonId))
    } else {
      setLessonsToAdd((prev) => [...prev, lessonId])
    }
  }

  // Check if lesson is selected to add
  const isSelectedToAdd = (lessonId: string) => {
    return lessonsToAdd.includes(lessonId)
  }

  // Check if lesson already belongs to module
  const lessonBelongsToModule = (lessonId: string) => {
    return module?.lessons?.some((l) => l.id === lessonId) || false
  }

  // Calculate total lessons after changes
  const calculateTotalLessons = () => {
    const currentLessons = module?.lessons?.length || 0
    return currentLessons - lessonsToDelete.length + lessonsToAdd.length
  }

  // Filter lessons by search query
  const filteredAvailableLessons = existingLessons
    .filter((lesson) => !lessonBelongsToModule(lesson.id!))
    .filter((lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

  // Handle final submission (called directly, not as form submit handler)
  const handleSubmit = async () => {
    console.log('🔴 handleSubmit appelé')

    if (!module?.id) {
      toast.error('Module introuvable')
      return
    }

    const data = moduleForm.getValues()

    // Build lessons array for adding existing lessons to this module
    const lessonsToAddData = lessonsToAdd.map((lessonId) => {
      const lesson = existingLessons.find((l) => l.id === lessonId)
      return {
        id: lessonId,
        title: lesson?.title || '',
        content: lesson?.content || null,
        order: lesson?.order || 1,
        module_id: module.id, // Assign these lessons to this module
      }
    })

    const dataToSend = {
      ...data,
      lessons: lessonsToAddData.length > 0 ? lessonsToAddData : undefined,
      delete_lessons: lessonsToDelete.length > 0 ? lessonsToDelete : undefined,
    }

    console.log('📦 Data to send:', dataToSend)

    const result = await updateModule(module.id, dataToSend)

    if (result.success) {
      toast.success(result.message || 'Module mis à jour avec succès')
      handleReset()
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
    }
  }

  // Reset all forms and state
  const handleReset = () => {
    moduleForm.reset({
      formation_id: '',
      title: '',
      description: '',
      order: 1,
    })
    setCurrentStep(0)
    setLessonsToDelete([])
    setLessonsToAdd([])
  }

  // Fetch formations and lessons, populate form when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchFormations()
      fetchLessons()
      if (module) {
        moduleForm.reset({
          formation_id: module.formation_id || '',
          title: module.title,
          description: module.description,
          order: module.order,
        })
      }
    }
  }, [open, fetchFormations, fetchLessons, module, moduleForm])

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      handleReset()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le module</DialogTitle>
          <DialogDescription>
            Modifiez le module et créez de nouvelles leçons en 2 étapes simples
          </DialogDescription>
        </DialogHeader>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        >
          <StepperHeader />

          <div className="space-y-6">
            {/* STEP 0: Module Information */}
            <StepperContent step={0}>
              <form
                onSubmit={(e) => {
                  console.log('🟡 Form step 0 onSubmit déclenché')
                  e.preventDefault()
                  handleNext()
                }}
                className="space-y-4"
              >
                <FieldGroup>
                  <Controller
                    name="formation_id"
                    control={moduleForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="formation_id">
                          Formation
                        </FieldLabel>
                        <Select
                          key={module?.id}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
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

                  <Controller
                    name="title"
                    control={moduleForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">Titre du module</FieldLabel>
                        <Input
                          {...field}
                          id="title"
                          placeholder="Ex: Introduction à React"
                          disabled={loading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="description"
                    control={moduleForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">
                          Description
                        </FieldLabel>
                        <Textarea
                          {...field}
                          value={field.value || ''}
                          id="description"
                          placeholder="Description du module..."
                          rows={4}
                          disabled={loading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="order"
                    control={moduleForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="order">Ordre</FieldLabel>
                        <Input
                          {...field}
                          id="order"
                          type="number"
                          min={1}
                          placeholder="Position dans la formation"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                          disabled={loading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </StepperContent>

            {/* STEP 1: Lessons */}
            <StepperContent step={1}>
              <div className="space-y-4">
                {/* Lesson Count Summary */}
                <div className="p-4 rounded-lg border bg-primary/5 border-primary/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Leçons dans ce module
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {calculateTotalLessons()}
                      </p>
                    </div>
                    {(lessonsToAdd.length > 0 || lessonsToDelete.length > 0) && (
                      <div className="text-right">
                        {lessonsToAdd.length > 0 && (
                          <p className="text-sm text-green-600 font-medium">
                            +{lessonsToAdd.length} à ajouter
                          </p>
                        )}
                        {lessonsToDelete.length > 0 && (
                          <p className="text-sm text-destructive font-medium">
                            -{lessonsToDelete.length} à supprimer
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing Lessons */}
                {module?.lessons && module.lessons.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      Leçons actuelles
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => {
                        const markedForDeletion = isMarkedForDeletion(lesson.id!)
                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 border rounded-lg ${markedForDeletion ? 'opacity-50 bg-muted/20' : 'bg-muted/30'}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">
                                  {lesson.title}
                                </p>
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  Ordre {lesson.order}
                                </Badge>
                                {markedForDeletion && (
                                  <Badge variant="destructive" className="text-xs shrink-0">
                                    À supprimer
                                  </Badge>
                                )}
                              </div>
                              {lesson.content && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                  {lesson.content}
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleDeleteLesson(lesson.id!)}
                              size="icon"
                              variant={markedForDeletion ? 'default' : 'destructive'}
                              className="size-8 shrink-0 ml-2"
                              aria-label={markedForDeletion ? 'Annuler la suppression' : 'Supprimer'}
                              disabled={markedForDeletion}
                            >
                              <XIcon className="size-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Add Existing Lessons */}
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Ajouter des leçons existantes
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sélectionnez des leçons déjà créées pour les ajouter à ce module
                  </p>

                  {/* Search Bar */}
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Rechercher une leçon..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {filteredAvailableLessons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? `Aucune leçon trouvée pour "${searchQuery}"`
                          : 'Aucune leçon disponible. Toutes les leçons sont déjà dans ce module ou créez-en de nouvelles.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-2 max-h-[400px] overflow-y-auto p-1">
                        {filteredAvailableLessons.map((lesson) => {
                            const isSelected = isSelectedToAdd(lesson.id!)
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => handleToggleLesson(lesson.id!)}
                                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-primary/10 border-primary border-2'
                                    : 'bg-background hover:bg-muted/50'
                                }`}
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {lesson.title}
                                  </p>
                                  {lesson.content && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {lesson.content}
                                    </p>
                                  )}
                                </div>
                                {isSelected && (
                                  <Badge variant="default" className="ml-2 shrink-0">
                                    ✓ Sélectionnée
                                  </Badge>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </StepperContent>
          </div>

          <DialogFooter className="gap-2">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={loading}
              >
                Précédent
              </Button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={() => {
                  console.log('🟢 Bouton Suivant cliqué')
                  handleNext()
                }}
                disabled={loading}
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  console.log('🟢 Bouton Mettre à jour cliqué')
                  handleSubmit()
                }}
                disabled={loading}
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour le module'}
              </Button>
            )}
          </DialogFooter>
        </Stepper>
      </DialogContent>
    </Dialog>
  )
}
