import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { Product, ProductSchema } from './products.model';
import { AuthModule } from '../auth/auth.module';
import { User, AuthModel } from '../auth/auth.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: AuthModel },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule { }