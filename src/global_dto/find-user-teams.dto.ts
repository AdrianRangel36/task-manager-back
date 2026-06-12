import { TeamRole } from 'generated/prisma/enums';

export class FindUserTeamDto {
  teamId: number;
  name: string;
  role: TeamRole;
}
