import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../types/role.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => {
  console.log("roles",roles)
  return SetMetadata(ROLES_KEY, roles)
};
