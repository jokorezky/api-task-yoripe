import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsString, IsNumber, IsUrl, IsBoolean, IsArray, IsOptional } from 'class-validator';

export type ProductDocument = Product & Document;

@Schema({ collection: 'product' })
export class Product {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  @IsString()
  name: string;

  @Prop()
  @IsNumber()
  promoPrice: number;

  @Prop()
  @IsNumber()
  normalPrice: number

  @Prop()
  @IsString()
  category: string;

  @Prop()
  @IsString()
  brand: string;

  @Prop()
  @IsString()
  description: string;

  @Prop()
  @IsBoolean()
  lazada: boolean;

  @Prop()
  @IsBoolean()
  shopee: boolean;

  @Prop()
  @IsBoolean()
  tokopedia: boolean;

  @Prop()
  @IsBoolean()
  blibli: boolean;

  @Prop()
  @IsBoolean()
  bukalapak: boolean;

  @Prop()
  @IsUrl()
  linkLazada: string;

  @Prop()
  @IsUrl()
  linkShopee: string;

  @Prop()
  @IsUrl()
  linkTokopedia: string;

  @Prop()
  @IsUrl()
  linkBlibli: string;

  @Prop()
  @IsUrl()
  linkBukalapak: string;

  @Prop()
  @IsArray()
  images: string[];

  @Prop({ default: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);