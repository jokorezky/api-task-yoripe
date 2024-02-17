import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ColumnDocument = Column & Document;

@Schema({ collection: 'columns' })
export class Column {
  @Prop()
  title: string;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);