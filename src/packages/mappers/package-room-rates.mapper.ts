import { PackageRoomRateRow } from '../repositories/package-rate.repository';
import { PackageRoomRatesResponseDto } from '../dto/package-room-rates.response.dto';

export const toPackageRoomRatesResponse = (
  packageNumber: string,
  roomCode: string,
  rows: PackageRoomRateRow[],
): PackageRoomRatesResponseDto => ({
  packageNumber,
  roomTypeCode: roomCode,
  dailyRates: rows.map((row) => ({
    date: row.date,
    basePrice: row.basePrice ?? null,
    salePrice: row.salePrice,
    isTaxIncluded: row.isTaxIncluded ?? 'N',
  })),
});
