import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';

@Controller('criancas')
export class CriancasController {
  constructor(private readonly databaseService: DatabaseService) {}

  // Rota para cadastrar o bebê: POST http://localhost:3000/criancas/cadastro
  @Post('cadastro')
  async cadastrarCrianca(@Body() body: { nome: string; data_nascimento: string; restricoes_medicas?: string }) {
    const { nome, data_nascimento, restricoes_medicas } = body;

    if (!nome || !data_nascimento) {
      throw new HttpException('Nome e data de nascimento são obrigatórios.', HttpStatus.BAD_REQUEST);
    }

    try {
      const queryText = `
        INSERT INTO criancas (nome, data_nascimento, restricoes_medicas) 
        VALUES ($1, $2, $3) 
        RETURNING id, nome, data_nascimento, restricoes_medicas, criado_em;
      `;
      
      const resultado = await this.databaseService.query(queryText, [nome, data_nascimento, restricoes_medicas || null]);
      
      return {
        sucesso: true,
        mensagem: 'Perfil da criança criado com sucesso no Ohmae!',
        dados: resultado.rows[0]
      };
    } catch (error: any) {
      throw new HttpException(`Erro ao salvar perfil do bebê: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Rota para buscar os dados de uma criança específica: GET http://localhost:3000/criancas/:id
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const queryText = 'SELECT * FROM criancas WHERE id = \$1;';
    const resultado = await this.databaseService.query(queryText, [id]);

    if (resultado.rowCount === 0) {
      throw new HttpException('Criança não encontrada no sistema.', HttpStatus.NOT_FOUND);
    }

    return { sucesso: true, dados: resultado.rows[0] };
  }
}
