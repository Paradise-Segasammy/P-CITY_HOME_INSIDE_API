import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PackagesController } from './controllers/packages.controller';
import { PackageInfoService } from './services/package-info.service';
import { PackageRateService } from './services/package-rate.service';
import { PackageInfoRepository } from './repositories/package-info.repository';
import { PackageRateRepository } from './repositories/package-rate.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PackagesController],
  providers: [PackageInfoService, PackageRateService, PackageInfoRepository, PackageRateRepository],
})
export class AriModule {}
