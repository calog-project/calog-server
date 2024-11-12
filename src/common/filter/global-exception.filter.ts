import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { ApiResponse } from '../dto/api-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly _configService: ConfigService<AllConfigType>) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    if (!(exception instanceof HttpException)) console.log(exception);
    const errorStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const error = {
      statusCode: errorStatus,
      message: message,
    };

    const log = {
      statusCode: errorStatus,
      timestamp: new Date().toISOString(),
      // timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      path: req.url,
      payload: message,
    };

    if (req.query.redirect) {
      const clientUrl = this._configService.get('app.clientUrl', {
        infer: true,
      });
      const redirectUrl = `${clientUrl}/?error=${encodeURIComponent(errorStatus)}`;
      res.cookie('error', error, { maxAge: 5000 });
      res.redirect(redirectUrl);
    } else {
      res.status(errorStatus).json(ApiResponse.error(error));
    }
  }
}
