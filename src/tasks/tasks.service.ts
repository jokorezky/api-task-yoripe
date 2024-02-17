import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './tasks.model';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { Status } from "../enums/status.enum"

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    private mapStringToStatus(statusString: string): Status {
        switch (statusString) {
            case 'Todo':
                return Status.Todo;
            case 'Doing':
                return Status.Doing;
            case 'Done':
                return Status.Done;
            default:
                // Handle unknown status or return a default value
                return Status.Todo;
        }
    }

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

    async findOne(boardId: string, id: string): Promise<Task | null> {
        return this.taskModel.findById(id).exec();
    }

    async create(createTaskDto: CreateTaskDto, boardId: string): Promise<Task[]> {
        const existingTasks = await this.taskModel.find().sort({ sequence: 'desc' }).limit(1);
        const lastSequence = existingTasks.length > 0 ? existingTasks[0].sequence : 0;
        const createdTask = new this.taskModel({
            ...createTaskDto,
            boardId,
            sequence: lastSequence + 1,
        });
        createdTask.save();
        return await this.findAll(boardId);
    }

    async update(boardId: string, id: string, task: UpdateTaskDto): Promise<Task[]> {
        const statusString = task.status;
        task.status = Status[statusString];
        await this.taskModel.findByIdAndUpdate(id, task).exec();
        return await this.findAll(boardId);
    }

    async remove(boardId: string, id: string): Promise<Task[]> {
        await this.taskModel.findByIdAndDelete(id).exec();
        return await this.findAll(boardId);
    }
}