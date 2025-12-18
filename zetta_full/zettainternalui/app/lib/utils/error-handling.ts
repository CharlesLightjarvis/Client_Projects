import type { FieldErrors, FieldPath, FieldValues } from "react-hook-form";

// API Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Extract error message from various error types
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unexpected error occurred';
}

// Format API validation errors for display
export function formatApiErrors(errors: Record<string, string[]>): string {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `${fieldName}: ${messages.join(', ')}`;
    });
  
  return errorMessages.join('\n');
}

// Convert API errors to react-hook-form errors
export function apiErrorsToFormErrors<T extends FieldValues>(
  apiErrors: Record<string, string[]>
): Partial<FieldErrors<T>> {
  const formErrors: Partial<FieldErrors<T>> = {};
  
  Object.entries(apiErrors).forEach(([field, messages]) => {
    const fieldPath = field as FieldPath<T>;
    formErrors[fieldPath] = {
      type: 'server',
      message: messages[0] || 'Invalid value'
    } as any;
  });
  
  return formErrors;
}

// Check if error is a validation error
export function isValidationError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'errors' in error &&
    typeof (error as any).errors === 'object'
  );
}

// Check if error is a network error
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('fetch') ||
           error.message.toLowerCase().includes('connection');
  }
  return false;
}

// Get user-friendly error message
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (isValidationError(error) && error.errors) {
    return formatApiErrors(error.errors);
  }
  
  const message = getErrorMessage(error);
  
  // Common error message mappings
  const errorMappings: Record<string, string> = {
    'Unauthorized': 'You are not authorized to perform this action.',
    'Forbidden': 'You do not have permission to perform this action.',
    'Not Found': 'The requested resource was not found.',
    'Internal Server Error': 'A server error occurred. Please try again later.',
    'Bad Request': 'Invalid request. Please check your input and try again.',
    'Conflict': 'This action conflicts with existing data. Please check for duplicates.',
  };
  
  return errorMappings[message] || message;
}

// Success message utilities
export const SUCCESS_MESSAGES = {
  ROLE_CREATED: 'Role created successfully',
  ROLE_UPDATED: 'Role updated successfully',
  ROLE_DELETED: 'Role deleted successfully',
  PERMISSION_CREATED: 'Permission created successfully',
  PERMISSION_UPDATED: 'Permission updated successfully',
  PERMISSION_DELETED: 'Permission deleted successfully',
  PERMISSIONS_ASSIGNED: 'Permissions assigned successfully',
  PERMISSIONS_REVOKED: 'Permissions revoked successfully',
  PERMISSIONS_SYNCED: 'Permissions synchronized successfully',
} as const;