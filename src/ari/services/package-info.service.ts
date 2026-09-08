import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PackageListQueryDto } from '../dto/package-list-query.dto';
import { toPackageListResponse } from '../mappers/package-list.mapper';
import { PackageInfoRepository } from '../repositories/package-info.repository';

/**
 * 패키지 상품 목록 조회 서비스
 */
@Injectable()
export class PackageInfoService {
  constructor(
    private readonly packageInfoRepository: PackageInfoRepository,
    private readonly configService: ConfigService,
  ) {}

  async getPackages(query: PackageListQueryDto) {
    const rows = await this.packageInfoRepository.findPackages({
      langSet: query.langSet ?? 'KO',
      channel: query.channel ?? this.configService.get<'WEB' | 'MOB'>('home.channel', 'WEB'),
      pCnYn: query.pCnYn ?? 'N',
      sbuCd: query.sbuCd ?? '000001',
    });

    return toPackageListResponse(rows, this.configService.get<string>('home.assetBaseUrl', ''));
  }
}
