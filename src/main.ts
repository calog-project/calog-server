// import 'dotenv/config'

import { NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  Logger as NestLogger,
  ClassSerializerInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { loggingInterceptor } from './common/interceptor/logging.interceptor';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';

import { AppModule } from './app.module';
import { AllConfigType } from './common/config/config.type';
import { DomainExceptionFilter } from './common/filter/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['log'] : ['debug'],
  });
  const configService = app.get(ConfigService<AllConfigType>);
  const appConfig = configService.getOrThrow('app', { infer: true });
  const redisConfig = configService.getOrThrow('redis', { infer: true });
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host: redisConfig.pubHost,
        port: redisConfig.pubPort,
        password: redisConfig.pubToken,
        tls: {},
      },
    });
  app.setGlobalPrefix(appConfig.apiPrefix, {
    exclude: ['/'],
  });
  if (appConfig.nodeEnv === 'production') {
    app.enableCors({
      origin: appConfig.origin.split(','),
      credentials: true,
      exposedHeaders: ['Authorization'],
    });
  } else {
    app.enableCors({
      origin: appConfig.origin.split(','),
      credentials: true,
    });
  }
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new loggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(
    new GlobalExceptionFilter(configService),
    new DomainExceptionFilter(),
  );
  await app.listen(appConfig.port, () => {
    NestLogger.log(
      `🌐 HTTP Server listening on url ${appConfig.url} 🌐`,
      'Main',
    );
    NestLogger.log(
      `🌐 HTTP Server listening on port ${appConfig.port} 🌐`,
      'Main',
    );
  });
  await microservice.listen();
  NestLogger.log(`🌐 microservice listening 🌐`, 'Main');
}
bootstrap();
