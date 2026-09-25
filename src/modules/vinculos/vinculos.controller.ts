import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';

@Controller('vinculos')
export class VinculosController {
  constructor(private readonly databaseService: DatabaseService) {}

  // Rota para vincular um usuário (Pai ou Cuidador) a uma criança: POST http://localhost:3000/vinculos/conectar
  @Post('conectar')
  async conectarUsuarioCrianca(@Body() body: { usuario_id: string; crianca_id: string; pode_editar: boolean }) {
    const { usuario_id, crianca_id, pode_editar } = body;

    if (!usuario_id || !crianca_id) {
      throw new HttpException('Os campos usuario_id e crianca_id são obrigatórios.', HttpStatus.BAD_REQUEST);
    }

    try {
      // 1. Verifica se o usuário existe no Supabase
      const checkUser = await this.databaseService.query('SELECT id FROM usuarios WHERE id = \$1;', [usuario_id]);
      if (checkUser.rowCount === 0) {
        throw new HttpException('Usuário não encontrado no sistema.', HttpStatus.NOT_FOUND);
      }

      // 2. Verifica se a criança existe no Supabase
      const checkChild = await this.databaseService.query('SELECT id FROM criancas WHERE id = \$1;', [crianca_id]);
      if (checkChild.rowCount === 0) {
        throw new HttpException('Criança não encontrada no sistema.', HttpStatus.NOT_FOUND);
      }

      // 3. Cria o vínculo na tabela 'vinculos_familia'
      const queryText = `
        INSERT INTO vinculos_familia (usuario_id, crianca_id, pode_editar) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (usuario_id, crianca_id) DO UPDATE 
        SET pode_editar = EXCLUDED.pode_editar
        RETURNING id, usuario_id, crianca_id, pode_editar, criado_em;
      `;
      
      const resultado = await this.databaseService.query(queryText, [usuario_id, crianca_id, pode_editar ?? false]);
      
      return {
        sucesso: true,
        mensagem: 'Vínculo familiar estabelecido com sucesso no Ohmae!',
        dados: resultado.rows[0]
      };
    } catch (error: any) {
      throw new HttpException(`Erro ao estabelecer vínculo: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Rota para listar quem cuida de uma criança específica: GET http://localhost:3000/vinculos/crianca/:criancaId
  @Get('crianca/:criancaId')
  async listarCuidadoresDaCrianca(@Param('criancaId') criancaId: string) {
    const queryText = `
      SELECT v.id as vinculo_id, v.pode_editar, u.id as usuario_id, u.nome, u.email, u.tipo
      FROM vinculos_familia v
      JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.crianca_id = $1;
    `;
    
    const resultado = await this.databaseService.query(queryText, [criancaId]);
    return {
      sucesso: true,
      total: resultado.rowCount,
      cuidadores: resultado.rows
    };
  }
}
