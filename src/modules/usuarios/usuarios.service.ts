import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import * as bcrypt from 'bcrypt'; // Import da criptografia adicionado

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsuariosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async criar({ nome, email, senha, tipo }: CriarUsuarioDto) {
    // 🔐 CRIPTOGRAFIA SÊNIOR: Gera o hash seguro e irreversível da senha
    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    const sql = `
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, tipo, criado_em;
    `;

    try {
      // Mandamos a 'senhaCriptografada' para o banco no lugar da senha aberta
      const { rows } = await this.databaseService.query(sql, [
        nome,
        email,
        senhaCriptografada,
        tipo,
      ]);
      return rows[0];
    } catch (error: any) {
      if (error?.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Este e-mail já está cadastrado no Ohmae.');
      }
      throw error;
    }
  }
}
