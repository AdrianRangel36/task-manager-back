import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('📝 Intentando crear usuario:', createUserDto);
      
      const newUser = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          paternalSurname: createUserDto.paternalSurname,
          maternalSurname: createUserDto.maternalSurname,
          email: createUserDto.email,
        },
      });

      console.log('✅ Usuario creado exitosamente:', newUser);
      return newUser;
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
