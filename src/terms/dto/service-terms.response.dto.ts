import { ApiProperty } from '@nestjs/swagger';

/**
 * 서비스 약관 응답 DTO
 */
export class ServiceTermResponseDto {
  @ApiProperty({ example: 'userAppAgree' })
  division!: string;

  @ApiProperty({ enum: ['Y', 'N'], description: '필수 동의 여부', example: 'Y' })
  isY!: string;

  @ApiProperty({ description: 'DB에 등록된 약관 제목', nullable: true })
  title!: string | null;

  @ApiProperty({ description: '기존 필드명 유지. 요청 언어의 표시 제목이며 한국어 전용이 아님', nullable: true })
  koTitle!: string | null;

  @ApiProperty({ description: 'DB에 등록된 약관 본문 (HTML 포함 가능)' })
  content!: string;
}

export class ServiceTermsResponseDto {
  @ApiProperty({ type: [ServiceTermResponseDto] })
  agreementsList!: ServiceTermResponseDto[];
}
