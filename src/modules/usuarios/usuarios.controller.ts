import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import { UsuariosService } from './usuarios.service.js';
import { DatabaseService } from '../../core/database/database.service.js';
import * as bcrypt from 'bcrypt'; // Import da criptografia adicionado

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Post()
  async cadastrar(@Body() dto: CriarUsuarioDto) {
    const usuario = await this.usuariosService.criar(dto);
    return {
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso no Ohmae!',
      usuario,
    };
  }

  // 🎯 ROTA DE LOGIN ATUALIZADA E 100% SEGURA
  @Post('login')
  async login(@Body() body: { email: string; senha?: string }) {
    const { email, senha } = body;

    if (!email || !senha) {
      throw new HttpException('E-mail e senha são obrigatórios.', HttpStatus.BAD_REQUEST);
    }

    // Busca o usuário no banco incluindo a coluna da senha protegida
    const queryText = 'SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = $1;';
    const resultado = await this.databaseService.query(queryText, [email.trim().toLowerCase()]);

    if (resultado.rowCount === 0) {
      throw new HttpException('E-mail ou senha incorretos.', HttpStatus.UNAUTHORIZED);
    }

    const usuario = resultado.rows[0];

    // 🔐 VALIDAÇÃO SÊNIOR: Compara a senha digitada com a hash criptografada do Supabase
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new HttpException('E-mail ou senha incorretos.', HttpStatus.UNAUTHORIZED);
    }

    // Remove a hash do retorno por segurança antes de mandar para o Flutter
    delete usuario.senha;

    return {
      sucesso: true,
      usuario,
    };
  }
}
