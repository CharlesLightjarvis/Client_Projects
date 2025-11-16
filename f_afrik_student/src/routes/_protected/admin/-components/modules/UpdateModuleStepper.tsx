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
import { useModuleStore } from '@/stores/module-store'
import { useLessonStore } from '@/stores/lesson-store'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { Module } from '@/types/module'

// Update schema for module
const updateModuleSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional(),
  description: z
    .string()
    .min(10, 'La description requiert au moins 10 caractères')
    .max(1000, 'La description ne doit pas dépasser 1000 caractères')
    .nullable()
    .optional(),
  order: z.number().min(1, "L'ordre doit être au moins 1").optional(),
})

type UpdateModuleFormData = z.infer<typeof updateModuleSchema>

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
    description: 'Sélection optionnelle',
  },
]

export function UpdateModuleStepper({
  open,
  onOpenChange,
  module,
}: UpdateModuleStepperProps) {
  const { updateModule, loading } = useModuleStore()
  const { lessons: existingLessons, fetchLessons } = useLessonStore()
  const [currentStep, setCurrentStep] = React.useState(0)

  // State for selected existing lessons (just IDs)
  const [selectedLessonIds, setSelectedLessonIds] = React.useState<string[]>([])

  // Initialize form
  const form = useForm<UpdateModuleFormData>({
    resolver: zodResolver(updateModuleSchema),
    defaultValues: {
      title: '',
      description: '',
      order: 1,
    },
    mode: 'onChange',
  })

  // Fetch lessons and populate form when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchLessons()
      if (module) {
        // Populate form with existing module data
        form.reset({
          title: module.title,
          description: module.description,
          order: module.order,
        })

        // Pre-select existing lessons
        if (module.lessons) {
          setSelectedLessonIds(
            module.lessons
              .map((l) => l.id)
              .filter((id): id is string => id !== undefined),
          )
        }
      }
    }
  }, [open, fetchLessons, module, form])

  // Validate current step
  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 0) {
      const fields: (keyof UpdateModuleFormData)[] = ['title']
      const result = await form.trigger(fields)
      return result
    }
    return true
  }

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
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

  // Transform form data to API format
  const transformFormData = (data: UpdateModuleFormData) => {
    const transformedData: any = {
      ...data,
      lesson_ids: selectedLessonIds,
    }

    delete transformedData.lessons

    return transformedData
  }

  // Handle form submission
  const onSubmit = async (data: UpdateModuleFormData) => {
    // Only allow submission at the last step
    if (currentStep !== STEPS.length - 1) {
      console.log(
        '⚠️ Submission blocked - not at last step. Current step:',
        currentStep,
      )
      return
    }

    if (!module?.id) {
      toast.error('Module introuvable')
      return
    }

    console.log('✅ Submitting form at step:', currentStep)
    console.log('📦 Original data:', data)

    // Transform data before sending
    const transformedData = transformFormData(data)
    console.log('📦 Transformed data:', transformedData)

    const result = await updateModule(module.id, transformedData)

    if (result.success) {
      toast.success(result.message || 'Module mis à jour avec succès')
      form.reset()
      setCurrentStep(0)
      setSelectedLessonIds([])
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof UpdateModuleFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset({
        title: '',
        description: '',
        order: 1,
      })
      setCurrentStep(0)
      setSelectedLessonIds([])
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le module</DialogTitle>
          <DialogDescription>
            Modifiez les informations du module en 2 étapes simples
          </DialogDescription>
        </DialogHeader>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        >
          <StepperHeader />

          <form
            id="module-update-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* STEP 1: Basic Information */}
            <StepperContent step={0}>
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
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
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
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
                  control={form.control}
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
            </StepperContent>

            {/* STEP 2: Lessons */}
            <StepperContent step={1}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Leçons du module</h3>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez des leçons existantes à ajouter à ce module
                    (optionnel)
                  </p>
                </div>

                {existingLessons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Aucune leçon disponible. Créez des leçons d'abord dans la
                      section Leçons.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2 max-h-[400px] overflow-y-auto p-1">
                    {existingLessons.map((lesson) => {
                      const isSelected = selectedLessonIds.includes(lesson.id!)
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedLessonIds((prev) =>
                                prev.filter((id) => id !== lesson.id),
                              )
                            } else {
                              setSelectedLessonIds((prev) => [
                                ...prev,
                                lesson.id!,
                              ])
                            }
                          }}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                            isSelected
                              ? 'bg-primary/10 border-primary border-2'
                              : 'bg-background hover:bg-muted/50',
                          )}
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
                            <Check className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Preview selected lessons */}
                {selectedLessonIds.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm font-medium mb-2">
                      Leçons sélectionnées ({selectedLessonIds.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLessonIds.map((lessonId) => {
                        const lesson = existingLessons.find(
                          (l) => l.id === lessonId,
                        )
                        if (!lesson) return null
                        return (
                          <div
                            key={lessonId}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-xs"
                          >
                            <Check className="h-3 w-3 text-primary" />
                            <span>{lesson.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </StepperContent>

            {/* Hidden submit button */}
            <button
              type="submit"
              id="module-update-submit-btn"
              className="hidden"
              aria-hidden="true"
            />
          </form>

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
              <Button type="button" onClick={handleNext} disabled={loading}>
                Suivant
              </Button>
            ) : (
              <Button
                type="button"
                disabled={loading}
                onClick={() => {
                  document.getElementById('module-update-submit-btn')?.click()
                }}
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
