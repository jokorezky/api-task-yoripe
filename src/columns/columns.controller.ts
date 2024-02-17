import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { Column } from './columns.model';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Controller('columns')
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<Column[]> {
        return this.columnsService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Column | null> {
        return this.columnsService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body() createColumnDto: CreateColumnDto,
    ): Promise<Column> {
        return this.columnsService.create(createColumnDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() column: Column): Promise<Column | null> {
        return this.columnsService.update(id, column);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string): Promise<Column | null> {
        return this.columnsService.remove(id);
    }
}