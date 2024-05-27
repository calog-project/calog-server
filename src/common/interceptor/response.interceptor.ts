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
    const statusCode =
      context.switchToHttp().getResponse().statusCode | HttpStatus.OK;
    return next.handle().pipe(
      map((data) => ApiResponse.success(statusCode, data)),
      //응답 로깅
      tap((data) => {}),
    );
  }
}
