import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';
import { DatabaseService } from '../../core/database/database.service.js';

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [UsuariosService, DatabaseService], // Sincronizados!
})
export class UsuariosModule {}
