import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Users } from "lucide-react";
import { permissionSchema, type PermissionFormData } from "~/lib/validation/roles-permissions";
import { getUserFriendlyErrorMessage } from "~/lib/utils/error-handling";
import { isPermissionNameDuplicate } from "~/lib/utils/roles-permissions-validation";
import type { Permission } from "~/types/roles-permissions";

interface PermissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: Permission | null;
  onSubmit: (data: PermissionFormData) => Promise<void>;
  loading: boolean;
  existingPermissions?: Permission[];
}

export function PermissionFormDialog({
  open,
  onOpenChange,
  permission,
  onSubmit,
  loading,
  existingPermissions = []
}: PermissionFormDialogProps) {
  const isEditing = !!permission;
  
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: "",
      guard_name: "web",
      description: ""
    }
  });

  // Reset form when dialog opens/closes or permission changes
  useEffect(() => {
    if (open) {
      reset({
        name: permission?.name || "",
        guard_name: permission?.guard_name || "web",
        description: permission?.description || ""
      });
      clearErrors();
    }
  }, [open, permission, reset, clearErrors]);

  const handleFormSubmit = async (data: PermissionFormData) => {
    try {
      clearErrors();
      
      // Client-side validation for duplicate names
      if (isPermissionNameDuplicate(data.name, existingPermissions, permission?.id)) {
        setError('name', {
          type: 'manual',
          message: 'A permission with this name already exists'
        });
        return;
      }
      
      await onSubmit(data);
      // Form will be closed by parent component on success
    } catch (error) {
      // Handle validation errors
      if (error && typeof error === 'object' && 'errors' in error) {
        const apiErrors = (error as any).errors as Record<string, string[]>;
        Object.entries(apiErrors).forEach(([field, messages]) => {
          setError(field as keyof PermissionFormData, {
            type: 'server',
            message: messages[0]
          });
        });
      } else {
        // Handle general errors
        setError('root', {
          type: 'server',
          message: getUserFriendlyErrorMessage(error)
        });
      }
    }
  };

  const handleClose = () => {
    if (!loading && !isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isEditing ? "Edit Permission" : "Create New Permission"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the permission information below."
              : "Create a new permission to control access to specific features or actions."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* General form error */}
          {errors.root && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Permission Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Permission Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter permission name (e.g., users.create, posts.edit)"
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              disabled={loading || isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                {errors.name.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Use descriptive names like "users.create" or "reports.view"
            </p>
          </div>

          {/* Guard Name Field */}
          <div className="space-y-2">
            <Label htmlFor="guard_name" className="text-sm font-medium">
              Guard Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="guard_name"
              {...register("guard_name")}
              placeholder="web"
              className={errors.guard_name ? "border-red-500 focus-visible:ring-red-500" : ""}
              disabled={loading || isSubmitting}
            />
            {errors.guard_name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                {errors.guard_name.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              The guard name defines the authentication context (usually "web")
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe what this permission allows users to do..."
              rows={3}
              className={errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
              disabled={loading || isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading || isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="min-w-[100px]"
            >
              {(loading || isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update Permission" : "Create Permission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}