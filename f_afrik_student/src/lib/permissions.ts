// /**
//  * Permission constants for the application
//  * These should match the permissions defined in your Laravel backend
//  */

export const PERMISSIONS = {
  // Post permissions
  POST: {
    CREATE: 'create.posts',
    READ: 'read.posts',
    UPDATE: 'update.posts',
    DELETE: 'delete.posts',
  },

  // User permissions
  USER: {
    CREATE: 'create.users',
    READ: 'read.users',
    UPDATE: 'update.users',
    DELETE: 'delete.users',
    MANAGE: 'manage.users',
  },
} as const
