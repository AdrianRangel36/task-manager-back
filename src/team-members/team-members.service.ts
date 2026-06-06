import { Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { Prisma, Team, TeamMember } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FindTeamMemberDto } from './dto/find-team-member-dto';

@Injectable()
export class TeamMembersService {
  constructor(private prisma: PrismaService) {}

  async createTeamMember(
    data: CreateTeamMemberDto,
  ): Promise<TeamMember | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.teamMember.create({
        data: {
          userId: data.userId,
          teamId: data.teamId,
          role: data.role,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async teamMembers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TeamMemberWhereUniqueInput;
    where?: Prisma.TeamMemberWhereInput;
    orderBy?: Prisma.TeamMemberOrderByWithRelationInput;
  }): Promise<
    FindTeamMemberDto[] | Prisma.PrismaClientKnownRequestError | null
  > {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const records = await this.prisma.teamMember.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          user: {
            select: {
              name: true,
              paternalSurname: true,
              maternalSurname: true,
            },
          },
        },
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

  async findOneTeamMember(
    id: number,
  ): Promise<TeamMember | Prisma.PrismaClientKnownRequestError | null> {
    try {
      return await this.prisma.teamMember.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async findUserTeams(
    id: number,
  ): Promise<Number[] | Prisma.PrismaClientKnownRequestError | null> {
    try {
      const records = await this.prisma.teamMember.findMany({
        where: { userId: id },
      });
      const teamsIds = records.map((team) => {
        return team.teamId;
      });
      return teamsIds;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async updateTeamMember(
    id: number,
    updateTeamMemberDto: UpdateTeamMemberDto,
  ): Promise<TeamMember | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.teamMember.update({
        where: { id },
        data: updateTeamMemberDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error;
      }
      throw error;
    }
  }

  async removeTeamMember(
    id: number,
  ): Promise<TeamMember | Prisma.PrismaClientKnownRequestError> {
    try {
      return await this.prisma.teamMember.delete({
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
