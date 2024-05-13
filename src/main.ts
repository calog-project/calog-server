// import 'dotenv/config'

import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseSerializerInterceptor } from './common/interceptor/response.serializer.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<AllConfigType>);
  const appConfig = configService.getOrThrow('app', { infer: true });

  app.setGlobalPrefix(appConfig.apiPrefix, {
    exclude: ['/'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResponseSerializerInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(appConfig.port, () => {
    console.log(`🌐 HTTP Server listening on port ${appConfig.port} 🌐`);
  });
}
bootstrap();
