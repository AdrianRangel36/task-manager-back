import { Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FindTeamMemberDto } from './dto/find-team-member-dto';

@Injectable()
export class TeamMembersService {
  constructor(private prisma: PrismaService) {}
  create(createTeamMemberDto: CreateTeamMemberDto) {
    return 'This action adds a new teamMember';
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

  findOne(id: number) {
    return `This action returns a #${id} teamMember`;
  }

  update(id: number, updateTeamMemberDto: UpdateTeamMemberDto) {
    return `This action updates a #${id} teamMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamMember`;
  }
}
