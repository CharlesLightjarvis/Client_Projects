// /**
//  * Permission constants for the application
//  * These should match the permissions defined in your Laravel backend
//  */

export const PERMISSIONS = {
  // Post permissions
  POST: {
    CREATE: 'post.create',
    READ: 'post.read',
    UPDATE: 'post.update',
    DELETE: 'post.delete',
  },

  // User permissions
  USER: {
    MANAGE: 'user.manage',
  },
} as const
