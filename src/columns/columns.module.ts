import { Module , forwardRef} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { Column, ColumnSchema } from './columns.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}