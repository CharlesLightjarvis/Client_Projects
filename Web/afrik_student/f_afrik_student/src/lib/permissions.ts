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

  // Formation permissions
  FORMATION: {
    CREATE: 'create.formations',
    READ: 'read.formations',
    UPDATE: 'update.formations',
    DELETE: 'delete.formations',
    MANAGE: 'manage.formations',
  },

  // Module permissions
  MODULE: {
    CREATE: 'create.modules',
    READ: 'read.modules',
    UPDATE: 'update.modules',
    DELETE: 'delete.modules',
    MANAGE: 'manage.modules',
  },

  // Lesson permissions
  LESSON: {
    CREATE: 'create.lessons',
    READ: 'read.lessons',
    UPDATE: 'update.lessons',
    DELETE: 'delete.lessons',
    MANAGE: 'manage.lessons',
  },

  // Session permissions
  SESSION: {
    CREATE: 'create.sessions',
    READ: 'read.sessions',
    UPDATE: 'update.sessions',
    DELETE: 'delete.sessions',
    MANAGE: 'manage.sessions',
  },
} as const
