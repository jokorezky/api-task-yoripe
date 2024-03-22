import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { Brand, BrandSchema } from './brands.model';
import { AuthModule } from '../auth/auth.module';
import { User, AuthModel } from '../auth/auth.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Brand.name, schema: BrandSchema },
            { name: User.name, schema: AuthModel },]),
        forwardRef(() => AuthModule),
    ],
    controllers: [BrandsController],
    providers: [BrandsService],
})
export class BrandsModule { }