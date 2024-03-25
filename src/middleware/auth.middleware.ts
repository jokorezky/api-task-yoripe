import { Injectable, NestMiddleware, UnauthorizedException,CustomDecorator, SetMetadata, ExecutionContext } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        const context = this.reflector.get<ExecutionContext>('context', req.route.path); // Mengambil ExecutionContext dari Reflector

        // Mendapatkan metadata yang ditetapkan pada handler atau kelas controller saat ini
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()], // Mendapatkan handler dan kelas controller dari ExecutionContext
        );

        if (token) {
            try {
                // Jika rute ditandai sebagai publik, lanjutkan tanpa melakukan autentikasi
                if (isPublic) {
                    return next();
                }

                const decoded = this.jwtService.verify(token);
                req['user'] = decoded;
                next();
            } catch (error) {
                throw new UnauthorizedException('Invalid token');
            }
        } else {
            // Jika token tidak disediakan dan rute tidak ditandai sebagai publik, kirim tanggapan Unauthorized
            if (!isPublic) {
                throw new UnauthorizedException('Token not provided');
            }

            // Jika rute ditandai sebagai publik dan tidak ada token, lanjutkan tanpa autentikasi
            next();
        }
    }
}