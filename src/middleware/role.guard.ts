import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { RoleType } from '../types/role.type';

const ROLE = 'roles';

export const RoleAuths = (...rules: RoleType[]): CustomDecorator =>
  SetMetadata(ROLE, rules);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.getAllAndOverride<RoleType[]>(ROLE, [
        context.getHandler(),
        context.getClass(),
      ]);

      const request = context.switchToHttp().getRequest();

      if (!roles || roles?.length === 0) {
        return true;
      }

      const token: string = request.headers.authorization;

      const tokenData = await this.authService.verify(token);
      const user = await this.authService.getUserByEmail(tokenData.sub);
      if (!user) {
        return false
      }

      return roles.some((role) => user.roles?.includes(role));

    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
