import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

export class SetTokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        if (data && data.token) {
          res.setHeader('Authorization', `Bearer ${data?.token.accessToken}`);
          res.cookie('refreshToken', data?.token.refreshToken);
          delete data.token;
        }
        if (!/\/auth\/(kakao|google)/.test(req.path)) {
          return data;
        }
      }),
    );
  }
}
