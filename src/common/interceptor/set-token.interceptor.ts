import { ConfigService } from '@nestjs/config';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { CookieOptions, Response } from 'express';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class SetTokenInterceptor implements NestInterceptor {
  constructor(private readonly _configService: ConfigService<AllConfigType>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse<Response>();
        if (data && data.token) {
          const app = this._configService.get('app', {
            infer: true,
          });
          const cookieConfig: CookieOptions = {
            httpOnly: app.nodeEnv === 'production',
            secure: app.nodeEnv === 'production',
            sameSite: app.nodeEnv === 'production' ? 'none' : 'lax',
            maxAge: this._configService.get('auth.jwtRefreshExpirationTime', {
              infer: true,
            }),
            domain: app.nodeEnv ? app.origin.split(':')[1].slice(2) : undefined,
          };
          res.setHeader('Authorization', `Bearer ${data?.token.accessToken}`);
          res.cookie('refreshToken', data?.token.refreshToken, cookieConfig);
          delete data.token;
        }
        return data;
      }),
    );
  }
}
