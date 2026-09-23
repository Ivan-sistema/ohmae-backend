import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    // Dados exatos extraídos da URL oficial do seu projeto no Supabase
    this.pool = new Pool({
      user: 'postgres.nsjfczmajusonbkhkigt', // ID do projeto corrigido com 'n'
      password: 'Iva@H3lpt@$k',
      host: 'aws-0-sa-east-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      console.log('🚀 [Ohmae Backend] Conexão com o Supabase estabelecida com sucesso nativamente!');
      client.release();
    } catch (error) {
      const err = error as Error;
      console.error('❌ Erro crítico ao conectar ao Supabase:', err.message);
    }
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
