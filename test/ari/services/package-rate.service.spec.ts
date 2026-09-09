import { BadRequestException } from '@nestjs/common';
import { PackageRateService } from '../../../src/ari/services/package-rate.service';
import { PackageRateRepository } from '../../../src/ari/repositories/package-rate.repository';

describe('Package rate date policy', () => {
  const findPackageRoomRates = jest.fn();
  const service = new PackageRateService({ findPackageRoomRates } as unknown as PackageRateRepository);
  const params = { packageNumber: '12345', roomCode: 'gad' };
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 8, 12));
    findPackageRoomRates.mockReset().mockResolvedValue([]);
  });
  afterEach(() => jest.useRealTimers());

  it.each([
    [{}, '20260908', '20261008'],
    [{ startSearchDate: '20260910' }, '20260910', '20261008'],
    [{ endSearchDate: '20260920' }, '20260908', '20260920'],
    [{ startSearchDate: '20260901', endSearchDate: '20260901' }, '20260901', '20260901'],
  ])('resolves defaults before invoking the repository: %j', async (query, start, end) => {
    const result = await service.getPackageRoomRates(params, query);
    expect(findPackageRoomRates).toHaveBeenCalledWith({
      packageNumber: '12345', roomCode: 'GAD', startSearchDate: start, endSearchDate: end,
    });
    expect(result).toEqual({ packageNumber: '12345', roomTypeCode: 'GAD', dailyRates: [] });
  });

  it.each([
    { startSearchDate: '20260920', endSearchDate: '20260919' },
    { startSearchDate: '20261101' },
    { endSearchDate: '20260901' },
  ])('rejects inverted effective ranges: %j', async query => {
    await expect(service.getPackageRoomRates(params, query)).rejects.toBeInstanceOf(BadRequestException);
    expect(findPackageRoomRates).not.toHaveBeenCalled();
  });
});
