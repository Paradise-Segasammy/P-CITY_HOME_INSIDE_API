import { ApiProperty } from '@nestjs/swagger';

/**
 * 개발용 Web Auth Token 응답 DTO
 */
export class DevWebAuthTokenResponseDto {
  @ApiProperty({ description: 'Swagger Authorize의 member-access-token에 입력할 JWT' })
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ description: 'JWT subject', example: '0000047306' })
  subject!: string;

  @ApiProperty({ description: '유효시간(초)', example: 28800 })
  expiresIn!: number;
}
