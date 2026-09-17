import { ApiProperty } from '@nestjs/swagger';

/**
 * 아이디 중복 확인 응답 DTO
 */
export class IdDuplicationResponseDto {
  @ApiProperty({ description: '조회 기준 사용자 아이디', example: 'user@example.com' })
  /**
   * 조회 기준 사용자 아이디
   */
  userId: string;

  @ApiProperty({ description: '아이디 사용 가능 여부', example: true })
  /**
   * 아이디 사용 가능 여부
   */
  available: boolean;

  @ApiProperty({ description: '아이디 중복 여부', example: false })
  /**
   * 아이디 중복 여부
   */
  duplicated: boolean;

  @ApiProperty({ description: '기존 app_api_server 기준 결과 코드', example: 200 })
  /**
   * 기존 app_api_server 기준 결과 코드
   */
  legacyResultCode: 200 | 411;
}
