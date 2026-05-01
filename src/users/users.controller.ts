import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll(){
    return this.usersService.users({orderBy:{id:'asc'}});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.user({id:Number(id)});
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({where:{id:Number(id)},data:updateUserDto});
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<User> {
    return this.usersService.removeUser({ id: Number(id) });
  }
}
