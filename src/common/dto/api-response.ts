import { HttpStatus } from '@nestjs/common';

//D data, P payload , D가 있는 success, P가 있는 Error, 둘다 없는 success의 케이스
export class ApiResponse<D, P> {
  private constructor(
    readonly isSuccess: boolean,
    readonly statusCode: number,
    readonly data?: D | null,
    readonly payload?: P | null,
  ) {}

  //overload
  public static success(): ApiResponse<null, null>;
  public static success<D>(data: D): ApiResponse<D, null>;

  //impl
  public static success<D>(data?: D): ApiResponse<D | null, null> {
    if (data === undefined) {
      //가 없는 success
      return new ApiResponse<null, null>(true, HttpStatus.OK, null, null);
    } else {
      return new ApiResponse<D, null>(true, HttpStatus.OK, data, null);
    }
  }

  public static error<P>(code: number, errorPayload: P): ApiResponse<null, P> {
    return new ApiResponse<null, P>(false, code, null, errorPayload);
  }
}
// Define the generic ApiResponse class with the generic type S for success data
// class ApiResponse<S> {
//   // Properties are private and final in Java, we can use readonly in TypeScript to enforce immutability
//   private readonly isSuccess: boolean;
//   private readonly data: S | null;
//   private readonly error: ErrorPayload | null;

//   // Private constructor to control the creation of instances through the static methods
//   private constructor(isSuccess: boolean, data: S | null, error: ErrorPayload | null) {
//     this.isSuccess = isSuccess;
//     this.data = data;
//     this.error = error;
//   }

//   // Static method to handle success responses without data
//   public static success(): ApiResponse<null> {
//     return new ApiResponse<null>(true, null, null);
//   }

//   // Static method to handle success responses with data
//   public static success<S>(data: S): ApiResponse<S> {
//     return new ApiResponse<S>(true, data, null);
//   }

//   // Static method to handle error responses
//   public static error(error: ErrorPayload): ApiResponse<null> {
//     return new ApiResponse<null>(false, null, error);
//   }

//   // Getter methods to access the private properties
//   public getIsSuccess(): boolean {
//     return this.isSuccess;
//   }

//   public getData(): S | null {
//     return this.data;
//   }

//   public getError(): ErrorPayload | null {
//     return this.error;
//   }
// }

// // Define the ErrorPayload class or interface, assuming its structure is known
// interface ErrorPayload {
//   // Placeholder properties of the ErrorPayload
//   message: string;
//   code: number;
// }

// public class ApiResponse<S> {

//   private final boolean isSuccess;

//   private final S data;

//   private final ErrorPayload error;

//   private ApiResponse(boolean isSuccess, S data, ErrorPayload error) {
//       this.isSuccess = isSuccess;
//       this.data = data;
//       this.error = error;
//   }

//   public static ApiResponse<?> success() {
//       return new ApiResponse<>(true, null, null);
//   }

//   public static <S> ApiResponse<S> success(S data) {
//       return new ApiResponse<>(true, data, null);
//   }

//   public static ApiResponse<?> error(ErrorPayload error) {
//       return new ApiResponse<>(false, null, error);
//   }

//   public boolean getIsSuccess() {
//       return isSuccess;
//   }

//   public Object getData() {
//       return data;
//   }

//   public ErrorPayload getError() {
//       return error;
//   }

// }
