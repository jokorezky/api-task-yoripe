import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from './tasks.model';
import { AuthModule } from '../auth/auth.module';
import { User, AuthModel } from '../auth/auth.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: AuthModel },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule { }