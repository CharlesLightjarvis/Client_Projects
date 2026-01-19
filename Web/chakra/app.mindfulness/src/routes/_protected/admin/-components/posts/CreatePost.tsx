import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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
import {
  createPostSchema,
  createPostDefaultValues,
  type CreatePostFormData,
} from '@/schemas/post-schema'
import { usePostStore } from '@/stores/post-store'

interface CreatePostProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePost({ open, onOpenChange }: CreatePostProps) {
  const { createPost, loading } = usePostStore()

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: createPostDefaultValues,
    mode: 'onChange',
  })

  const onSubmit = async (data: CreatePostFormData) => {
    const result = await createPost(data)

    if (result.success) {
      toast.success(result.message || 'Post créé avec succès')
      form.reset()
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      // Afficher les erreurs de validation du backend
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof CreatePostFormData, {
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
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Créer un nouveau post</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-post-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="create-post-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Entrez le titre du post"
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
                  <FieldLabel htmlFor="create-post-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="create-post-description"
                    placeholder="Entrez la description du post"
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                    disabled={loading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
              {loading ? 'Création...' : 'Créer le post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
