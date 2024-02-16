import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './middleware/jwt-auth.guard';
// import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
  ],
  providers: [JwtAuthGuard],
})
export class AppModule { }