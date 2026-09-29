import { Module } from '@nestjs/common';
import { CriancasModule } from './modules/criancas/criancas.module.js';
import { TarefasModule } from './modules/tarefas/tarefas.module.js'; // Novo import
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { VinculosModule } from './modules/vinculos/vinculos.module.js';

@Module({
  imports: [UsuariosModule, CriancasModule, VinculosModule, TarefasModule], // Plugado!
  controllers: [],
  providers: [],
})
export class AppModule {}
