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
import { Loader2, Shield } from "lucide-react";
import { roleSchema, type RoleFormData } from "~/lib/validation/roles-permissions";
import { getUserFriendlyErrorMessage } from "~/lib/utils/error-handling";
import { isRoleNameDuplicate } from "~/lib/utils/roles-permissions-validation";
import type { Role } from "~/types/roles-permissions";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSubmit: (data: RoleFormData) => Promise<void>;
  loading: boolean;
  existingRoles?: Role[];
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  loading,
  existingRoles = []
}: RoleFormDialogProps) {
  const isEditing = !!role;
  
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      guard_name: "web",
      description: ""
    }
  });

  // Reset form when dialog opens/closes or role changes
  useEffect(() => {
    if (open) {
      reset({
        name: role?.name || "",
        guard_name: role?.guard_name || "web",
        description: role?.description || ""
      });
      clearErrors();
    }
  }, [open, role, reset, clearErrors]);

  const handleFormSubmit = async (data: RoleFormData) => {
    try {
      clearErrors();
      
      // Client-side validation for duplicate names
      if (isRoleNameDuplicate(data.name, existingRoles, role?.id)) {
        setError('name', {
          type: 'manual',
          message: 'A role with this name already exists'
        });
        return;
      }
      
      await onSubmit(data);
      // Form will be closed by parent component on success
    } catch (error) {
      // Handle validation errors
      if (error && typeof error === 'object' && 'errors' in error) {
        const apiErrors = (error as any).errors as Record<string, string[]>;
        if (apiErrors && typeof apiErrors === 'object') {
          Object.entries(apiErrors).forEach(([field, messages]) => {
            setError(field as keyof RoleFormData, {
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
            <Shield className="h-5 w-5" />
            {isEditing ? "Edit Role" : "Create New Role"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the role information below."
              : "Create a new role with the specified permissions and access level."
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

          {/* Role Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Role Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter role name (e.g., Admin, Editor, Viewer)"
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              disabled={loading || isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                {errors.name.message}
              </p>
            )}
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
              placeholder="Describe the role's purpose and responsibilities..."
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
              {isEditing ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}