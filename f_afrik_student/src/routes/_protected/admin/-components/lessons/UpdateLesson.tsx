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
import { updateLessonSchema, type UpdateLessonSchema } from '@/schemas/lesson-schema'
import { useLessonStore } from '@/stores/lesson-store'
import { useModules } from '@/hooks/use-modules'
import type { Lesson } from '@/types/lesson'

interface UpdateLessonProps {
  lesson: Lesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateLesson({ lesson, open, onOpenChange }: UpdateLessonProps) {
  const { updateLesson, loading } = useLessonStore()
  const { modules } = useModules()

  const form = useForm<UpdateLessonSchema>({
    resolver: zodResolver(updateLessonSchema),
    defaultValues: {
      title: lesson?.title || '',
      content: lesson?.content || '',
      module_id: lesson?.module_id || '',
    },
    mode: 'onChange',
  })

  React.useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title,
        content: lesson.content ?? '',
        module_id: lesson.module_id ?? '',
      })
    }
  }, [lesson, form])

  const onSubmit = async (data: UpdateLessonSchema) => {
    if (!lesson?.id) return

    const result = await updateLesson(lesson.id, data)

    if (result.success) {
      toast.success(result.message || 'Leçon mise à jour avec succès')
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la mise à jour de la leçon')
    }
  }

  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la leçon</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la leçon. Cliquez sur enregistrer quand vous
            avez terminé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-lesson-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="update-lesson-title"
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
                  <FieldLabel htmlFor="update-lesson-content">Contenu</FieldLabel>
                  <Textarea
                    {...field}
                    id="update-lesson-content"
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
                  <FieldLabel htmlFor="update-lesson-module">Module</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="update-lesson-module">
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
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
