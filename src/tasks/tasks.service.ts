import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './tasks.model';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { Status } from "../enums/status.enum";
import { User } from '../auth/auth.model';
import { Types } from 'mongoose';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

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

        const userIds = groupedTasks.flatMap((group) => group.tasks.map((task) => task.userId));
        const users = await this.userModel.find({ _id: { $in: userIds.map(id => new Types.ObjectId(id)) } }).exec();
        const userMap = new Map(users.map((user) => [user._id.toString(), user]));
        const desiredStatus = ['Todo', 'Doing', 'Done'];

        const finalResult: any[] = desiredStatus.map((status) => {
            const group = groupedTasks.find((g) => g._id === status);

            const tasksForStatus = group ? group.tasks.map((task) => {
                const userDetails = userMap.get(task.userId.toString());
                return {
                    ...task,
                    userDetails: userDetails || null
                };
            }) : [];

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

    async create(createTaskDto: CreateTaskDto, boardId: string, user): Promise<Task[]> {
        const { userId } = user
        const existingTasks = await this.taskModel.find().sort({ sequence: 'desc' }).limit(1);
        const lastSequence = existingTasks.length > 0 ? existingTasks[0].sequence : 0;
        const createdTask = new this.taskModel({
            ...createTaskDto,
            boardId,
            userId,
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