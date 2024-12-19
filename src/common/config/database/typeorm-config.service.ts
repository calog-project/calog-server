import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AllConfigType } from '../config.type';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly isProd: boolean;
  constructor(private configService: ConfigService<AllConfigType>) {
    this.isProd =
      this.configService.get('app.nodeEnv', { infer: true }) === 'production';
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log(this.configService.get('db.type', { infer: true }));
    return {
      type: this.configService.get('db.type', { infer: true }),
      host: this.configService.get('db.host', { infer: true }),
      port: this.configService.get('db.port', { infer: true }),
      username: this.configService.get('db.username', { infer: true }),
      password: this.configService.get('db.password', { infer: true }),
      database: this.configService.get('db.name', { infer: true }),
      synchronize: this.configService.get('db.synchronize', { infer: true }),
      dropSchema: false,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      migrations: [
        __dirname + '/../../../common/config/database/migrations/**/*{.ts,.js}',
      ],
      namingStrategy: new SnakeNamingStrategy(),
      timezone: '+00:00',
    } as TypeOrmModuleOptions;
  }
}
