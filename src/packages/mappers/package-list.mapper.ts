import { PackageListResponseDto } from '../dto/package-list.response.dto';
import { PackageInfoRow } from '../repositories/package-info.repository';

const joinUrl = (baseUrl: string, path?: string | null, fileName?: string | null) => {
  if (!path || !fileName) {
    return null;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}upload_file/${normalizedPath}${fileName}`;
};

export const toPackageListResponse = (rows: PackageInfoRow[], assetBaseUrl: string): PackageListResponseDto => ({
  packages: rows.map((row) => ({
    masterPackageNumber: `${row.masterPackageNumber}`,
    packageNumber: `${row.packageNumber}`,
    order: row.order ?? null,
    name: row.name,
    summary: row.summary ?? null,
    keyword: row.keyword ?? null,
    keywordAdd: row.keywordAdd ?? null,
    searchKeyword: row.searchKeyword ?? null,
    offerType: row.offerType,
    offerTypeCode: row.offerTypeCode,
    soldoutYn: row.soldoutYn,
    imageUrl: joinUrl(assetBaseUrl, row.imagePath, row.imageName),
  })),
});
