import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUrl, IsBoolean, IsArray } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ title: 'Name', description: 'Name of the product' })
    @IsString()
    name: string;

    @ApiProperty({ title: 'Price', description: 'Price of the product' })
    @IsNumber()
    price: number;

    @ApiProperty({ title: 'PromoPrice', description: 'Promotional price of the product' })
    @IsNumber()
    promoPrice: number;

    @ApiProperty({ title: 'Category', description: 'Category of the product' })
    @IsString()
    category: string;

    @ApiProperty({ title: 'Category', description: 'Brand of the product' })
    @IsString()
    brand: string;

    @ApiProperty({ title: 'Description', description: 'Description of the product' })
    @IsString()
    description: string;

    @ApiProperty({ title: 'Lazada', description: 'Flag for Lazada availability' })
    @IsBoolean()
    lazada: boolean = false;

    @ApiProperty({ title: 'Shopee', description: 'Flag for Shopee availability' })
    @IsBoolean()
    shopee: boolean = false;

    @ApiProperty({ title: 'Tokopedia', description: 'Flag for Tokopedia availability' })
    @IsBoolean()
    tokopedia: boolean = false;

    @ApiProperty({ title: 'Blibli', description: 'Flag for Blibli availability' })
    @IsBoolean()
    blibli: boolean = false;

    @ApiProperty({ title: 'Bukalapak', description: 'Flag for Bukalapak availability' })
    @IsBoolean()
    bukalapak: boolean = false;

    @ApiProperty({ title: 'LinkLazada', description: 'Link for Lazada product' })
    @IsUrl()
    linkLazada: string;

    @ApiProperty({ title: 'LinkShopee', description: 'Link for Shopee product' })
    @IsUrl()
    linkShopee: string;

    @ApiProperty({ title: 'LinkTokopedia', description: 'Link for Tokopedia product' })
    @IsUrl()
    linkTokopedia: string;

    @ApiProperty({ title: 'LinkBlibli', description: 'Link for Blibli product' })
    @IsUrl()
    linkBlibli: string;

    @ApiProperty({ title: 'LinkBukalapak', description: 'Link for Bukalapak product' })
    @IsUrl()
    linkBukalapak: string;

    @ApiProperty({ title: 'Images', description: 'Array of images for the product' })
    @IsArray()
    images: string[];
}