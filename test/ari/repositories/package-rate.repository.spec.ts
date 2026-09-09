import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../../src/database/database.service';
import { PackageRateRepository } from '../../../src/ari/repositories/package-rate.repository';
import { findPackageRoomRatesQuery } from '../../../src/ari/repositories/queries/package-rate.queries';

describe('Package rate repository', () => {
  it('binds the resolved range unchanged to the existing SQL', async () => {
    const execute = jest.fn().mockResolvedValue({ rows: [] });
    const repository = new PackageRateRepository({ execute } as unknown as DatabaseService, new ConfigService());
    await expect(repository.findPackageRoomRates({ packageNumber: '12345', roomCode: 'GAD',
      startSearchDate: '20260908', endSearchDate: '20261008' })).resolves.toEqual([]);
    expect(execute).toHaveBeenCalledWith(findPackageRoomRatesQuery, {
      branchCd: '1000', channel: 'WEB', packageNumber: '12345', roomCode: 'GAD',
      startDate: '20260908', endDate: '20261008',
    });
  });
});
