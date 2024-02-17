import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './tasks.model';
import { CreateTaskDto } from './dto/create-tasks.dto';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    async findAll(boardId: string): Promise<Task[]> {
        return this.taskModel.find({ boardId }).exec();
    }

    async findOne(id: string): Promise<Task | null> {
        return this.taskModel.findById(id).exec();
    }

    async create(createTaskDto: CreateTaskDto, boardId: string): Promise<Task> {
        const existingTasks = await this.taskModel.find().sort({ sequence: 'desc' }).limit(1);
        const lastSequence = existingTasks.length > 0 ? existingTasks[0].sequence : 0;
        const createdTask = new this.taskModel({
            ...createTaskDto,
            boardId,
            sequence: lastSequence + 1,
        });
        return createdTask.save();
    }

    async update(id: string, task: Task): Promise<Task | null> {
        return this.taskModel.findByIdAndUpdate(id, task, { new: true }).exec();
    }

    async remove(id: string): Promise<Task | null> {
        return this.taskModel.findByIdAndDelete(id).exec();
    }
}