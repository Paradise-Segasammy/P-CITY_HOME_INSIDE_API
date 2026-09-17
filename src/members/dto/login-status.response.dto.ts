import { ApiProperty } from '@nestjs/swagger';

export type MemberStatus = 'ACTIVE' | 'NOT_FOUND' | 'LOCKED' | 'IDENTITY_UNAVAILABLE';

/**
 * 로그인 상태 확인 응답 DTO
 */
export class LoginStatusResponseDto {
  @ApiProperty({ description: '펜타 토큰 발급 가능 여부. 이 값이 true일 때만 발급', example: true })
  authenticated: boolean;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'JWT sub로 사용할 고객번호. 개발 계약',
    example: '1000000001',
  })
  subject: string | null;

  @ApiProperty({ type: String, nullable: true, description: '인증 성공 시 고객번호', example: '1000000001' })
  custNo: string | null;
  @ApiProperty({ description: '조회 기준 사용자 아이디', example: 'user@example.com' })
  /**
   * 조회 기준 사용자 아이디
   */
  userId: string;

  @ApiProperty({
    description: '회원 상태',
    enum: ['ACTIVE', 'NOT_FOUND', 'LOCKED', 'IDENTITY_UNAVAILABLE'],
    example: 'ACTIVE',
  })
  /**
   * 회원 상태
   */
  memberStatus: MemberStatus;

  @ApiProperty({ description: '비밀번호 일치 여부', example: true })
  /**
   * 비밀번호 일치 여부
   */
  passwordMatched: boolean;

  @ApiProperty({ description: '연속 로그인 실패횟수', example: 0 })
  /**
   * 연속 로그인 실패횟수
   */
  passwordFailCount: number;

  @ApiProperty({ description: '로그인 실패 제한횟수', example: 5 })
  /**
   * 로그인 실패 제한횟수
   */
  passwordFailLimit: number;
}
