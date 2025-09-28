import { UserRole } from '../entities/user.entity';
import { SetMetadata } from '@nestjs/common';

//storing unique identifier and retrieving role requirements as metadata on route handlers
export const ROLES_KEY = 'roles';

//roles decorator marks routes that require specific roles to access them
//roles guard will check if the user has the required role
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
