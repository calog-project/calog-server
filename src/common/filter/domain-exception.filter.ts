import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../domain/domain-error';
import { ApiResponse } from '../dto/api-response';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const errorStatus = HttpStatus.BAD_REQUEST;

    const logMessage =
      `${req.method} ${req.path}; ` +
      `${exception.constructor.name}: ${exception.message}`;

    const error = {
      statusCode: errorStatus,
      message: exception.message,
    };

    Logger.warn(logMessage, DomainExceptionFilter.name);
    res.status(errorStatus).json(ApiResponse.error(error));
  }
}
