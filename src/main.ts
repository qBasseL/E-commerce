import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config';
import { ValidationPipe } from '@nestjs/common';
import { LanguageInterceptor, ResponseInterceptor, WatchInterceptor } from './common/interceptor';
import * as express from 'express'
import { resolve } from 'node:path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.setGlobalPrefix('api')
  app.enableCors({})
  app.use('/uploads', express.static(resolve('./uploads')))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true
  }))
  app.useGlobalInterceptors(new WatchInterceptor(), new LanguageInterceptor(), new ResponseInterceptor())
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  });
}
bootstrap();
