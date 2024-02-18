import { Injectable, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthuserModel } from "../auth/auth.model";
import { ConfigService } from "../config/config.service"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CurrentUserClass {
  constructor(private readonly authService: AuthService) { }

  async getCurrentUser(data: unknown, context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers.authorization;

    if (!token) {
      return null;
    }

    try {
      const user = await this.authService.verify(token);
      return user;
    } catch (error) {
      return null;
    }
  }
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const authService = new AuthService(
      AuthuserModel,
      new ConfigService,
      new JwtService
    );
    const currentUserClass = new CurrentUserClass(authService);
    return currentUserClass.getCurrentUser(data, context);
  },
);