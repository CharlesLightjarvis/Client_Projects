import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
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
import {
  createLessonSchema,
  createLessonDefaultValues,
  type CreateLessonFormData,
} from '@/schemas/lesson-schema'
import { useLessonStore } from '@/stores/lesson-store'
import { useModules } from '@/hooks/use-modules'
import {
  Trash2Icon,
  AlertCircleIcon,
  FileIcon,
  UploadIcon,
  XIcon,
  FileTextIcon,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  VideoIcon,
  HeadphonesIcon,
  ImageIcon,
  PlusIcon,
} from 'lucide-react'
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload'

interface CreateLessonStepperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STEPS = [
  {
    id: 'basic-info',
    title: 'Informations de base',
    description: 'Titre, contenu, module',
  },
  {
    id: 'files',
    title: 'Fichiers',
    description: 'Upload de fichiers',
  },
  {
    id: 'links-review',
    title: 'Liens et révision',
    description: 'Liens externes et vérification',
  },
]

const LINK_TYPES = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'google_drive', label: 'Google Drive' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'dropbox', label: 'Dropbox' },
  { value: 'onedrive', label: 'OneDrive' },
  { value: 'other', label: 'Autre' },
]

const getFileIcon = (file: { file: File }) => {
  const fileType = file.file.type
  const fileName = file.file.name

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes('pdf') ||
        name.endsWith('.pdf') ||
        type.includes('word') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx'),
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes('zip') ||
        type.includes('archive') ||
        name.endsWith('.zip') ||
        name.endsWith('.rar'),
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes('excel') ||
        name.endsWith('.xls') ||
        name.endsWith('.xlsx'),
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes('video/'),
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes('audio/'),
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith('image/'),
    },
  }

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-5 opacity-60" />
    }
  }

  return <FileIcon className="size-5 opacity-60" />
}

const getFilePreview = (file: { file: File; preview?: string }) => {
  const fileType = file.file.type

  const renderImage = (src: string) => (
    <img
      src={src}
      alt={file.file.name}
      className="size-full rounded-t-[inherit] object-cover"
    />
  )

  return (
    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit] bg-accent">
      {fileType.startsWith('image/') && file.preview ? (
        renderImage(file.preview)
      ) : (
        getFileIcon(file)
      )}
    </div>
  )
}

