import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  
  // Ativa a validação global de todos os DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos adicionais que não estão definidos no DTO
    forbidNonWhitelisted: true, // Retorna erro 400 se enviarem campos que não estão no DTO
  }));

  // Habilita o CORS permitindo requisições do seu frontend (Vite)
  app.enableCors({
    origin: 'http://localhost:5173', // URL do seu frontend Vue/React com Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
