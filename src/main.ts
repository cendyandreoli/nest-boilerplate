import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import tracer from 'dd-trace';
import { LoggerErrorInterceptor } from 'nestjs-pino';

import { LoggerService } from '@infra/logger/logger.service';

import { AppModule } from './app.module';
import { APP_NAME, ENV, PORT, SERVICE, VERSION } from './config/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD,OPTIONS',
    allowedHeaders:
      'Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
  });

  const LoggerServiceInstance = app.get(LoggerService);

  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription('Documentação da api para integração com o backend')
    .setVersion(VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useLogger(LoggerServiceInstance);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();

  app.listen(PORT).then(() => {
    LoggerServiceInstance.log(`Server running on port ${PORT}!`);
  });
}

tracer.init({
  service: SERVICE,
  env: ENV,
  version: VERSION,
  runtimeMetrics: true,
  logInjection: true,
});


bootstrap();
