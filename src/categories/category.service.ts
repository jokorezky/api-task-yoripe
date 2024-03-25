import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Category, CategoryDocument } from './category.model';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PaginationsDto } from '../dto/Pagination.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) { }

    async findAll(query: PaginationsDto): Promise<{ total: number; totalPage: number; data: Category[] }> {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;
        const filters = search ? { name: { $regex: new RegExp(search, 'i') } } : {};

        const total = await this.categoryModel.countDocuments(filters).exec(); // Hitung total dokumen

        const data = await this.categoryModel.find(filters)
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            total,
            totalPage: Math.ceil(total / limit),
            data,
        };
    }

    async findOne(id: string): Promise<Category> {
        return this.categoryModel.findById(new ObjectId(id) as any).exec();
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const slug = createCategoryDto.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
        const createdCategory = new this.categoryModel({ ...createCategoryDto, slug });
        return createdCategory.save();
    }

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        return this.categoryModel.findByIdAndUpdate(
            new ObjectId(id) as any,
            updateCategoryDto,
            { new: true },
        );
    }

    async delete(id: string): Promise<Category> {
        const deletedCategory = await this.categoryModel.findOneAndDelete({ _id: new ObjectId(id) as any }).exec();
        if (!deletedCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return deletedCategory;
    }
}