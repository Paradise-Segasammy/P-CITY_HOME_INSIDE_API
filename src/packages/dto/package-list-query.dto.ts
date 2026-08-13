import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class PackageListQueryDto {
  @ApiPropertyOptional({ description: '언어 코드', example: 'KO', default: 'KO' })
  @IsOptional()
  @IsString()
  langSet?: string;

  @ApiPropertyOptional({ description: '노출 채널', example: 'WEB', default: 'WEB', enum: ['WEB', 'MOB'] })
  @IsOptional()
  @IsIn(['WEB', 'MOB'])
  channel?: 'WEB' | 'MOB';

  @ApiPropertyOptional({ description: '중국 지역 노출 여부', example: 'N', default: 'N', enum: ['Y', 'N'] })
  @IsOptional()
  @IsIn(['Y', 'N'])
  pCnYn?: 'Y' | 'N';

  @ApiPropertyOptional({ description: 'SBU 코드', example: '000001', default: '000001' })
  @IsOptional()
  @IsString()
  sbuCd?: string;
}
