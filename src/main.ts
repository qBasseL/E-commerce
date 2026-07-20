import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config';
import { ValidationPipe } from '@nestjs/common';
import { LanguageInterceptor, WatchInterceptor } from './common/interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.enableCors({})
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true
  }))
  app.useGlobalInterceptors(new WatchInterceptor(), new LanguageInterceptor())
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  });
}
bootstrap();
