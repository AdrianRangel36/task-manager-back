import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Prisma } from 'generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: loginDto) {
    return await this.authService.login(data);
  }

  @Post('signup')
  async signUp(@Body() data: CreateUserDto) {
    const user = await this.authService.signUp(data);
    if (user instanceof Prisma.PrismaClientKnownRequestError) {
      switch (user.code) {
        case 'P2002':
          throw new ConflictException('Email already exists');
        default:
          throw user;
      }
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
