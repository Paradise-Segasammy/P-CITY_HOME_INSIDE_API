import { ApiProperty } from '@nestjs/swagger';

/**
 * 성공 응답 DTO
 */
export class ApiSuccessResponseDto {
  @ApiProperty({ type: Boolean, enum: [true], example: true })
  success: true;

  @ApiProperty({ type: String, format: 'date-time' })
  timestamp: string;

  @ApiProperty({ type: String, example: '/api/terms?gubun=JOIN&LANG=KO' })
  path: string;
}
