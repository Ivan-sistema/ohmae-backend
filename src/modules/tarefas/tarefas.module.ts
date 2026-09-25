import { Module } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';
import { TarefasController } from './tarefas.controller.js';

@Module({
  imports: [],
  controllers: [TarefasController],
  providers: [DatabaseService],
})
export class TarefasModule {}
