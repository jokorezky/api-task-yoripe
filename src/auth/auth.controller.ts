import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../middleware/auth.middleware';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { User } from './auth.model';
import { Roles } from "../utils/roles.decorator";
import { RoleType } from "../types/role.type";
import { PaginationsDto } from "../dto/Pagination.dto";

const crypto = require('crypto');

function generate4Digit() {
  return Math.floor(1000 + crypto.randomInt(9000));
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.ADMIN_OWNER)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const tmpPasswordNumber = generate4Digit().toString();
    createUserDto.password = tmpPasswordNumber;
    return this.authService.createUser(createUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.ADMIN_OWNER)
  @Get('kurirs')
  async getAllKurirs(@Query() query: PaginationsDto): Promise<{ total: number; totalPage: number; data: User[] }> {
    const roles = RoleType.KURIR
    const { total, totalPage, data } = await this.authService.findAll(query, roles);
    return { total, totalPage, data };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.authService.getUserById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUserById(@Param('id') id: string, @Body() updateUserDto: User): Promise<User | null> {
    return this.authService.updateUserById(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUserById(@Param('id') id: string): Promise<User | null> {
    return this.authService.deleteUserById(id);
  }
}