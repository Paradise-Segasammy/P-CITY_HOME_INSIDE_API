import { ApiProperty } from '@nestjs/swagger';

/**
 * 비밀번호 변경 유예 시각 갱신 완료 응답 DTO
 */
export class PasswordChangeLaterResponseDto {
  @ApiProperty({ description: '비밀번호 변경 유예 시각 갱신 완료 여부', example: true })
  updated: boolean;
}
