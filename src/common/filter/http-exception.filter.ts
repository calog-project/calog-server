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
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    // console.log(exception.constructor.name);
    console.log(exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorPayload = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      // timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      path: req.url,
      payload: message,
    };
    res.status(status).json(ApiResponse.error(status, message));
    // res.status(status).json(errorPayload);
  }
}
