import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamMembersService } from 'src/team-members/team-members.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, TeamMembersService],
})
export class TeamModule {}
