import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { RedisModule } from '@nestjs-modules/ioredis';
// import {} from '@nestjs/mongoose';

//config
import { Config } from './config/config';
import { AllConfigType } from './config/config.type';

//module
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

/**
 * @TODO
 * refactor - DB의 세부사항(ex, typeorm, mongo)의 변경에 의해 usecase가 바뀌면 안됨.
 * solution - repository 추상화
 */

@Module({
  imports: [
    ConfigModule.forRoot(Config.configOption()),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    //need refactor
    RedisModule.forRoot({
      type: 'single',
      url: `redis://default:${process.env.REDIS_TOKEN}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
