/**
 * @TODO mongoDB 도입 시 타입 추가
 * */

export type DatabaseConfig = {
  url?: string; //mongoDB
  type: string; //RDB type
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
};
