import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name can not be empty" })
  name: string;

  @IsString()
  @IsNotEmpty()
  paternalSurname: string;

  @IsString()
  @IsNotEmpty()
  maternalSurname: string;

  @IsEmail({},{message:'Must be a valid email'})
  @IsNotEmpty()
  email: string;
}
