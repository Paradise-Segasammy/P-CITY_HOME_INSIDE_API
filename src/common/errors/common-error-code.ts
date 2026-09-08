import { HttpStatus } from '@nestjs/common';

/**
 * 에러 정의
 */
export interface ErrorDefinition {
  readonly code: string;
  readonly httpStatus: HttpStatus;
  readonly message: string;
}

/**
 * 공통 에러 코드
 */
export const CommonErrorCode = {
  /**
   * 리소스 찾을 수 없음
   */
  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    httpStatus: HttpStatus.NOT_FOUND,
    message: 'Requested resource not found.',
  },
} as const satisfies Record<string, ErrorDefinition>;
