import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'warn', 'error'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app.listen(port);
  console.log('Application started at:', await app.getUrl());
}
bootstrap();
