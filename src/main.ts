// import 'dotenv/config'

import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { loggingInterceptor } from './common/interceptor/logging.interceptor';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';

import { AppModule } from './app.module';
import { AllConfigType } from './common/config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<AllConfigType>);
  const appConfig = configService.getOrThrow('app', { infer: true });

  app.setGlobalPrefix(appConfig.apiPrefix, {
    exclude: ['/'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new loggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new GlobalExceptionFilter(appConfig.nodeEnv));

  await app.listen(appConfig.port, () => {
    console.log(`🌐 HTTP Server listening on port ${appConfig.port} 🌐`);
  });
}
bootstrap();
