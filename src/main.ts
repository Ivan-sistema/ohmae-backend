import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common'; // Import Adicionado

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(); // Garante que o emulador consiga se conectar livremente

  // Ativação do Pipe Sênior sugerido pelo Claude
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remove campos extras não mapeados no DTO
      forbidNonWhitelisted: true, // Rejeita a requisição se mandarem lixo
      transform: true,            // Transforma os dados brutos no tipo do DTO
    }),
  );

  await app.listen(3000);
}
bootstrap();