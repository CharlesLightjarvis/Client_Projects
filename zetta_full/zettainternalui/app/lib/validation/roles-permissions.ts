import { z } from "zod";

// Role validation schema
export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(255, "Role name must be less than 255 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Role name can only contain letters, numbers, spaces, hyphens, and underscores"),
  guard_name: z
    .string()
    .min(1, "Guard name is required")
    .max(255, "Guard name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal(""))
});

// Permission validation schema
export const permissionSchema = z.object({
  name: z
    .string()
    .min(1, "Permission name is required")
    .max(255, "Permission name must be less than 255 characters")
    .regex(/^[a-zA-Z0-9\s\-_\.]+$/, "Permission name can only contain letters, numbers, spaces, hyphens, underscores, and dots"),
  guard_name: z
    .string()
    .min(1, "Guard name is required")
    .max(255, "Guard name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal(""))
});

// Permission assignment validation schemas
export const assignPermissionsSchema = z.object({
  permission_ids: z
    .array(z.string().uuid("Invalid permission ID format"))
    .min(1, "At least one permission must be selected for assignment")
    .max(100, "Cannot assign more than 100 permissions at once")
});

export const revokePermissionsSchema = z.object({
  permission_ids: z
    .array(z.string().uuid("Invalid permission ID format"))
    .min(1, "At least one permission must be selected for revocation")
    .max(100, "Cannot revoke more than 100 permissions at once")
});

export const syncPermissionsSchema = z.object({
  permission_ids: z
    .array(z.string().uuid("Invalid permission ID format"))
    .max(100, "Cannot sync more than 100 permissions at once")
    .optional()
    .default([])
});

// Export types
export type RoleFormData = z.infer<typeof roleSchema>;
export type PermissionFormData = z.infer<typeof permissionSchema>;
export type AssignPermissionsData = z.infer<typeof assignPermissionsSchema>;
export type RevokePermissionsData = z.infer<typeof revokePermissionsSchema>;
export type SyncPermissionsData = z.infer<typeof syncPermissionsSchema>;