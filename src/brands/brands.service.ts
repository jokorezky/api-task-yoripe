import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Brand, BrandDocument } from './brands.model';
import { CreateBrandDto, UpdateBrandDto } from './dto/brands.dto';
import { PaginationsDto } from '../dto/Pagination.dto';

@Injectable()
export class BrandsService {
    constructor(
        @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    ) { }

    async findAll(query: PaginationsDto): Promise<{ total: number; totalPage: number; data: Brand[] }> {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;
        const filters = search ? { name: { $regex: new RegExp(search, 'i') } } : {};
        const total = await this.brandModel.countDocuments(filters).exec(); // Hitung total dokumen

        const data = await this.brandModel.find(filters)
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            total,
            totalPage: Math.ceil(total / limit),
            data,
        };
    }

    async findOne(id: string): Promise<Brand> {
        return this.brandModel.findById(new ObjectId(id) as any).exec();
    }

    async create(createBrandDto: CreateBrandDto): Promise<Brand> {
        const createdBrand = new this.brandModel(createBrandDto);
        return createdBrand.save();
    }

    async update(
        id: string,
        updateBrandDto: UpdateBrandDto,
    ): Promise<Brand> {
        return this.brandModel.findByIdAndUpdate(
            new ObjectId(id) as any,
            updateBrandDto,
            { new: true },
        );
    }

    async delete(id: string): Promise<Brand> {
        const deletedBrand = await this.brandModel.findOneAndDelete({ _id: new ObjectId(id) as any }).exec();
        if (!deletedBrand) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }
        return deletedBrand;
    }
}