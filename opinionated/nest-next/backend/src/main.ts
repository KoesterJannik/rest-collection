import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './services/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
  const configService = app.get(ConfigService);
  const PORT = Number(configService.get('PORT'));
  await app.listen(PORT);
}
bootstrap();
