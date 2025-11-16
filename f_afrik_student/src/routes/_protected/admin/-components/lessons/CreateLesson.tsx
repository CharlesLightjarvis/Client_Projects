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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createLessonSchema, type CreateLessonSchema } from '@/schemas/lesson-schema'
import { useLessonStore } from '@/stores/lesson-store'
import { useModules } from '@/hooks/use-modules'

interface CreateLessonProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateLesson({ open, onOpenChange }: CreateLessonProps) {
  const { createLesson, loading } = useLessonStore()
  const { modules } = useModules()

  const form = useForm<CreateLessonSchema>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: '',
      content: '',
      module_id: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: CreateLessonSchema) => {
    const result = await createLesson({
      ...data,
      order: 0, // Par défaut, on met 0 si order n'est pas spécifié
    })

    if (result.success) {
      toast.success(result.message || 'Leçon créée avec succès')
      form.reset()
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la création de la leçon')
    }
  }

  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle leçon</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle leçon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-lesson-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="create-lesson-title"
                    placeholder="Ex: UseState"
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-lesson-content">Contenu</FieldLabel>
                  <Textarea
                    {...field}
                    id="create-lesson-content"
                    placeholder="Ex: Apprendre le UseState"
                    rows={4}
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="module_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-lesson-module">Module</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="create-lesson-module">
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
