import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ConflictException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from 'generated/prisma/client';
import { FindUserDto } from './dto/find-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const response = await this.usersService.createUser(createUserDto);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2002':
          throw new ConflictException('Email already exists');
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<FindUserDto[] | null> {
    const response = await this.usersService.users({ orderBy: { id: 'asc' } });

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindUserDto> {
    const response = await this.usersService.user({ id: Number(id) });

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        default:
          throw response;
      }
    }

    if (response === null) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const response = await this.usersService.updateUser({
      where: { id: Number(id) },
      data: updateUserDto,
    });
    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2002':
          throw new ConflictException('Email already exists');
        case 'P2025':
          throw new NotFoundException(`User with ID: ${id} not found`);
        default:
          throw response;
      }
    }
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    const response = await this.usersService.removeUser({ id: Number(id) });

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new NotFoundException(`User with ID: ${id} not found`);
        default:
          throw response;
      }
    }

    return response;
  }
}
