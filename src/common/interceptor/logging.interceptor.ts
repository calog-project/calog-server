import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../dto/api-response';

export class loggingInterceptor implements NestInterceptor {
  constructor(private readonly _logger = new Logger()) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ):
    | Observable<ApiResponse<unknown, unknown>>
    | Promise<Observable<ApiResponse<unknown, unknown>>> {
    const req = context.switchToHttp().getRequest();
    const reqStartTiem: number = Date.now();

    return next.handle().pipe(
      tap((): void => {
        const reqFinishTime: number = Date.now();

        const message: string =
          `${req.method} ${req.path}; ` + `${reqFinishTime - reqStartTiem}ms`;

        Logger.log(message, loggingInterceptor.name);
      }),
    );
  }
}
