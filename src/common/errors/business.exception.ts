import { HttpException } from '@nestjs/common';
import { ErrorDefinition } from './common-error-code';

/**
 * 비즈니스 로직 예외
 */
export class BusinessException extends HttpException {
  readonly code: string;

  constructor(error: ErrorDefinition) {
    super(error.message, error.httpStatus);
    this.code = error.code;
  }
}
