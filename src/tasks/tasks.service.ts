import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma, Task } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTaskDto: CreateTaskDto,
  ): Promise<Task | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.task.create({
        data: {
          assignedMemberId: createTaskDto.assignedMemberId,
          teamId: createTaskDto.teamId,
          status: createTaskDto.status,
          name: createTaskDto.name,
          description: createTaskDto.description,
          goals: createTaskDto.goals,
          startDate: createTaskDto.startDate,
          endDate: createTaskDto.endDate,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  } = {}): Promise<Task[] | Prisma.PrismaClientKnownRequestError | null> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const records = await this.prisma.task.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
      if (records.length === 0) {
        return null;
      }
      return records;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }


  async findOne(
    id: number,
  ): Promise<Task | Prisma.PrismaClientKnownRequestError | null> {
    try {
      return await this.prisma.task.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async remove(
    id: number,
  ): Promise<Task | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }
}
