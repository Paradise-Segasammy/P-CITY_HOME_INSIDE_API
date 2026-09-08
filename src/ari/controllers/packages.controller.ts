import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PackageListQueryDto } from '../dto/package-list-query.dto';
import { PackageListResponseDto } from '../dto/package-list.response.dto';
import { PackageRoomRatesParamDto } from '../dto/package-room-rates-param.dto';
import { PackageRoomRatesQueryDto } from '../dto/package-room-rates-query.dto';
import { PackageRoomRatesResponseDto } from '../dto/package-room-rates.response.dto';
import { PackageInfoService } from '../services/package-info.service';
import { PackageRateService } from '../services/package-rate.service';

/**
 * 패키지 관련 API 컨트롤러
 */
@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(
    private readonly packageInfoService: PackageInfoService,
    private readonly packageRateService: PackageRateService,
  ) {}

  /**
   * [GET] /packages
   * 홈페이지 패키지 상품 정보 조회
   * @param query langSet, channel, pCnYn, sbuCd
   * @returns PackageListResponseDto
   */
  @Get()
  @ApiOperation({ summary: '홈페이지 패키지 상품 정보 조회' })
  @ApiSuccessResponse(PackageListResponseDto)
  getPackages(@Query() query: PackageListQueryDto) {
    return this.packageInfoService.getPackages(query);
  }

  /**
   * [GET] /packages/:packageNumber/rooms/:roomCode/rates
   * 패키지 룸 타입별 일자별 요금 조회
   * @param params packageNumber, roomCode
   * @param query startSearchDate, endSearchDate
   * @returns PackageRoomRatesResponseDto
   */
  @Get(':packageNumber/rooms/:roomCode/rates')
  @ApiOperation({ summary: '패키지 룸 타입별 일자별 요금 조회' })
  @ApiSuccessResponse(PackageRoomRatesResponseDto)
  getPackageRoomRates(@Param() params: PackageRoomRatesParamDto, @Query() query: PackageRoomRatesQueryDto) {
    return this.packageRateService.getPackageRoomRates(params, query);
  }
}
