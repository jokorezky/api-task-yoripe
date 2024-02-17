import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './boards.model';
import { CreateBoardDto } from './dto/create-boards.dto';

@Injectable()
export class BoardsService {
    constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) { }

    async findAll(): Promise<Board[]> {
        return this.boardModel.find().exec();
    }

    async findOne(id: string): Promise<Board | null> {
        return this.boardModel.findById(id).exec();
    }

    async create(createBoardDto: CreateBoardDto): Promise<Board> {
        const createdboard = new this.boardModel(createBoardDto);
        return createdboard.save();
    }

    async update(id: string, board: Board): Promise<Board | null> {
        return this.boardModel.findByIdAndUpdate(id, board, { new: true }).exec();
    }

    async remove(id: string): Promise<Board | null> {
        return this.boardModel.findByIdAndDelete(id).exec();
    }
}