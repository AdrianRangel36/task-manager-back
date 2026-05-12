import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TeamMembersController],
  providers: [TeamMembersService,PrismaService],
})
export class TeamMembersModule {}
