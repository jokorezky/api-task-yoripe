import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';
import { RoleType } from "../types/role.type"

@Schema()
export class User extends Document {
    @Prop({ required: true })
    full_name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    roles: RoleType[];
}

export const AuthModel = SchemaFactory.createForClass(User);
export const AuthuserModel = model<User>('User', AuthModel);