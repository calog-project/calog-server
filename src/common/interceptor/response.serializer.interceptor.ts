import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../dto/api-response';
import { instanceToPlain } from 'class-transformer';

export class ResponseSerializerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ):
    | Observable<ApiResponse<unknown, unknown>>
    | Promise<Observable<ApiResponse<unknown, unknown>>> {
    context.switchToHttp().getResponse().status(HttpStatus.OK);
    return next.handle().pipe(
      map((data) => ApiResponse.success(instanceToPlain(data))),
      //응답 로깅
      tap((data) => {}),
    );
  }
}
