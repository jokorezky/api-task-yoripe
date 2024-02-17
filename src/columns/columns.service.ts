import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Column, ColumnDocument } from './columns.model';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnsService {
    constructor(@InjectModel(Column.name) private columnModel: Model<ColumnDocument>) { }

    async findAll(): Promise<Column[]> {
        return this.columnModel.find().exec();
    }

    async findOne(id: string): Promise<Column | null> {
        return this.columnModel.findById(id).exec();
    }

    async create(createColumnDto: CreateColumnDto): Promise<Column> {
        const existingColumns = await this.columnModel.find().sort({ sequence: 'desc' }).limit(1);
        const lastSequence = existingColumns.length > 0 ? existingColumns[0].sequence : 0;
        const createdColumn = new this.columnModel({
            ...createColumnDto,
            sequence: lastSequence + 1,
        });
        return createdColumn.save();
    }

    async update(id: string, column: Column): Promise<Column | null> {
        return this.columnModel.findByIdAndUpdate(id, column, { new: true }).exec();
    }

    async remove(id: string): Promise<Column | null> {
        return this.columnModel.findByIdAndDelete(id).exec();
    }
}