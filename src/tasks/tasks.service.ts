import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './tasks.model';
import { CreateTaskDto } from './dto/create-tasks.dto';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    async findAll(boardId: string): Promise<any[]> {
        const groupedTasks = await this.taskModel.aggregate([
            { $match: { boardId } },
            {
                $group: {
                    _id: "$status",
                    tasks: { $push: "$$ROOT" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]).exec();

        const desiredStatus = ['Todo', 'Doing', 'Done'];
        const finalResult: any[] = desiredStatus.map((status) => {
            const tasksForStatus = groupedTasks.find((group) => group._id === status)?.tasks || [];
            return {
                _id: status,
                tasks: tasksForStatus
            };
        });

        return finalResult;
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