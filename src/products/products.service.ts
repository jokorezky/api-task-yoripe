import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from "./dto/PaginationDto.dto";
import { Product, ProductDocument } from './products.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../auth/auth.model';

@Injectable()
export class ProductService {
    private readonly s3: AWS.S3;
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(User.name) private userModel: Model<User>,

    ) {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }

    // async findAll(query: PaginationDto): Promise<Product[]> {
    //     const { page, limit, search } = query;
    //     const skip = (page - 1) * limit;
    //     const filters = search ? { name: { $regex: new RegExp(search, 'i') } } : {};

    //     return this.productModel.find(filters)
    //         .skip(skip)
    //         .limit(limit)
    //         .exec();
    // }
    // async findOne(id: string): Promise<Product | null> {
    //     return this.productModel.findById(id).exec();
    // }

    async findAll(query: PaginationDto): Promise<{ total: number; totalPage: number; data: Product[] }> {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;
        const filters = search ? { name: { $regex: new RegExp(search, 'i') } } : {};

        const total = await this.productModel.countDocuments(filters).exec(); // Hitung total dokumen

        const data = await this.productModel.find(filters)
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            total,
            totalPage: Math.ceil(total / limit),
            data,
        };
    }

    async findOne(_id: string): Promise<Product | null> {
        try {
            const product = await this.productModel.findById(new ObjectId(_id) as any);
            return product || null;
        } catch (error) {
            // Handle errors, log them, or throw custom exceptions if needed
            console.error('Error finding product:', error);
            throw error;
        }
    }

    async uploadImagesToS3(images: Express.Multer.File[]): Promise<string[]> {
        const imageUrls = [];
        for (const image of images) {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${uuidv4()}_${image.originalname}`,
                Body: image.buffer,
                ContentType: image.mimetype,
            };
            const data = await this.s3.upload(params).promise();
            imageUrls.push(data.Location);
        }
        return imageUrls;
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const objectId = new Types.ObjectId();
        const createdProduct = new this.productModel({
            _id: objectId,
            ...createProductDto,
        });

        // Save the product document to the database
        return createdProduct.save();
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto, imageUrls: string[]): Promise<Product> {
        const product = await this.productModel.findById(new ObjectId(id) as any);

        if (!product) {
            throw new Error('Product not found');
        }

        // If images are provided, update the images
        if (imageUrls && imageUrls.length > 0) {
            product.images = imageUrls;
        }

        // Update other fields
        product.name = updateProductDto.name || product.name;
        product.normalPrice = updateProductDto.normalPrice || product.normalPrice;
        product.promoPrice = updateProductDto.promoPrice || product.promoPrice;
        product.category = updateProductDto.category || product.category;
        product.description = updateProductDto.description || product.description;
        product.lazada = updateProductDto.lazada || product.lazada;
        product.shopee = updateProductDto.shopee || product.shopee;
        product.tokopedia = updateProductDto.tokopedia || product.tokopedia;
        product.blibli = updateProductDto.blibli || product.blibli;
        product.bukalapak = updateProductDto.bukalapak || product.bukalapak;
        product.linkLazada = updateProductDto.linkLazada || product.linkLazada;
        product.linkShopee = updateProductDto.linkShopee || product.linkShopee;
        product.linkTokopedia = updateProductDto.linkTokopedia || product.linkTokopedia;
        product.linkBlibli = updateProductDto.linkBlibli || product.linkBlibli;
        product.linkBukalapak = updateProductDto.linkBukalapak || product.linkBukalapak;

        // Save and return updated product
        return product.save();
    }

    async remove(id_: string): Promise<boolean> {
        const product = await this.productModel.findByIdAndDelete(id_).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id_} not found`);
        }
        return true;
    }

    async deleteProductImage(_id: string, imageUrl: string): Promise<Product> {
        try {
            const product = await this.productModel.findById(new ObjectId(_id) as any);

            if (!product) {
                throw new Error('Product not found');
            }

            // Hapus URL gambar dari array product.images
            const newProducts = [];
            product.images.filter(image => {
                // Ubah URL gambar menjadi nama file saja
                const imageName = image.match(/[^/]+$/)[0];
                const decodedUrl = decodeURIComponent(imageName);
                if (decodedUrl !== imageUrl) {
                    newProducts.push(image)
                }
            });
            // product.images = product.images.filter(image => image !== imageUrl);
            product.images = newProducts;
            // Simpan perubahan pada dokumen produk
            await product.save();

            return product;
        } catch (error) {
            throw new Error(`Error deleting product image: ${error.message}`);
        }
    }
}