import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginDto {
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
