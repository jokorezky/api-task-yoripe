import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './products.service';
import { PaginationsDto } from "../dto/Pagination.dto";
import { Product } from './products.model';
import { User } from '../auth/auth.model';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { RolesGuard } from '../middleware/role.guard';
import { Roles } from "../utils/roles.decorator";
import { RoleType } from "../types/role.type";
import { CurrentUser } from '../auth/current-user.context';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) { }

    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(RoleType.ADMIN_OWNER)
    @Get()
    async findAll(
        @Query() query: PaginationsDto
    ): Promise<{ total: number; totalPage: number; data: Product[] }> {
        const { total, totalPage, data } = await this.productService.findAll(query);
        return { total, totalPage, data };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Product | null> {
        return this.productService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(RoleType.ADMIN_OWNER)
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 5 },
    ]))
    async createProduct(
        @Body() createProductDto: any, @UploadedFiles() files: any,
        @CurrentUser() user: User
    ) {
        // Memproses gambar dan mengunggahnya ke S3
        const imageUrls = await this.productService.uploadImagesToS3(files.images);
        // Menambahkan URL gambar ke DTO
        createProductDto.images = imageUrls;
        // Membuat produk
        return this.productService.createProduct(createProductDto, user);
    }

    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(RoleType.ADMIN_OWNER)
    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 5 },

    ]))
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: any, @UploadedFiles() files: any): Promise<Product> {
        let imageUrlsFromFile = null;
        if (files && files.images) {
            imageUrlsFromFile = await this.productService.uploadImagesToS3(files.images);
        }
        let parsedImageUrls;
        try {
            // Mengonversi JSON string menjadi objek
            const getProduct = await this.productService.findOne(id);
            parsedImageUrls = getProduct.images
        } catch (error) {
            console.error('Error parsing imageUrls:', error);
        }

        // Menggabungkan dua array jika ada imageUrlsFromFile
        const mergedImageUrls = imageUrlsFromFile ? [...imageUrlsFromFile, ...parsedImageUrls] : parsedImageUrls;

        return this.productService.updateProduct(id, updateProductDto, mergedImageUrls);
    }
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(RoleType.ADMIN_OWNER)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<boolean> {
        return this.productService.remove(id);
    }

    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(RoleType.ADMIN_OWNER)
    @Delete(':id/images/:imageUrl')
    async deleteProductImage(@Param('id') id: string, @Param('imageUrl') imageUrl: string) {
        return this.productService.deleteProductImage(id, imageUrl);
    }
}