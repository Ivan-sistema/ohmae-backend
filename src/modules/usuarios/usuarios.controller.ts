import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('cadastro')
  async cadastrarUsuario(@Body() body: { nome: string; email: string; tipo: 'PAI_MAE' | 'CUIDADOR' }) {
    const { nome, email, tipo } = body;

    if (!nome || !email || !tipo) {
      throw new HttpException('Todos os campos (nome, email, tipo) são obrigatórios.', HttpStatus.BAD_REQUEST);
    }

    if (tipo !== 'PAI_MAE' && tipo !== 'CUIDADOR') {
      throw new HttpException('O tipo de usuário deve ser PAI_MAE ou CUIDADOR.', HttpStatus.BAD_REQUEST);
    }

    try {
      const queryText = `
        INSERT INTO usuarios (nome, email, tipo) 
        VALUES ($1, $2, $3) 
        RETURNING id, nome, email, tipo, criado_em;
      `;
      
      const resultado = await this.databaseService.query(queryText, [nome, email, tipo]);
      
      return {
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso no Ohmae!',
        dados: resultado.rows
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new HttpException('Este e-mail já está cadastrado no sistema.', HttpStatus.CONFLICT);
      }
      throw new HttpException(`Erro no banco de dados: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('lista')
  async listarTodos() {
    const resultado = await this.databaseService.query('SELECT * FROM usuarios ORDER BY criado_em DESC;');
    return { 
      sucesso: true,
      total: resultado.rowCount, 
      usuarios: resultado.rows 
    };
  }
}
