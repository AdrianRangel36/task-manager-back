import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Prisma } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<FindUserDto | Prisma.PrismaClientKnownRequestError | null> {
    try {
      const record = await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });
      if (record === null) {
        return record;
      } else {
        const { password, ...user } = record;
        return user;
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<FindUserDto[] | Prisma.PrismaClientKnownRequestError | null> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const records = await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
      if (records.length === 0) {
        return null;
      } else {
        const users = records.map((user) => {
          const { password, ...findUser } = user;
          return findUser;
        });
        return users;
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async createUser(
    data: CreateUserDto,
  ): Promise<User | Prisma.PrismaClientKnownRequestError> {
    try {
      const { password, ...restOfData } = data;
      const hashPassword = await bcrypt.hash(password, 10);
      return await this.prisma.user.create({
        data: { ...restOfData, password: hashPassword },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User | Prisma.PrismaClientKnownRequestError> {
    const { data, where } = params;
    try {
      return await this.prisma.user.update({
        data,
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async removeUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.user.delete({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }
}
