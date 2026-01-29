import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for PWA frontend
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`🚀 WantToGo API running on http://localhost:${port}`);
}
bootstrap();
