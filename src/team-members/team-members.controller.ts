import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  ConflictException,
} from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { FindTeamMemberDto } from './dto/find-team-member-dto';
import { Prisma } from 'generated/prisma/client';
import { DeleteTeamMember } from './dto/delete-team-member.dto';
import { FindUserTeamDto } from 'src/global_dto/find-user-teams.dto';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    const response =
      await this.teamMembersService.createTeamMember(createTeamMemberDto);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2002':
          throw new ConflictException('User already exists');
        case 'P2025':
          throw new ConflictException('User or team not found');
        case 'P2003':
          throw new ConflictException('Foreign key violation');
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('findallteam/:id')
  async findAllTeamMembers(
    @Param('id') id: string,
  ): Promise<FindTeamMemberDto[] | null> {
    const response = await this.teamMembersService.teamMembers({
      orderBy: { id: 'asc' },
      where: { teamId: +id },
    });

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('userTeams/:id')
  async findAll(@Param('id') id: string): Promise<FindUserTeamDto[] | null> {
    const response = await this.teamMembersService.findUserTeams(+id);
    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        default:
          throw response;
      }
    }
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('findone/:id')
  async findOne(@Param('id') id: string) {
    const response = await this.teamMembersService.findOneTeamMember(+id);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new ConflictException('Team member not found');
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Put('changerole')
  async update(
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    const response = await this.teamMembersService.updateTeamMember(
      updateTeamMemberDto,
    );

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new ConflictException('Team member not found');
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('leaveteam')
  async remove(@Body() deleteTeamMember: DeleteTeamMember) {
    const response =
      await this.teamMembersService.removeTeamMember(deleteTeamMember);

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new ConflictException('Team member not found');
        default:
          throw response;
      }
    }

    return response;
  }
}