export function CreateLessonStepper({
  open,
  onOpenChange,
}: CreateLessonStepperProps) {
  const { createLesson, loading } = useLessonStore()
  const { modules, fetchModules } = useModules()
  const [currentStep, setCurrentStep] = React.useState(0)

  // Initialize form
  const form = useForm<CreateLessonFormData>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: createLessonDefaultValues,
    mode: 'onChange',
  })

  // External links field array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'external_links',
  })

  // File upload hook
  const maxSizeMB = 500
  const maxSize = maxSizeMB * 1024 * 1024
  const maxFiles = 10

  const [
    { files, isDragging, errors: fileErrors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'video/mp4,video/x-msvideo,video/quicktime,video/x-ms-wmv,video/x-flv,video/x-matroska,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,application/x-rar-compressed,application/x-7z-compressed,application/x-tar,application/gzip,image/jpeg,image/png,image/gif,image/webp,image/svg+xml,.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.tar,.gz,.jpg,.jpeg,.png,.gif,.webp,.svg',
    multiple: true,
    maxFiles,
    maxSize,
    onFilesSelected: (selectedFiles) => {
      const fileArray = selectedFiles.map((f) => f.file)
      form.setValue('attachments', fileArray, { shouldValidate: true })
    },
  })

  // Add new external link
  const handleAddExternalLink = () => {
    append({ url: '', name: '', type: 'other' })
  }

  // Validate current step
  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 0) {
      // Step 1: Basic info
      const fields: (keyof CreateLessonFormData)[] = [
        'title',
        'content',
        'module_id',
        'order',
      ]
      const result = await form.trigger(fields)
      return result
    } else if (step === 1) {
      // Step 2: Files (optional)
      return true
    } else if (step === 2) {
      // Step 3: External links (optional)
      if (fields.length > 0) {
        const result = await form.trigger('external_links')
        return result
      }
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
  const onSubmit = async (data: CreateLessonFormData) => {
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

    const result = await createLesson(data)

    if (result.success) {
      toast.success(result.message || 'Leçon créée avec succès')
      form.reset()
      setCurrentStep(0)
      clearFiles()
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            form.setError(field as keyof CreateLessonFormData, {
              type: 'manual',
              message: messages[0],
            })
          }
        })
      }
    }
  }

  // Fetch modules when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchModules()
    }
  }, [open, fetchModules])

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset(createLessonDefaultValues)
      setCurrentStep(0)
      clearFiles()
    }
  }, [open, form, clearFiles])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle leçon</DialogTitle>
          <DialogDescription>
            Complétez les informations en 3 étapes simples
          </DialogDescription>
        </DialogHeader>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        >
          <StepperHeader />

          <form
            id="lesson-create-form"
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
                      <FieldLabel htmlFor="title">Titre de la leçon</FieldLabel>
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
                  name="content"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="content">
                        Contenu (optionnel)
                      </FieldLabel>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        id="content"
                        placeholder="Description de la leçon..."
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
                  name="module_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="module_id">Module</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading}
                      >
                        <SelectTrigger id="module_id">
                          <SelectValue placeholder="Sélectionnez un module" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem key={module.id} value={module.id || ''}>
                              {module.title}
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
                  name="order"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="order">
                        Ordre (optionnel)
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value || ''}
                        id="order"
                        type="number"
                        min={1}
                        placeholder="1"
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
              </FieldGroup>
            </StepperContent>

            {/* STEP 2: File Uploads */}
            <StepperContent step={1}>
              <FieldGroup>
                <Controller
                  name="attachments"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="attachments">
                        Fichiers (optionnel)
                      </FieldLabel>

                      <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        data-dragging={isDragging || undefined}
                        data-files={files.length > 0 || undefined}
                        className="relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
                      >
                        <input
                          {...getInputProps()}
                          className="sr-only"
                          aria-label="Upload files"
                        />
                        {files.length > 0 ? (
                          <div className="flex w-full flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="truncate text-sm font-medium">
                                Fichiers ({files.length})
                              </h3>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={openFileDialog}
                                >
                                  <UploadIcon
                                    className="-ms-0.5 size-3.5 opacity-60"
                                    aria-hidden="true"
                                  />
                                  Ajouter
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    clearFiles()
                                    field.onChange([])
                                  }}
                                >
                                  <Trash2Icon
                                    className="-ms-0.5 size-3.5 opacity-60"
                                    aria-hidden="true"
                                  />
                                  Tout supprimer
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                              {files.map((file) => (
                                <div
                                  key={file.id}
                                  className="relative flex flex-col rounded-md border bg-background"
                                >
                                  {getFilePreview(file)}
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      removeFile(file.id)
                                      const updatedFiles = files
                                        .filter((f) => f.id !== file.id)
                                        .map((f) => f.file)
                                      field.onChange(updatedFiles)
                                    }}
                                    size="icon"
                                    className="absolute -top-2 -right-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                                    aria-label="Remove file"
                                  >
                                    <XIcon className="size-3.5" />
                                  </Button>
                                  <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                                    <p className="truncate text-[13px] font-medium">
                                      {file.file.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                      {formatBytes(file.file.size)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <div
                              className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                              aria-hidden="true"
                            >
                              <FileIcon className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">
                              Déposez vos fichiers ici
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Max {maxFiles} fichiers ∙ Jusqu'à {maxSizeMB}MB
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-4"
                              onClick={openFileDialog}
                            >
                              <UploadIcon
                                className="-ms-1 opacity-60"
                                aria-hidden="true"
                              />
                              Sélectionner des fichiers
                            </Button>
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

            {/* STEP 3: External Links and Review */}
            <StepperContent step={2}>
              <div className="space-y-6">
                {/* External Links Section */}
                <FieldGroup>
                  <div className="flex items-center justify-between mb-2">
                    <FieldLabel>Liens externes (optionnel)</FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddExternalLink}
                    >
                      <PlusIcon className="size-4 mr-1" />
                      Ajouter un lien
                    </Button>
                  </div>

                  {fields.length > 0 ? (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex flex-col gap-3 p-4 border rounded-lg relative"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 size-6"
                            onClick={() => remove(index)}
                            aria-label="Remove link"
                          >
                            <XIcon className="size-4" />
                          </Button>

                          <Controller
                            name={`external_links.${index}.name`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`link-name-${index}`}>
                                  Nom
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={`link-name-${index}`}
                                  placeholder="Ex: Vidéo d'introduction"
                                  disabled={loading}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name={`external_links.${index}.url`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`link-url-${index}`}>
                                  URL
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={`link-url-${index}`}
                                  type="url"
                                  placeholder="https://..."
                                  disabled={loading}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name={`external_links.${index}.type`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`link-type-${index}`}>
                                  Type (optionnel)
                                </FieldLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={loading}
                                >
                                  <SelectTrigger id={`link-type-${index}`}>
                                    <SelectValue placeholder="Sélectionnez un type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {LINK_TYPES.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg border-dashed">
                      <p className="text-sm text-muted-foreground">
                        Aucun lien externe ajouté
                      </p>
                    </div>
                  )}
                </FieldGroup>

                {/* Review Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Révision de la leçon
                  </h3>

                  <div className="space-y-4 rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Titre</p>
                      <p className="font-medium">
                        {form.watch('title') || 'Non défini'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Contenu</p>
                      <p className="text-sm">
                        {form.watch('content') || 'Non défini'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Module</p>
                      <p className="text-sm">
                        {modules.find((m) => m.id === form.watch('module_id'))
                          ?.title || 'Non défini'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Ordre</p>
                      <p className="text-sm">
                        {form.watch('order') || 'Non défini'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Fichiers</p>
                      <p className="text-sm font-medium">
                        {files.length > 0
                          ? `${files.length} fichier${files.length > 1 ? 's' : ''}`
                          : 'Aucun fichier'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Liens externes
                      </p>
                      <p className="text-sm font-medium">
                        {form.watch('external_links')?.length || 0} lien
                        {(form.watch('external_links')?.length || 0) > 1
                          ? 's'
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StepperContent>

            {/* Hidden submit button */}
            <button
              type="submit"
              id="lesson-create-submit-btn"
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
                  document.getElementById('lesson-create-submit-btn')?.click()
                }}
              >
                {loading ? 'Création...' : 'Créer la leçon'}
              </Button>
            )}
          </DialogFooter>
        </Stepper>
      </DialogContent>
    </Dialog>
  )
}
