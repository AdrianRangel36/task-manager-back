import { IsNumber, IsNotEmpty } from 'class-validator';

export class DeleteTeamMember {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  teamId: number;
}
