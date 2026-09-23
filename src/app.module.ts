import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import { UsuariosController } from './usuarios.controller.js';

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [DatabaseService],
})
export class AppModule {}
