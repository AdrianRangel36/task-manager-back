import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { FindTeamMemberDto } from './dto/find-team-member-dto';
import { Prisma } from 'generated/prisma/client';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamMembersService.create(createTeamMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<FindTeamMemberDto[] | null> {
    const response = await this.teamMembersService.teamMembers({ orderBy: { id: 'asc' } });

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
    return this.teamMembersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamMemberDto: UpdateTeamMemberDto) {
    return this.teamMembersService.update(+id, updateTeamMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMembersService.remove(+id);
  }
}
