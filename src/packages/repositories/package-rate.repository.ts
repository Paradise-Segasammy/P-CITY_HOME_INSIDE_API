import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
/**
 * 패키지 룸 타입별 일자별 요금 조회 결과
 */
export interface PackageRoomRateRow {
  date: string; // 일자
  basePrice?: number | null; // 기준 가격
  salePrice: number; // 판매 가격
  isTaxIncluded?: 'Y' | 'N' | null; // 세금 포함 여부
}
/**
 * 패키지 룸 타입별 일자별 요금 조회 커맨드
 */
export interface FindPackageRoomRatesCommand {
  packageNumber: string; // 패키지 번호
  roomCode: string; // 룸 타입 코드
  startSearchDate?: string; // 시작 일자
  endSearchDate?: string; // 종료 일자
}

@Injectable()
export class PackageRateRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 패키지 룸 타입별 일자별 요금 조회
   * @param command packageNumber, roomCode, startSearchDate, endSearchDate
   * @returns Promise<PackageRoomRateRow[]>
   */
  async findPackageRoomRates(command: FindPackageRoomRatesCommand): Promise<PackageRoomRateRow[]> {
    const branchCd = this.configService.get<string>('home.defaultBranchCd', '1000');
    const channel = this.configService.get<string>('home.channel', 'WEB');
    const startDate = command.startSearchDate ?? this.formatDate(new Date());
    const endDate = command.endSearchDate ?? this.formatDate(this.addDays(new Date(), 30));

    const result = await this.databaseService.execute<{
      date: string;
      basePrice: number | null;
      salePrice: number;
      isTaxIncluded: 'Y' | 'N';
    }>(
      `
      /* 1. 패키지/룸타입/일자 조건에 맞는 HMS 요금 원천 row를 조회 */
      WITH RATE_ROWS AS (
        SELECT P.RATEDATE,
               P.RMTYPE,
               TO_NUMBER(HM_ROOM_RATE_WEB_FUN@PCT(
                 :branchCd,
                 'ROOMRATE',
                 '0000000000',
                 P.SALESTYPE,
                 '0',
                 P.SALESTYPE_SEQ,
                 :channel,
                 P.RMTYPE,
                 P.RATEDATE,
                 TO_CHAR(TO_DATE(P.RATEDATE, 'YYYYMMDD') + 1, 'YYYYMMDD'),
                 '',
                 '1',
                 '0'
               )) AS SALE_PRICE,
              /* ROOMRATE_ST: ROOMRATE에 대응되는 세금/봉사료 금액. basePrice 임시 산정에 사용 */
               TO_NUMBER(HM_ROOM_RATE_WEB_FUN@PCT(
                 :branchCd,
                 'ROOMRATE_ST',
                 '0000000000',
                 P.SALESTYPE,
                 '0',
                 P.SALESTYPE_SEQ,
                 :channel,
                 P.RMTYPE,
                 P.RATEDATE,
                 TO_CHAR(TO_DATE(P.RATEDATE, 'YYYYMMDD') + 1, 'YYYYMMDD'),
                 '',
                 '1',
                 '0'
               )) AS TAX_PRICE
          FROM HM_RPM_SALESTYPE_RATE_PHM_V@PCT P
         WHERE P.SALESTYPE_SEQ = :packageNumber
           AND P.RMTYPE = :roomCode
           AND P.RATEDATE BETWEEN :startDate AND :endDate
           AND P.CHANNEL = :channel
           AND P.QTY > 0
           AND P.ROOM_USE_YN = 'Y'
           AND P.BRANCH_CD = :branchCd
           AND P.SALES_CUST_NO = '0000000000'
      ),
      /* 2. 동일 일자에 여러 룸타입/요금 row가 있을 수 있어, 일자별 최저 판매가 row 하나를 선택 */
      RANKED_RATE_ROWS AS (
        SELECT RATEDATE,
               RMTYPE,
               SALE_PRICE,
               TAX_PRICE,
               -- FIXME: basePrice is temporarily treated as tax-included normal sale price.
               SALE_PRICE + TAX_PRICE AS BASE_PRICE,
               ROW_NUMBER() OVER (
                 PARTITION BY RATEDATE
                 ORDER BY SALE_PRICE ASC, RMTYPE ASC
               ) AS RN
          FROM RATE_ROWS
      )
      /* 3. 선택된 같은 row의 basePrice/salePrice를 내려서 서로 다른 row의 최저값이 섞이지 않게 처리 */
      SELECT RATEDATE AS "date",
             BASE_PRICE AS "basePrice",
             SALE_PRICE AS "salePrice",
             'N' AS "isTaxIncluded"
        FROM RANKED_RATE_ROWS
       WHERE RN = 1
       ORDER BY RATEDATE
      `,
      {
        branchCd,
        channel,
        packageNumber: command.packageNumber,
        roomCode: command.roomCode,
        startDate,
        endDate,
      },
    );

    return result.rows ?? [];
  }

  /**
   * 날짜 추가
   * @param date Date
   * @param days number
   * @returns Date
   */
  private addDays(date: Date, days: number) {
    const copied = new Date(date);
    copied.setDate(copied.getDate() + days);
    return copied;
  }

  /**
   * 날짜 포맷팅
   * @param date Date
   * @returns string
   */
  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
