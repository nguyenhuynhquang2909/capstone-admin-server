import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoleId = this.reflector.get<number>('roleId', context.getHandler());
    if (!requiredRoleId) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user.roleId === requiredRoleId;
  }
}
