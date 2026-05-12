import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Prisma, type User } from 'generated/prisma/client';
import { FindTeamDto } from './dto/find-team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
