import { Injectable, ExecutionContext, CustomDecorator, SetMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';

const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    try {
      const token: string = request.headers.authorization;

      if (isPublic) {
        return true;
      }

      if (!token && !isPublic) {
        throw new Error('You must provide token!');
      }

      const tokenData = await this.authService.verify(token);
      console.log("tokenData", tokenData)
      const user = await this.authService.getUserByEmail(tokenData.sub);
      if (!user) {
        return false
      }

      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}