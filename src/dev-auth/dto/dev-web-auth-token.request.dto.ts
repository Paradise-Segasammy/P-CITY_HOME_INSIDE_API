import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 개발용 Web Auth Token 요청 DTO
 */
export class DevWebAuthTokenRequestDto {
  @ApiProperty({
    description: '로그인 응답의 subject',
    example: '0000047306',
  })
  @IsString()
  @Matches(/^\d{10}$/)
  subject!: string;

  @ApiPropertyOptional({
    description: '개발 Access JWT 유효시간(초). 기본 300, 최대 86400',
    example: 28800,
    minimum: 1,
    maximum: 86400,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(86400)
  expiresIn?: number;
}
