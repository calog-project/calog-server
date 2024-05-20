import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../dto/api-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // if (exception.constructor.name === 'QueryFailedError') {

    // }
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const log = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      // timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      path: req.url,
      payload: message,
    };

    const error = {
      message: message,
      statusCode: status,
    };

    res.status(status).json(ApiResponse.error(error));
    // res.status(status).json(errorPayload);
  }
}
