<?php

namespace App\Enums;

enum PermissionEnum : string
{
    // ============== USERS ==============
    case CREATE_USERS = "create.users";
    case READ_USERS = "read.users";
    case UPDATE_USERS = "update.users";
    case DELETE_USERS = "delete.users";

    // ============== FORMATIONS ==============
    case CREATE_FORMATIONS = "create.formations";
    case READ_FORMATIONS   = "read.formations";
    case UPDATE_FORMATIONS = "update.formations";
    case DELETE_FORMATIONS = "delete.formations";

    // ============== MODULES ==============
    case CREATE_MODULES = "create.modules";
    case READ_MODULES   = "read.modules";
    case UPDATE_MODULES = "update.modules";
    case DELETE_MODULES = "delete.modules";

    // ============== LESSONS ==============
    case CREATE_LESSONS = "create.lessons";
    case READ_LESSONS   = "read.lessons";
    case UPDATE_LESSONS = "update.lessons";
    case DELETE_LESSONS = "delete.lessons";
    
    // ============== SESSIONS ==============
    case CREATE_SESSIONS = "create.sessions";
    case READ_SESSIONS   = "read.sessions";
    case UPDATE_SESSIONS = "update.sessions";
    case DELETE_SESSIONS = "delete.sessions";
}
