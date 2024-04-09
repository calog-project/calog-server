//config
import appConfig from './app.config';
import databaseConfig from 'src/database/config/database.config';

export class Config {
  static configOption() {
    return {
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath:
        `${process.env.NODE_ENV}` === 'production' ? '.env' : '.env.dev',
    };
  }
}
