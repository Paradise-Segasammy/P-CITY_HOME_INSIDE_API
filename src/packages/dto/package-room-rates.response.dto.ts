import { ApiProperty } from '@nestjs/swagger';

export class DailyRateDto {
  @ApiProperty({ description: '날짜 (YYYYMMDD)', example: '20260716' })
  date: string;

  @ApiProperty({ description: '정상가 Rack Rate. 산출 불가 시 null', example: null, nullable: true })
  basePrice: number | null;

  @ApiProperty({ description: '웹사이트 판매 요금', example: 350000 })
  salePrice: number;

  @ApiProperty({ description: '세금 포함 여부 (Y/N)', example: 'N' })
  isTaxIncluded: 'Y' | 'N';
}

export class PackageRoomRatesResponseDto {
  @ApiProperty({ description: '패키지 번호', example: '12345' })
  packageNumber: string;

  @ApiProperty({ description: '룸 타입 코드', example: 'GAD' })
  roomTypeCode: string;

  @ApiProperty({ description: '일자별 요금 리스트', type: [DailyRateDto] })
  dailyRates: DailyRateDto[];
}
