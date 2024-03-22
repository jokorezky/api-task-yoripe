import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './brands.model';
import { CreateBrandDto, UpdateBrandDto } from './dto/brands.dto';
import { PaginationsDto } from '../dto/Pagination.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query() query: PaginationsDto): Promise<{ total: number; totalPage: number; data: Brand[] }> {
        const { total, totalPage, data } = await this.brandsService.findAll(query);
        return { total, totalPage, data };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brandsService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createBrandDto: CreateBrandDto) {
        return this.brandsService.create(createBrandDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        return this.brandsService.update(id, updateBrandDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.brandsService.delete(id);
    }
}