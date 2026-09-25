import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';

@Controller('tarefas')
export class TarefasController {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. Criar uma Tarefa/Rotina para a Criança: POST http://localhost:3000/tarefas/criar
  @Post('criar')
  async criarTarefa(@Body() body: { 
    crianca_id: string; 
    executor_id?: string; 
    titulo: string; 
    categoria: string; 
    horario_agendado: string; 
    instrucoes?: string 
  }) {
    const { crianca_id, executor_id, titulo, categoria, horario_agendado, instrucoes } = body;

    if (!crianca_id || !titulo || !categoria || !horario_agendado) {
      throw new HttpException('Os campos crianca_id, titulo, categoria e horario_agendado são obrigatórios.', HttpStatus.BAD_REQUEST);
    }

       try {
      // Correção Sênior: Alinhamento exato entre colunas e parâmetros (\$1 a \$6)
      const queryText = `
        INSERT INTO tarefas (crianca_id, executor_id, titulo, categoria, horario_agendado, instrucoes, status) 
        VALUES ($1, $2, $3, $4, $5, $6, 'PENDENTE') 
        RETURNING id, crianca_id, executor_id, titulo, categoria, horario_agendado, status, criado_em;
      `;
      
      const resultado = await this.databaseService.query(queryText, [
        crianca_id, 
        executor_id || null, 
        titulo, 
        categoria, 
        horario_agendado,
        instrucoes || null
      ]);
      
      return {
        sucesso: true,
        mensagem: 'Tarefa agendada com sucesso no Ohmae!',
        dados: resultado.rows
      };
    } catch (error: any) {

      throw new HttpException(`Erro ao criar tarefa: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 2. Central "Hoje" - Listar tarefas do dia de uma criança: GET http://localhost:3000/tarefas/hoje/:criancaId
  @Get('hoje/:criancaId')
  async listarTarefasDoDia(@Param('criancaId') criancaId: string) {
    try {
      // Puxa as tarefas da criança agendadas para a data atual (do início ao fim do dia)
      const queryText = `
        SELECT t.id, t.titulo, t.categoria, t.horario_agendado, t.status, t.instrucoes, u.nome as nome_executor
        FROM tarefas t
        LEFT JOIN usuarios u ON t.executor_id = u.id
        WHERE t.crianca_id = $1 AND t.horario_agendado::date = CURRENT_DATE
        ORDER BY t.horario_agendado ASC;
      `;
      
      const resultado = await this.databaseService.query(queryText, [criancaId]);
      
      return {
        sucesso: true,
        data: new Date().toLocaleDateString('pt-BR'),
        total: resultado.rowCount,
        tarefas: resultado.rows
      };
    } catch (error: any) {
      throw new HttpException(`Erro ao buscar tarefas de hoje: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 3. Babá ou Pai conclui a tarefa (Módulo 4 e 5): PATCH http://localhost:3000/tarefas/concluir/:id
  @Patch('concluir/:id')
  async concluirTarefa(@Param('id') id: string, @Body() body: { observacao_execucao?: string; foto_url?: string }) {
    const { observacao_execucao, foto_url } = body;

    try {
      const queryText = `
        UPDATE tarefas 
        SET status = 'CONCLUIDO', realizado_em = CURRENT_TIMESTAMP, observacao_execucao = $1, foto_url = $2
        WHERE id = $3
        RETURNING id, titulo, status, realizado_em, observacao_execucao, foto_url;
      `;
      
      const resultado = await this.databaseService.query(queryText, [observacao_execucao || null, foto_url || null, id]);
      
      if (resultado.rowCount === 0) {
        throw new HttpException('Tarefa não encontrada.', HttpStatus.NOT_FOUND);
      }

      return {
        sucesso: true,
        mensagem: 'Tarefa concluída e enviada para o histórico dos pais!',
        dados: resultado.rows
      };
    } catch (error: any) {
      throw new HttpException(`Erro ao concluir tarefa: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
