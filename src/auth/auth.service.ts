import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(data: loginDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (user === null) {
      throw new UnauthorizedException('Incorrect credentials');
    } else {
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect credentials');
      }
      const payload = { sub: user.id, email: user.email };
      const { password, createdAt, updatedAt, ...restOfData } = user;
      return {
        access_token: await this.jwtService.signAsync(payload),
        user: restOfData,
      };
    }
  }

  async signUp(data: CreateUserDto) {
    return await this.userService.createUser(data);
  }
}
