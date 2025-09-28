import {
  Injectable,
  CanActivate,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROLES_KEY } from '../decorators/role.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  //Reflector - utility that will hep to access metadata
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContextHost): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), //method level metadata
        context.getClass(), //class level metadata
      ],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'User does not have access to this resource',
      );
    }

    return true;
  }
}
