import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

export class SetTokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();
        if (data.token) {
          res.setHeader('Authorization', `Bearer ${data.token.accessToken}`);
          res.cookie('refreshToken', data.token.refreshToken);
        }
        delete data.token;
        return data;
      }),
    );
  }
}
