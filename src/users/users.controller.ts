import { Controller, Get, Post, Body, Param, Delete, Put, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User | null> {
    const newUser = await this.usersService.createUser(createUserDto);
    if (!newUser) {
      throw new ConflictException('Email already exists');
    }
    return newUser
  }

  @Get()
  async findAll() {
    return this.usersService.users({ orderBy: { id: 'asc' } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.user({ id: Number(id) });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto):Promise<User|null> {
    const updatedUser = await this.usersService.updateUser({ where: { id: Number(id) }, data: updateUserDto });
    if (!updatedUser){
      throw new ConflictException('Email already exists')
    }
    return updatedUser
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<User> {
    return this.usersService.removeUser({ id: Number(id) });
  }
}
