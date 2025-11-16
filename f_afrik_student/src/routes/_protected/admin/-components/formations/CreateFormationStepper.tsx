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
import { Badge } from '@/components/ui/badge'
import { Stepper, StepperHeader, StepperContent } from '@/components/ui/stepper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createFormationSchema,
  createFormationDefaultValues,
  type CreateFormationFormData,
} from '@/schemas/formation-schema'
import { useFormationStore } from '@/stores/formation-store'
import { FormationLevel } from '@/types/formation'
import { Trash2 } from 'lucide-react'

interface CreateFormationStepperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STEPS = [
  {
    id: 'title-description',
    title: 'Titre et description',
    description: 'Informations de base',
  },
  {
    id: 'objectives-skills',
    title: 'Objectifs et compétences',
    description: 'Apprentissage ciblé',
  },
  {
    id: 'details',
    title: 'Détails',
    description: 'Niveau, durée, prix et image',
  },
  {
    id: 'review',
    title: 'Révision',
    description: 'Vérifier et créer',
  },
]

const LEVEL_LABELS: Record<FormationLevel, string> = {
  [FormationLevel.EASY]: 'Facile',
  [FormationLevel.MEDIUM]: 'Moyen',
  [FormationLevel.HARD]: 'Difficile',
}

export function CreateFormationStepper({
  open,
  onOpenChange,
}: CreateFormationStepperProps) {
  const { createFormation, loading } = useFormationStore()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [skillInput, setSkillInput] = React.useState('')

  // Initialize form
  const form = useForm<CreateFormationFormData>({
    resolver: zodResolver(createFormationSchema),
    defaultValues: createFormationDefaultValues,
    mode: 'onChange',
  })

  // Handle adding skill
  const handleAddSkill = () => {
    if (!skillInput.trim()) return
    const currentSkills = form.getValues('target_skills') || []
    if (!currentSkills.includes(skillInput.trim())) {
      form.setValue('target_skills', [...currentSkills, skillInput.trim()])
      setSkillInput('')
    }
  }

  // Handle removing skill
  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues('target_skills') || []
    form.setValue(
      'target_skills',
      currentSkills.filter((skill) => skill !== skillToRemove),
    )
  }

  // Validate current step
  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 0) {
      // Step 1: Title and description
      const fields: (keyof CreateFormationFormData)[] = ['title', 'description']
      const result = await form.trigger(fields)
      return result
    } else if (step === 1) {
      // Step 2: Objectives and skills (optional)
      return true
    } else if (step === 2) {
      // Step 3: Details
      const fields: (keyof CreateFormationFormData)[] = [
        'level',
        'duration',
        'price',
        'image',
      ]
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

  // Handle form submission
  const onSubmit = async (data: CreateFormationFormData) => {
    // Only allow submission at the last step
    if (currentStep !== STEPS.length - 1) {
      console.log(
        '⚠️ Submission blocked - not at last step. Current step:',
        currentStep,
      )
      return
    }

    console.log('✅ Submitting form at step:', currentStep)
    console.log('📦 Data:', data)

    const result = await createFormation(data)

    if (result.success) {
      toast.success(result.message || 'Formation créée avec succès')
      form.reset()
      setCurrentStep(0)
      setSkillInput('')
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof CreateFormationFormData, {
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
      form.reset(createFormationDefaultValues)
      setCurrentStep(0)
      setSkillInput('')
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle formation</DialogTitle>
          <DialogDescription>
            Complétez les informations en 4 étapes simples
          </DialogDescription>
        </DialogHeader>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        >
          <StepperHeader />

          <form
            id="formation-create-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* STEP 1: Title and Description */}
            <StepperContent step={0}>
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">
                        Titre de la formation
                      </FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        placeholder="Ex: Marketing Digital"
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
                        placeholder="Description de la formation..."
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
            </StepperContent>

            {/* STEP 2: Objectives and Skills */}
            <StepperContent step={1}>
              <FieldGroup>
                <Controller
                  name="learning_objectives"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="learning_objectives">
                        Objectifs d'apprentissage
                      </FieldLabel>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        id="learning_objectives"
                        placeholder="Ex: Maîtriser les stratégies de marketing digital..."
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
                  name="target_skills"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Compétences cibles</FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddSkill()
                            }
                          }}
                          placeholder="Ex: SEO, Publicité Facebook..."
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          onClick={handleAddSkill}
                          disabled={loading || !skillInput.trim()}
                        >
                          Ajouter
                        </Button>
                      </div>
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="gap-1"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-1 hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </StepperContent>

            {/* STEP 3: Details (Level, Duration, Price, Image) */}
            <StepperContent step={2}>
              <FieldGroup>
                <Controller
                  name="level"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="level">Niveau</FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value as FormationLevel)
                        }
                        value={field.value}
                        disabled={loading}
                      >
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Sélectionnez un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
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
                  name="duration"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="duration">
                        Durée (en heures)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="duration"
                        type="number"
                        min={1}
                        placeholder="35"
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

                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="price">Prix (optionnel)</FieldLabel>
                      <Input
                        {...field}
                        value={field.value || ''}
                        id="price"
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="349.99"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null,
                          )
                        }
                        disabled={loading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="image"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="image">
                        Image URL (optionnel)
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value || ''}
                        id="image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
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

            {/* STEP 4: Review */}
            <StepperContent step={3}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Révision de la formation
                  </h3>

                  <div className="space-y-4 rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Titre</p>
                      <p className="font-medium">
                        {form.watch('title') || 'Non défini'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm">
                        {form.watch('description') || 'Non définie'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Objectifs d'apprentissage
                      </p>
                      <p className="text-sm">
                        {form.watch('learning_objectives') || 'Non définis'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Compétences cibles
                      </p>
                      {form.watch('target_skills') &&
                      form.watch('target_skills')!.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {form.watch('target_skills')!.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">Non définies</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Niveau</p>
                        <p className="text-sm font-medium">
                          {LEVEL_LABELS[form.watch('level')]}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Durée</p>
                        <p className="text-sm font-medium">
                          {form.watch('duration')} heures
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prix</p>
                        <p className="text-sm font-medium">
                          {form.watch('price')
                            ? `${form.watch('price')} €`
                            : 'Gratuit'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Image</p>
                        <p className="text-sm font-medium">
                          {form.watch('image') ? 'Définie' : 'Non définie'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </StepperContent>

            {/* Hidden submit button */}
            <button
              type="submit"
              id="formation-create-submit-btn"
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
                  document.getElementById('formation-create-submit-btn')?.click()
                }}
              >
                {loading ? 'Création...' : 'Créer la formation'}
              </Button>
            )}
          </DialogFooter>
        </Stepper>
      </DialogContent>
    </Dialog>
  )
}
