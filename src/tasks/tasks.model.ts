import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Priority } from '../enums/priority.enum';
import { Status } from '../enums/status.enum';

export type TaskDocument = Task & Document;

@Schema({ collection: 'tasks' })
export class Task {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  sequence: number;

  @Prop({ enum: Priority, default: Priority.Low })
  priority: Priority;

  @Prop({ enum: Status, default: Status.Todo })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: 'Board' })
  boardId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);