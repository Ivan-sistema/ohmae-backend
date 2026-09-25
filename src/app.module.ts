import { Module } from '@nestjs/common';
import { CriancasModule } from './modules/criancas/criancas.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { VinculosModule } from './modules/vinculos/vinculos.module.js'; // Novo import

@Module({
  imports: [UsuariosModule, CriancasModule, VinculosModule], // Plugado com sucesso!
  controllers: [],
  providers: [],
})
export class AppModule {}
