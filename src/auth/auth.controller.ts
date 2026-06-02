import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Prisma } from 'generated/prisma/client';
import type { User } from 'generated/prisma/client';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyToken(@CurrentUser() user: User) {
    // Si llega aquí, el token es 100% válido
    return { valid: true, userId: user.id };
  }
}
