import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const SERVICE_TERMS_TYPES = ['JOIN', 'GROUP', 'PAYMENT', 'PAYMENT_GUEST', 'DINING_PAYMENT', 'CASINO'] as const;
export type ServiceTermsType = (typeof SERVICE_TERMS_TYPES)[number];
export const SERVICE_TERMS_LANGUAGES = ['KO', 'EN', 'JA', 'ZNCN', 'ZNTW'] as const;
export type ServiceTermsLanguage = (typeof SERVICE_TERMS_LANGUAGES)[number];

/**
 * 서비스 약관 조회 쿼리 DTO
 */
export class ServiceTermsQueryDto {
  @ApiProperty({ enum: SERVICE_TERMS_TYPES, example: 'JOIN', description: '약관 조회 구분' })
  @IsIn(SERVICE_TERMS_TYPES)
  gubun!: ServiceTermsType;

  @ApiProperty({ enum: SERVICE_TERMS_LANGUAGES, example: 'KO', description: '요청 언어. 결제·다이닝 본문은 기존 정책에 따라 KO 조회' })
  @IsIn(SERVICE_TERMS_LANGUAGES)
  LANG!: ServiceTermsLanguage;
}
