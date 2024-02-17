import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { Task } from './tasks.model';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('taskByBoardId/:boardId')
    findAll(@Param('boardId') boardId: string): Promise<Task[]> {
        return this.tasksService.findAll(boardId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('taskByBoardId/:boardId/:id')
    findOne(@Param('id') id: string): Promise<Task | null> {
        return this.tasksService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('taskByBoardId/:boardId')
    create(
        @Body() createTaskDto: CreateTaskDto,
        @Headers('boardId') boardId: string,
    ): Promise<Task> {
        return this.tasksService.create(createTaskDto, boardId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('taskByBoardId/:boardId/:id')
    update(@Param('id') id: string, @Body() task: Task): Promise<Task | null> {
        return this.tasksService.update(id, task);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('taskByBoardId/:boardId/:id')
    remove(@Param('id') id: string): Promise<Task | null> {
        return this.tasksService.remove(id);
    }
}