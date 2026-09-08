import { findPackagesQuery } from './queries/package-info.queries';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface PackageInfoRow {
  masterPackageNumber: number | string;
  packageNumber: number | string;
  order: number | null;
  division: string | null;
  offerType: string;
  offerTypeCode: string;
  badgeType1: string | null;
  badgeType2: string | null;
  soldoutYn: 'Y' | 'N';
  salePrice: number | null;
  discountPrice: number | null;
  discountRate: number | null;
  singlePriceYn: 'Y' | 'N' | null;
  keywordAdd: string | null;
  searchKeyword: string | null;
  imageName: string | null;
  imagePath: string | null;
  name: string;
  summary: string | null;
  keyword: string | null;
}

export interface FindPackagesCommand {
  langSet: string;
  channel: 'WEB' | 'MOB';
  pCnYn: 'Y' | 'N';
  sbuCd: string;
}

/**
 * 패키지 상품 정보 조회 리포지토리
 */
@Injectable()
export class PackageInfoRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 패키지 상품 정보 조회
   * @param command langSet, channel, pCnYn, sbuCd
   * @returns Promise<PackageInfoRow[]>
   */
  async findPackages(command: FindPackagesCommand): Promise<PackageInfoRow[]> {
    const result = await this.databaseService.execute<PackageInfoRow>(
      findPackagesQuery,
      {
        channel: command.channel,
        langSet: command.langSet,
        pCnYn: command.pCnYn,
        sbuCd: command.sbuCd,
      },
    );

    return result.rows ?? [];
  }
}
