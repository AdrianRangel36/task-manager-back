import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Prisma, type User, Team } from 'generated/prisma/client';
import { FindTeamDto } from './dto/find-team.dto';
import { TeamMembersService } from 'src/team-members/team-members.service';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMembersService: TeamMembersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return await this.teamService.createTeam(createTeamDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<FindTeamDto[] | null> {
    const response = await this.teamService.teams({ orderBy: { id: 'asc' } });

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
  async findAllUserTeams(
    @Param('id') id: string,
  ): Promise<FindTeamDto[] | null> {
    const teamsId = await this.teamMembersService.findUserTeams(Number(id));
    let userTeams: FindTeamDto[] = [];
    if (teamsId instanceof Prisma.PrismaClientKnownRequestError) {
      switch (teamsId.code) {
        default:
          throw teamsId;
      }
    } else if (teamsId === null) {
      return null;
    } else {
      for (let i = 0; i < teamsId.length; i++) {
        const teamId = Number(teamsId[i]);
        const response = await this.teamService.teams({
          where: { id: teamId },
          orderBy: { id: 'asc' },
        });
        if (response instanceof Prisma.PrismaClientKnownRequestError) {
          switch (response.code) {
            default:
              throw response;
          }
        }
        userTeams.push(...(response as FindTeamDto[]));
      }
    }

    return userTeams;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindTeamDto> {
    const response = await this.teamService.findOneTeam({ id: Number(id) });

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        default:
          throw response;
      }
    }

    if (response === null) {
      throw new NotFoundException(`Team with ID: ${id} not found`);
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    const response = await this.teamService.updateTeam({
      where: { id: Number(id) },
      data: updateTeamDto,
    });

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new NotFoundException(`Team with ID: ${id} not found`);
        default:
          throw response;
      }
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Team> {
    const response = await this.teamService.removeTeam({ id: Number(id) });

    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      switch (response.code) {
        case 'P2025':
          throw new NotFoundException(`Team with ID: ${id} not found`);
        default:
          throw response;
      }
    }

    return response;
  }
}
