import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, AuthModel } from './auth.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { ConfigService } from "../config/config.service"
import { JwtAuthGuard } from "../middleware/jwt-auth.guard"
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: AuthModel }]),
    ConfigModule,
    ConfigService,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: "jokoauditis", // Menggunakan properti langsung
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }