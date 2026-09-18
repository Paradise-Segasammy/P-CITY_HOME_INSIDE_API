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
  MEMBER_PASSWORD_MISMATCH: {
    code: 'MEMBER_PASSWORD_MISMATCH', httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
    message: '현재 비밀번호가 일치하지 않습니다.',
  },
  AGREEMENT_UPDATE_BUSY: {
    code: 'AGREEMENT_UPDATE_BUSY', httpStatus: HttpStatus.CONFLICT,
    message: '회원 약관이 업데이트 중입니다. 나중에 다시 시도하세요.',
  },
  EMPLOYEE_ALREADY_REGISTERED: {
    code: 'EMPLOYEE_ALREADY_REGISTERED', httpStatus: HttpStatus.CONFLICT,
    message: 'Employee ID 이미 등록된 사원입니다.',
  },
  EMPLOYEE_NOT_MATCHED: {
    code: 'EMPLOYEE_NOT_MATCHED', httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
    message: '사원 정보를 고유하게 매칭할 수 없습니다.',
  },
  MEMBER_PHONE_INVALID: {
    code: 'MEMBER_PHONE_INVALID', httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
    message: '회원 전화번호는 사원 인증에 유효하지 않습니다.',
  },
  EMPLOYEE_REGISTRATION_BUSY: {
    code: 'EMPLOYEE_REGISTRATION_BUSY', httpStatus: HttpStatus.CONFLICT,
    message: '사원 등록이 비어있습니다. 나중에 다시 시도하세요.',
  },
  /**
   * 리소스 찾을 수 없음
   */
  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    httpStatus: HttpStatus.NOT_FOUND,
    message: '요청한 리소스를 찾을 수 없습니다.',
  },
} as const satisfies Record<string, ErrorDefinition>;
