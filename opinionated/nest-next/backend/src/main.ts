import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './services/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Api Dokumentation')
    .setDescription('Api Dokumentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const PORT = Number(configService.get('PORT'));
  await app.listen(PORT);
}
bootstrap();
