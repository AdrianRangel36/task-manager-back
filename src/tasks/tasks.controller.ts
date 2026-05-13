import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ConflictException,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Prisma } from 'generated/prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const response = await this.tasksService.create(createTaskDto);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2003':
          throw new ConflictException(
            'Invalid team member or team reference',
          );
        case 'P2025':
          throw new NotFoundException('Team member or team not found');
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const response = await this.tasksService.findAll();

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      throw response;
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.tasksService.findOne(+id);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new NotFoundException('Task not found');
        default:
          throw response;
      }
    }

    if (!response) {
      throw new NotFoundException('Task not found');
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const response = await this.tasksService.update(+id, updateTaskDto);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new NotFoundException('Task not found');
        case 'P2003':
          throw new ConflictException(
            'Invalid team member or team reference',
          );
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.tasksService.remove(+id);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new NotFoundException('Task not found');
        default:
          throw response;
      }
    }

    return response;
  }
}
