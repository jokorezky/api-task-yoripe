import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-boards.dto';
import { Board } from './boards.model';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<Board[]> {
        return this.boardsService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Board | null> {
        return this.boardsService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardsService.create(createBoardDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() board: Board): Promise<Board | null> {
        return this.boardsService.update(id, board);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string): Promise<Board | null> {
        return this.boardsService.remove(id);
    }
}