import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Prisma, Team, TeamRole } from '../../generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FindTeamDto } from './dto/find-team.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async createTeam(
    data: CreateTeamDto,
    userId: number,
  ): Promise<Team | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.team.create({
        data: {
          name: data.name,
          members: {
            create: {
              role: TeamRole.OWNER,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async teams(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TeamWhereUniqueInput;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput;
  }): Promise<FindTeamDto[] | Prisma.PrismaClientKnownRequestError | null> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const records = await this.prisma.team.findMany({
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

  async findOneTeam(
    teamWhereUniqueInput: Prisma.TeamWhereUniqueInput,
  ): Promise<FindTeamDto | Prisma.PrismaClientKnownRequestError | null> {
    try {
      const record = await this.prisma.team.findUnique({
        where: teamWhereUniqueInput,
      });
      return record;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async updateTeam(params: {
    where: Prisma.TeamWhereUniqueInput;
    data: UpdateTeamDto;
  }): Promise<Team | Prisma.PrismaClientKnownRequestError> {
    const { data, where } = params;
    try {
      return await this.prisma.team.update({
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

  async removeTeam(
    where: Prisma.TeamWhereUniqueInput,
  ): Promise<Team | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.team.delete({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async checkMembership(userId: number, teamId: number): Promise<boolean> {
    try {
      const member = await this.prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId,
            teamId,
          },
          NOT: { role: 'PENDING' },
        },
      });
      return !!member;
    } catch (error) {
      return false;
    }
  }
}
