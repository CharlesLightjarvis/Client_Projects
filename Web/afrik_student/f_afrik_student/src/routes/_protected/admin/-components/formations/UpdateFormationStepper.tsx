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
  updateFormationSchema,
  getUpdateFormationDefaultValues,
  type UpdateFormationFormData,
} from '@/schemas/formation-schema'
import { useFormationStore } from '@/stores/formation-store'
import { FormationLevel, type Formation } from '@/types/formation'
import { Trash2, AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'
import { useFileUpload } from '@/hooks/use-file-upload'

interface UpdateFormationStepperProps {
  formation: Formation | null
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
    description: 'Vérifier et sauvegarder',
  },
]

const LEVEL_LABELS: Record<FormationLevel, string> = {
  [FormationLevel.EASY]: 'Facile',
  [FormationLevel.MEDIUM]: 'Moyen',
  [FormationLevel.HARD]: 'Difficile',
}

export function UpdateFormationStepper({
  formation,
  open,
  onOpenChange,
}: UpdateFormationStepperProps) {
  const { updateFormation, loading } = useFormationStore()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [skillInput, setSkillInput] = React.useState('')
  const [existingImageUrl, setExistingImageUrl] = React.useState<string | null>(null)

  // Initialize form
  const form = useForm<UpdateFormationFormData>({
    resolver: zodResolver(updateFormationSchema),
    defaultValues: formation
      ? getUpdateFormationDefaultValues(formation)
      : undefined,
    mode: 'onChange',
  })

  // File upload hook
  const maxSizeMB = 10
  const maxSize = maxSizeMB * 1024 * 1024

  const [
    { files, isDragging, errors: fileErrors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      clearFiles,
    },
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp',
    maxSize,
    onFilesSelected: (selectedFiles) => {
      if (selectedFiles.length > 0) {
        form.setValue('image_url', selectedFiles[0].file, { shouldValidate: true })
        setExistingImageUrl(null) // Clear existing image when new one is selected
      }
    },
  })

  const previewUrl = files[0]?.preview || existingImageUrl

  // Populate form when formation changes
  React.useEffect(() => {
    if (open && formation) {
      form.reset(getUpdateFormationDefaultValues(formation))
      setExistingImageUrl(formation.image_url)
      clearFiles()
    } else if (!open) {
      setCurrentStep(0)
      setSkillInput('')
      setExistingImageUrl(null)
      clearFiles()
    }
  }, [open, formation, form, clearFiles])

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
      // Step 1: Title and description (optional for update)
      return true
    } else if (step === 1) {
      // Step 2: Objectives and skills (optional)
      return true
    } else if (step === 2) {
      // Step 3: Details (optional for update)
      return true
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
  const onSubmit = async (data: UpdateFormationFormData) => {
    // Only allow submission at the last step
    if (currentStep !== STEPS.length - 1) {
      console.log(
        '⚠️ Submission blocked - not at last step. Current step:',
        currentStep,
      )
      return
    }

    if (!formation?.id) {
      toast.error('Formation introuvable')
      return
    }

    console.log('✅ Submitting form at step:', currentStep)
    console.log('📦 Data:', data)

    const result = await updateFormation(formation.id, data)

    if (result.success) {
      toast.success(result.message || 'Formation mise à jour avec succès')
      setCurrentStep(0)
      setSkillInput('')
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof UpdateFormationFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la formation</DialogTitle>
          <DialogDescription>
            Modifiez les informations en 4 étapes simples
          </DialogDescription>
        </DialogHeader>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        >
          <StepperHeader />

          <form
            id="formation-update-form"
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
                        value={field.value || ''}
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
                        value={field.value || ''}
                        id="duration"
                        type="number"
                        min={1}
                        placeholder="35"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined,
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
                  name="image_url"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="image_url">
                        Image de la formation (optionnel)
                      </FieldLabel>
                      <div className="relative">
                        <div
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          data-dragging={isDragging || undefined}
                          className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
                        >
                          <input
                            {...getInputProps()}
                            className="sr-only"
                            aria-label="Upload image file"
                          />
                          {previewUrl ? (
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                              <img
                                src={previewUrl}
                                alt={files[0]?.file?.name || formation?.title || 'Formation image'}
                                className="mx-auto max-h-full rounded object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                              <div
                                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                                aria-hidden="true"
                              >
                                <ImageIcon className="size-4 opacity-60" />
                              </div>
                              <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                              <p className="text-xs text-muted-foreground">
                                SVG, PNG, JPG, GIF ou WEBP (max. {maxSizeMB}MB)
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={openFileDialog}
                              >
                                <UploadIcon
                                  className="-ms-1 size-4 opacity-60"
                                  aria-hidden="true"
                                />
                                Sélectionner une image
                              </Button>
                            </div>
                          )}
                        </div>

                        {previewUrl && (
                          <div className="absolute top-4 right-4">
                            <button
                              type="button"
                              className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                              onClick={() => {
                                removeFile(files[0]?.id)
                                field.onChange(null)
                                setExistingImageUrl(null)
                              }}
                              aria-label="Remove image"
                            >
                              <XIcon className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </div>

                      {fileErrors.length > 0 && (
                        <div
                          className="flex items-center gap-1 text-xs text-destructive mt-2"
                          role="alert"
                        >
                          <AlertCircleIcon className="size-3 shrink-0" />
                          <span>{fileErrors[0]}</span>
                        </div>
                      )}

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
                        {form.watch('title') || formation?.title || 'Non défini'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm">
                        {form.watch('description') ||
                          formation?.description ||
                          'Non définie'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Objectifs d'apprentissage
                      </p>
                      <p className="text-sm">
                        {form.watch('learning_objectives') ||
                          formation?.learning_objectives ||
                          'Non définis'}
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
                        <p className="text-sm">
                          {formation?.target_skills &&
                          formation.target_skills.length > 0
                            ? formation.target_skills.join(', ')
                            : 'Non définies'}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Niveau</p>
                        <p className="text-sm font-medium">
                          {form.watch('level')
                            ? LEVEL_LABELS[form.watch('level')!]
                            : formation?.level
                              ? LEVEL_LABELS[formation.level.value]
                              : 'Non défini'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Durée</p>
                        <p className="text-sm font-medium">
                          {form.watch('duration') || formation?.duration || 0}{' '}
                          heures
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prix</p>
                        <p className="text-sm font-medium">
                          {form.watch('price') !== undefined &&
                          form.watch('price') !== null
                            ? `${form.watch('price')} €`
                            : formation?.price
                              ? `${formation.price} €`
                              : 'Gratuit'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Image</p>
                        <p className="text-sm font-medium">
                          {form.watch('image_url') || existingImageUrl
                            ? 'Définie'
                            : 'Non définie'}
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
              id="formation-update-submit-btn"
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
                  document.getElementById('formation-update-submit-btn')?.click()
                }}
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour la formation'}
              </Button>
            )}
          </DialogFooter>
        </Stepper>
      </DialogContent>
    </Dialog>
  )
}
