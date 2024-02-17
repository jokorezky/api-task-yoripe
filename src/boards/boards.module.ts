import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board, BoardSchema } from './boards.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardssModule { }