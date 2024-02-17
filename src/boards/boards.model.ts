import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ collection: 'boards' })
export class Board {
  @Prop()
  title: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);