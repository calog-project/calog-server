import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  ExceptionFilter,
  HttpException,
  Logger,
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

    const errorStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const logMessage = `${exception} ` + `${req.method} ${req.path};`;

    if (!(exception instanceof HttpException) || errorStatus >= 500) {
      Logger.error(logMessage, exception.stack, GlobalExceptionFilter.name);
    } else {
      Logger.warn(logMessage, GlobalExceptionFilter.name);
    }

    const error = {
      statusCode: errorStatus,
      message: message,
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
