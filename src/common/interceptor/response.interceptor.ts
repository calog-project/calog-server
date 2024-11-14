import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../dto/api-response';

export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ):
    | Observable<ApiResponse<unknown, unknown>>
    | Promise<Observable<ApiResponse<unknown, unknown>>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const statusCode = res.statusCode | HttpStatus.OK;
    return next.handle().pipe(
      map((data) => {
        const isRequireRedirect =
          statusCode >= 300 && statusCode < 400 && req.query?.redirect && data;
        if (isRequireRedirect) {
          res.redirect(data.url);
        } else {
          return ApiResponse.success(statusCode, data);
        }
      }),
      //응답 로깅
      tap((data) => {}),
    );
  }
}
