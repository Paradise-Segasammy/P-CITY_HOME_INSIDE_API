import { BadRequestException, Injectable } from '@nestjs/common';
import { PackageRoomRatesQueryDto } from './dto/package-room-rates-query.dto';
import { PackageRoomRatesParamDto } from './dto/package-room-rates-param.dto';
import { PackageRateRepository } from './repositories/package-rate.repository';
import { toPackageRoomRatesResponse } from './mappers/package-room-rates.mapper';

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
    this.validateSearchRange(query);

    const rows = await this.packageRateRepository.findPackageRoomRates({
      packageNumber: params.packageNumber,
      roomCode: params.roomCode.toUpperCase(),
      startSearchDate: query.startSearchDate,
      endSearchDate: query.endSearchDate,
    });

    return toPackageRoomRatesResponse(params.packageNumber, params.roomCode.toUpperCase(), rows);
  }

  /**
   * 
   * @param query 
   */
  private validateSearchRange(query: PackageRoomRatesQueryDto) {
    if (query.startSearchDate && query.endSearchDate && query.startSearchDate > query.endSearchDate) {
      throw new BadRequestException('startSearchDate must be earlier than or equal to endSearchDate');
    }
  }
}
