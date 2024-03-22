import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './category.model';
import { AuthModule } from '../auth/auth.module';
import { User, AuthModel } from '../auth/auth.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: User.name, schema: AuthModel },]),
        forwardRef(() => AuthModule),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule { }