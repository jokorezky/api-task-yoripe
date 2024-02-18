import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './auth.model';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, full_name } = createUserDto;
        const emailExist = await this.getUserByEmail(email);
        if (emailExist) {
            throw new Error('Email is Already Registered');
        }
        const secret = Buffer.from(this.configService.HASH_SECRET);
        const hash = await argon2.hash(password, {
            secret,
        });
        const user = new this.userModel({
            password: hash,
            email,
            full_name,
        });
        await user.save();
        return await this.userModel.findById((await user)._id);
    }

    async verify(token: string): Promise<any> {
        try {
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const userResult: any = await this.jwtService.verifyAsync(
                tokenWithoutBearer,
                {
                    secret: this.configService.JWT_SECRET,
                },
            );
            return userResult;
        } catch (e) {
            throw e;
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<{ data: { token: string; email: string; full_name: string } }> {
        const { email, password } = loginUserDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new Error('User Not Found');
        }
        if (!password) {
            throw new Error('You Must Input Password');
        }

        const secret = Buffer.from(this.configService.HASH_SECRET);
        const isMatch = await argon2.verify(user.password, password, { secret });

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        
        const token = await this.generateToken(user);
        const { full_name } = user
        return {
            data: {
                token,
                email,
                full_name
            }
        }
    }

    private generateToken(user: User): string {
        const payload = { sub: user.email, userId: user._id };
        return this.jwtService.sign(payload);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().select('-password').exec();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async getUserById(id: string): Promise<User | null> {
        const objectId = new Types.ObjectId(id);
        return this.userModel.findById(objectId).exec();
    }

    async updateUserById(id: string, user: User): Promise<User | null> {
        const objectId = new Types.ObjectId(id);
        return this.userModel.findByIdAndUpdate(objectId, user, { new: true }).exec();
    }

    async deleteUserById(id: string): Promise<User | null> {
        const objectId = new Types.ObjectId(id);
        return this.userModel.findByIdAndDelete(objectId).exec();
    }
}