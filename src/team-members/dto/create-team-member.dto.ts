import { TeamRole } from 'generated/prisma/enums';
import { IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateTeamMemberDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  teamId: number;

  @IsEnum(TeamRole)
  @IsNotEmpty()
  role: TeamRole;
}
