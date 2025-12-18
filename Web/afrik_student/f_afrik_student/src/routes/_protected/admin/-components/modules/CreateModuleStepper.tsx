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
import { z } from 'zod'
import type { CreateLessonData } from '@/types/lesson'

interface CreateModuleStepperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
    description: 'Créer les leçons',
  },
]

// Schema for lesson
const lessonSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  content: z.string().nullable().optional(),
})

type LessonFormData = z.infer<typeof lessonSchema>

const lessonDefaultValues: LessonFormData = {
  title: '',
  content: null,
}

// Schema for module (without lessons)
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

const moduleDefaultValues: ModuleFormData = {
  formation_id: '',
  title: '',
  description: '',
  order: 1,
}

export function CreateModuleStepper({
  open,
  onOpenChange,
}: CreateModuleStepperProps) {
  const { createModule, loading } = useModuleStore()
  const { formations, fetchFormations } = useFormationStore()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [lessonCount, setLessonCount] = React.useState(0)
  const [currentLessonIndex, setCurrentLessonIndex] = React.useState(0)
  const [showLessonForm, setShowLessonForm] = React.useState(false)
  const [moduleData, setModuleData] = React.useState<ModuleFormData | null>(
    null,
  )
  const [lessonsData, setLessonsData] = React.useState<CreateLessonData[]>([])

  // Form for module
  const moduleForm = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: moduleDefaultValues,
    mode: 'onChange',
  })

  // Form for lesson (reused for each lesson)
  const lessonForm = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lessonDefaultValues,
    mode: 'onChange',
  })

  // Handle next for module step
  const handleModuleNext = async () => {
    const isValid = await moduleForm.trigger()
    if (isValid) {
      setModuleData(moduleForm.getValues())
      setCurrentStep(1)
    }
  }

  // Handle setting lesson count and showing first lesson form
  const handleSetLessonCount = () => {
    if (lessonCount > 0) {
      setShowLessonForm(true)
      setCurrentLessonIndex(0)
      lessonForm.reset(lessonsData[0] || lessonDefaultValues)
    } else {
      toast.error('Veuillez saisir au moins 1 leçon')
    }
  }

  // Handle next for lesson
  const handleLessonNext = async () => {
    const isValid = await lessonForm.trigger()
    if (isValid) {
      const lessonData: CreateLessonData = {
        ...lessonForm.getValues(),
        order: currentLessonIndex + 1,
      }

      // Save lesson data
      const newLessonsData = [...lessonsData]
      newLessonsData[currentLessonIndex] = lessonData
      setLessonsData(newLessonsData)

      // Move to next lesson or submit
      if (currentLessonIndex < lessonCount - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1)
        // Load next lesson data if exists, otherwise reset form
        if (newLessonsData[currentLessonIndex + 1]) {
          lessonForm.reset(newLessonsData[currentLessonIndex + 1])
        } else {
          lessonForm.reset(lessonDefaultValues)
        }
      } else {
        // All lessons filled, submit
        handleSubmit(newLessonsData)
      }
    }
  }

  // Handle previous in lesson forms
  const handleLessonPrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      // Load previous lesson data
      lessonForm.reset(
        lessonsData[currentLessonIndex - 1] || lessonDefaultValues,
      )
    } else {
      // Go back to lesson count selection
      setShowLessonForm(false)
      setCurrentLessonIndex(0)
    }
  }

  // Handle previous step
  const handlePrev = () => {
    if (currentStep === 1 && !showLessonForm) {
      setCurrentStep(0)
    } else if (currentStep === 1 && showLessonForm) {
      handleLessonPrev()
    }
  }

  // Handle final submission
  const handleSubmit = async (finalLessonsData: CreateLessonData[]) => {
    if (!moduleData) {
      toast.error('Données du module manquantes')
      return
    }

    const dataToSend = {
      formation_id: moduleData.formation_id,
      title: moduleData.title,
      description: moduleData.description,
      order: moduleData.order,
      lessons: finalLessonsData,
    }

    console.log('📦 Data to send:', dataToSend)

    const result = await createModule(dataToSend)

    if (result.success) {
      toast.success(result.message || 'Module créé avec succès')
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
    moduleForm.reset(moduleDefaultValues)
    lessonForm.reset(lessonDefaultValues)
    setCurrentStep(0)
    setLessonCount(0)
    setCurrentLessonIndex(0)
    setShowLessonForm(false)
    setModuleData(null)
    setLessonsData([])
  }

  // Fetch formations when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchFormations()
    }
  }, [open, fetchFormations])

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
          <DialogTitle>Créer un nouveau module</DialogTitle>
          <DialogDescription>
            Créez un module avec ses leçons en 2 étapes simples
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
              <form className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="formation_id"
                    control={moduleForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="formation_id">Formation</FieldLabel>
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
                              <SelectItem key={formation.id} value={formation.id!}>
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
                {!showLessonForm ? (
                  // Lesson count selection
                  <>
                    <div>
                      <h3 className="text-lg font-medium">Leçons du module</h3>
                      <p className="text-sm text-muted-foreground">
                        Combien de leçons voulez-vous créer pour ce module ?
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={lessonCount}
                        onChange={(e) =>
                          setLessonCount(parseInt(e.target.value) || 0)
                        }
                        placeholder="Nombre de leçons"
                        disabled={loading}
                      />
                    </div>

                    {lessonCount > 0 && (
                      <div className="p-3 rounded-lg border bg-muted/30">
                        <p className="text-sm">
                          Vous allez créer {lessonCount} leçon
                          {lessonCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  // Lesson form
                  <form className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <h3 className="text-lg font-medium">
                        Leçon {currentLessonIndex + 1} sur {lessonCount}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lessonsData.filter(Boolean).length}/{lessonCount}{' '}
                        leçons créées
                      </p>
                    </div>

                    <FieldGroup>
                      <Controller
                        name="title"
                        control={lessonForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lesson-title">
                              Titre de la leçon
                            </FieldLabel>
                            <Input
                              {...field}
                              id="lesson-title"
                              placeholder="Ex: Introduction aux composants"
                              disabled={loading}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="content"
                        control={lessonForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lesson-content">
                              Contenu (optionnel)
                            </FieldLabel>
                            <Textarea
                              {...field}
                              value={field.value || ''}
                              id="lesson-content"
                              placeholder="Contenu de la leçon..."
                              rows={4}
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
                )}
              </div>
            </StepperContent>
          </div>

          <DialogFooter className="gap-2">
            {(currentStep > 0 || (currentStep === 1 && showLessonForm)) && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={loading}
              >
                Précédent
              </Button>
            )}

            {currentStep === 0 && (
              <Button
                type="button"
                onClick={handleModuleNext}
                disabled={loading}
              >
                Suivant
              </Button>
            )}

            {currentStep === 1 && !showLessonForm && (
              <Button
                type="button"
                onClick={handleSetLessonCount}
                disabled={loading || lessonCount === 0}
              >
                Commencer
              </Button>
            )}

            {currentStep === 1 && showLessonForm && (
              <Button
                type="button"
                onClick={handleLessonNext}
                disabled={loading}
              >
                {currentLessonIndex === lessonCount - 1
                  ? loading
                    ? 'Création...'
                    : 'Créer le module'
                  : 'Suivant'}
              </Button>
            )}
          </DialogFooter>
        </Stepper>
      </DialogContent>
    </Dialog>
  )
}
