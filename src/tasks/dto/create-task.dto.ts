import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsIn,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  assignedMemberId: number;

  @IsNumber()
  @IsNotEmpty()
  teamId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['TO_DO', 'IN_PROGRESS','IN_REVIEW', 'DONE'])
  status: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  goals: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
