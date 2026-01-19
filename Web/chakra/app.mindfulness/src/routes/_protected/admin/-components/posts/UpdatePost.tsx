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
  updatePostSchema,
  getUpdatePostDefaultValues,
  type UpdatePostFormData,
} from '@/schemas/post-schema'
import { usePostStore } from '@/stores/post-store'
import type { Post } from '@/types/post'

interface UpdatePostProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdatePost({ post, open, onOpenChange }: UpdatePostProps) {
  const { updatePost, loading } = usePostStore()

  const form = useForm<UpdatePostFormData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: post ? getUpdatePostDefaultValues(post) : {},
    mode: 'onChange',
  })

  // Reset form when post changes or dialog opens
  React.useEffect(() => {
    if (post && open) {
      form.reset(getUpdatePostDefaultValues(post))
    }
  }, [post, open, form])

  const onSubmit = async (data: UpdatePostFormData) => {
    if (!post) return

    const result = await updatePost(post.id, data)

    if (result.success) {
      toast.success(result.message || 'Post mis à jour avec succès')
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }

      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof UpdatePostFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Modifier le post</DialogTitle>
          <DialogDescription>
            Modifiez les informations du post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-post-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="update-post-title"
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
                  <FieldLabel htmlFor="update-post-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="update-post-description"
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
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
