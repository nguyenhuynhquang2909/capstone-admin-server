import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { RoleConfigService } from '../services/role-config.service';
  
  @Injectable()
  export class RoleGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private roleConfigService: RoleConfigService,
    ) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (
        !user ||
        !requiredRoles.includes(this.roleConfigService.getRole(user.role))
      ) {
        throw new UnauthorizedException(
          'You do not have permission to access this resource',
        );
      }
  
      return true;
    }
  }