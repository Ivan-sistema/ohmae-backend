import { Module } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service.js';
import { VinculosController } from './vinculos.controller.js';

@Module({
  imports: [],
  controllers: [VinculosController],
  providers: [DatabaseService],
})
export class VinculosModule {}
