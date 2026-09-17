import { ApiProperty } from '@nestjs/swagger';

/**
 * 회원 임직원 사번 등록 응답 DTO
 */
export class EmployeeResponseDto {
  @ApiProperty({ example: true })
  /**
   * 회원-임직원 매핑 등록 여부
   */
  registered!: boolean;
}
