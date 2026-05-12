import { TeamRole } from 'generated/prisma/enums';

export class FindTeamMemberDto {
  id: number;
  role: TeamRole;
  userId: number;
  teamId: number;
  createdAt: Date;
  updatedAt: Date;
}
