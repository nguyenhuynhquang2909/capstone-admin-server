import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleConfigService {
  private readonly roles = {
    PARENT: 'parent',
    STUDENT: 'student',
    SCHOOLADMIN: 'schoolAdmin'
  };

  getRole(role: string): string {
    if (!role) {
      throw new Error('Role is undefined');
    }
    const roleName = this.roles[role.toUpperCase()];
    if (!roleName) {
      throw new Error(`Role '${role}' is not defined in the roles configuration`);
    }
    return roleName;
  }
}
