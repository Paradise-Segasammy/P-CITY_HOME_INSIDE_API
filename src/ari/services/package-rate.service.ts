import { BadRequestException, Injectable } from '@nestjs/common';
import { PackageRoomRatesQueryDto } from '../dto/package-room-rates-query.dto';
import { PackageRoomRatesParamDto } from '../dto/package-room-rates-param.dto';
import { PackageRateRepository } from '../repositories/package-rate.repository';
import { toPackageRoomRatesResponse } from '../mappers/package-room-rates.mapper';
import { addDays, formatDate } from '../utils/date.util';

const DEFAULT_SEARCH_DAYS = 30;

/**
 * 패키지 룸 타입별 요금 조회 서비스
 */
@Injectable()
export class PackageRateService {
  constructor(private readonly packageRateRepository: PackageRateRepository) {}

  /**
   * 패키지 룸 타입별 일자별 요금 조회
   * @param params packageNumber, roomCode
   * @param query startSearchDate, endSearchDate
   * @returns PackageRoomRatesResponseDto 
   */
  async getPackageRoomRates(params: PackageRoomRatesParamDto, query: PackageRoomRatesQueryDto) {
    const now = new Date();
    const startSearchDate = query.startSearchDate ?? formatDate(now);
    const endSearchDate = query.endSearchDate ?? formatDate(addDays(now, DEFAULT_SEARCH_DAYS));
    this.validateSearchRange(startSearchDate, endSearchDate);

    const rows = await this.packageRateRepository.findPackageRoomRates({
      packageNumber: params.packageNumber,
      roomCode: params.roomCode.toUpperCase(),
      startSearchDate,
      endSearchDate,
    });

    return toPackageRoomRatesResponse(params.packageNumber, params.roomCode.toUpperCase(), rows);
  }

  /**
   * 날짜 검증
   * @param startSearchDate 시작 일자
   * @param endSearchDate 종료 일자
   */
  private validateSearchRange(startSearchDate: string, endSearchDate: string) {
    if (startSearchDate > endSearchDate) {
      throw new BadRequestException('startSearchDate must be earlier than or equal to endSearchDate');
    }
  }
}
