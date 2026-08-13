import { ApiProperty } from '@nestjs/swagger';

export class PackageInfoDto {
  @ApiProperty({ description: '홈페이지 패키지 마스터 번호(RP_SEQ)', example: '12967' })
  masterPackageNumber: string;

  @ApiProperty({ description: 'HMS 패키지 번호(SALESTYPE_SEQ)', example: '2525396' })
  packageNumber: string;

  @ApiProperty({ description: '정렬 순서', example: 100 })
  order: number | null;

  @ApiProperty({ description: '상품명', example: 'SONIC ADVENTURE' })
  name: string;

  @ApiProperty({ description: '상품 요약', example: '[소닉 35주년 기념] 소닉 한정판 굿즈+원더박스+씨메르+수영장', nullable: true })
  summary: string | null;

  @ApiProperty({ description: '키워드', example: 'pool, cimer', nullable: true })
  keyword: string | null;

  @ApiProperty({ description: '추가 키워드', example: 'summer', nullable: true })
  keywordAdd: string | null;

  @ApiProperty({ description: '검색 키워드', example: 'summer sonic', nullable: true })
  searchKeyword: string | null;

  @ApiProperty({ description: '오퍼 타입', example: 'TA' })
  offerType: string;

  @ApiProperty({ description: '오퍼 타입 코드', example: '000001' })
  offerTypeCode: string;

  @ApiProperty({ description: '판매 완료 여부', example: 'N' })
  soldoutYn: 'Y' | 'N';

  @ApiProperty({ description: '대표 이미지 URL', example: 'https://www.p-city.com/upload_file/202606/1782438297490.png', nullable: true })
  imageUrl: string | null;
}

export class PackageListResponseDto {
  @ApiProperty({ description: '패키지 목록', type: [PackageInfoDto] })
  packages: PackageInfoDto[];
}
