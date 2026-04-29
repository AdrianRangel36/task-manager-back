import 'dotenv/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { TeamModule } from './team/team.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [UsersModule, TeamMembersModule, TeamModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
