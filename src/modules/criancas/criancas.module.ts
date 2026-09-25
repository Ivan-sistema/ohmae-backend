import { Module } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';
import { CriancasController } from './criancas.controller.js';

@Module({
  imports: [],
  controllers: [CriancasController],
  providers: [DatabaseService],
})
export class CriancasModule {}
