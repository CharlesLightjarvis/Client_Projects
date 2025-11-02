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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  updateUserSchema,
  getUpdateUserDefaultValues,
  type UpdateUserFormData,
} from '@/schemas/user-schema'
import { useUserStore } from '@/stores/user-store'
import type { User } from '@/types/user'

interface UpdateUserProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateUser({ user, open, onOpenChange }: UpdateUserProps) {
  const { updateUser, loading } = useUserStore()

  // Initialize form with Zod schema validation
  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onChange',
  })

  // Update form values when user changes
  React.useEffect(() => {
    if (user && user.role) {
      const defaultValues = getUpdateUserDefaultValues({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role as 'admin' | 'instructor' | 'student',
      })
      form.reset(defaultValues)
    }
  }, [user, form])

  // Handle form submission
  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) return

    const result = await updateUser(user.id.toString(), data)

    if (result.success) {
      toast.success(result.message || 'Utilisateur mis à jour avec succès')
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      // Set field-level errors from API
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof UpdateUserFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {user.first_name} {user.last_name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-user-first-name">Prénom</FieldLabel>
                  <Input
                    {...field}
                    id="update-user-first-name"
                    placeholder="Entrez le prénom"
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-user-last-name">Nom</FieldLabel>
                  <Input
                    {...field}
                    id="update-user-last-name"
                    placeholder="Entrez le nom"
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-user-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="update-user-email"
                    type="email"
                    placeholder="exemple@email.com"
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-user-role">Rôle</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="update-user-role">
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="instructor">Instructeur</SelectItem>
                      <SelectItem value="student">Étudiant</SelectItem>
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
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
