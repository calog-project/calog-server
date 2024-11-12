import { HttpStatus } from '@nestjs/common';
import { Nullable } from '../type/CommonType';

interface SuccessPayload<D> {
  statusCode: number;
  message: string;
  data: D;
}

export class ApiResponse<P, E> {
  private constructor(
    readonly isSuccess: boolean,
    readonly payload?: Nullable<P>,
    readonly error?: Nullable<E>,
  ) {}

  public static success<P>(
    code: number,
    data?: P,
  ): ApiResponse<SuccessPayload<P> | null, null> {
    const message = code === HttpStatus.CREATED ? 'Created' : 'Success';
    if (data === undefined) {
      return new ApiResponse<SuccessPayload<null>, null>(true, {
        statusCode: code,
        message: message,
        data: null,
      });
    } else {
      return new ApiResponse<SuccessPayload<P>, null>(true, {
        statusCode: code,
        message: message,
        data: data,
      });
    }
  }

  public static error<E>(error: E): ApiResponse<null, E> {
    return new ApiResponse<null, E>(false, undefined, error);
  }
}
