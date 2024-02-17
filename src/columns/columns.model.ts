import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ColumnDocument = Column & Document;

@Schema({ collection: 'columns' })
export class Column {
  @Prop()
  title: string;

  @Prop()
  sequence: number;

  @Prop({ type: Types.ObjectId, ref: 'Board' }) // Menambahkan relasi ke model Board
  boardId: Types.ObjectId;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);