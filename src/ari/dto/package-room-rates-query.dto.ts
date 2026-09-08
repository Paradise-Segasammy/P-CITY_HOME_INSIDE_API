import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 패키지 룸 요금 조회 쿼리 DTO
 */
export class PackageRoomRatesQueryDto {
  @ApiPropertyOptional({
    description: '조회 시작일 (YYYYMMDD)',
    example: '20260716',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'startSearchDate must be YYYYMMDD' })
  startSearchDate?: string;

  @ApiPropertyOptional({
    description: '조회 종료일 (YYYYMMDD)',
    example: '20260720',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'endSearchDate must be YYYYMMDD' })
  endSearchDate?: string;
}
