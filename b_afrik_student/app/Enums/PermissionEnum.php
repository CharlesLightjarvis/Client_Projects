<?php

namespace App\Enums;

enum PermissionEnum : string
{
    case CREATE_USERS = "create.users";
    case READ_USERS = "read.users";
    case UPDATE_USERS = "update.users";
    case DELETE_USERS = "delete.users";
}
