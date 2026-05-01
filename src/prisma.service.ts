import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('❌ DATABASE_URL no está definida en las variables de entorno');
    }
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Base de datos conectada exitosamente');
    } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('✅ Desconexión de base de datos completada');
    } catch (error) {
      console.error('❌ Error al desconectar de la base de datos:', error);
    }
  }
}
