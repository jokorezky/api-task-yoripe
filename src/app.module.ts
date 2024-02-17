import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './middleware/jwt-auth.guard';
import { ColumnsModule } from './columns/columns.module';
import { BoardssModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    ColumnsModule,
    BoardssModule,
    TasksModule
  ],
  providers: [JwtAuthGuard],
})
export class AppModule { }