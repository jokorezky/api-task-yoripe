import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUrl, IsBoolean, IsArray } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({ title: 'Product ID', description: 'ID of the product' })
    _id: string;

    @ApiPropertyOptional({ title: 'Name', description: 'Name of the product' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ title: 'PromoPrice', description: 'Promotional price of the product' })
    @IsOptional()
    @IsNumber()
    promoPrice?: number;

    @ApiPropertyOptional({ title: 'NormalPrice', description: 'Promotional price of the product' })
    @IsOptional()
    @IsNumber()
    normalPrice?: number

    @ApiPropertyOptional({ title: 'Category', description: 'Category of the product' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ title: 'Category', description: 'Category of the product' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({ title: 'Description', description: 'Description of the product' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ title: 'Lazada', description: 'Flag for Lazada availability' })
    @IsOptional()
    @IsBoolean()
    lazada?: boolean;

    @ApiPropertyOptional({ title: 'Shopee', description: 'Flag for Shopee availability' })
    @IsOptional()
    @IsBoolean()
    shopee?: boolean;

    @ApiPropertyOptional({ title: 'Tokopedia', description: 'Flag for Tokopedia availability' })
    @IsOptional()
    @IsBoolean()
    tokopedia?: boolean;

    @ApiPropertyOptional({ title: 'Blibli', description: 'Flag for Blibli availability' })
    @IsOptional()
    @IsBoolean()
    blibli?: boolean;

    @ApiPropertyOptional({ title: 'Bukalapak', description: 'Flag for Bukalapak availability' })
    @IsOptional()
    @IsBoolean()
    bukalapak?: boolean;

    @ApiPropertyOptional({ title: 'LinkLazada', description: 'Link for Lazada product' })
    @IsOptional()
    @IsUrl()
    linkLazada?: string;

    @ApiPropertyOptional({ title: 'LinkShopee', description: 'Link for Shopee product' })
    @IsOptional()
    @IsUrl()
    linkShopee?: string;

    @ApiPropertyOptional({ title: 'LinkTokopedia', description: 'Link for Tokopedia product' })
    @IsOptional()
    @IsUrl()
    linkTokopedia?: string;

    @ApiPropertyOptional({ title: 'LinkBlibli', description: 'Link for Blibli product' })
    @IsOptional()
    @IsUrl()
    linkBlibli?: string;

    @ApiPropertyOptional({ title: 'LinkBukalapak', description: 'Link for Bukalapak product' })
    @IsOptional()
    @IsUrl()
    linkBukalapak?: string;

    @ApiPropertyOptional({ title: 'Images', description: 'Array of images for the product' })
    @IsOptional()
    @IsArray()
    images?: string[];

    @ApiPropertyOptional({ title: 'Status', description: 'Status of the product' })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}