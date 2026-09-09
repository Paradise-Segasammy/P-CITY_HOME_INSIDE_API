import { findPackageRoomRatesQuery } from './queries/package-rate.queries';
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
  startSearchDate: string; // 시작 일자
  endSearchDate: string; // 종료 일자
}

/**
 * 패키지 룸 요금 조회 리포지토리
 */
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

    const result = await this.databaseService.execute<{
      date: string;
      basePrice: number | null;
      salePrice: number;
      isTaxIncluded: 'Y' | 'N';
    }>(
      findPackageRoomRatesQuery,
      {
        branchCd,
        channel,
        packageNumber: command.packageNumber,
        roomCode: command.roomCode,
        startDate: command.startSearchDate,
        endDate: command.endSearchDate,
      },
    );

    return result.rows ?? [];
  }

}
