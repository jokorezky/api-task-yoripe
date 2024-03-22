import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PaginationsDto } from '../dto/Pagination.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query() query: PaginationsDto): Promise<{ total: number; totalPage: number; data: Category[] }> {
        const { total, totalPage, data } = await this.categoryService.findAll(query);
        return { total, totalPage, data };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoryService.delete(id);
    }
}