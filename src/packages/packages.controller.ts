import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PackageListQueryDto } from './dto/package-list-query.dto';
import { PackageListResponseDto } from './dto/package-list.response.dto';
import { PackageRoomRatesParamDto } from './dto/package-room-rates-param.dto';
import { PackageRoomRatesQueryDto } from './dto/package-room-rates-query.dto';
import { PackageRoomRatesResponseDto } from './dto/package-room-rates.response.dto';
import { PackageInfoService } from './package-info.service';
import { PackageRateService } from './package-rate.service';
import { ApiKeyGuard } from './guards/api-key.guard';

@ApiTags('packages')
@ApiSecurity('package-api-key')
@UseGuards(ApiKeyGuard)
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
  @ApiOkResponse({ type: PackageListResponseDto })
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
  @ApiOkResponse({ type: PackageRoomRatesResponseDto })
  getPackageRoomRates(@Param() params: PackageRoomRatesParamDto, @Query() query: PackageRoomRatesQueryDto) {
    return this.packageRateService.getPackageRoomRates(params, query);
  }
}
