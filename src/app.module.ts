import { Module } from '@nestjs/common';
import { CriancasModule } from './modules/criancas/criancas.module.js'; // Novo import
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';

@Module({
  imports: [UsuariosModule, CriancasModule], // Plugado aqui!
  controllers: [],
  providers: [],
})
export class AppModule {}
