import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PackagesController } from './packages.controller';
import { PackageInfoService } from './package-info.service';
import { PackageRateService } from './package-rate.service';
import { PackageInfoRepository } from './repositories/package-info.repository';
import { PackageRateRepository } from './repositories/package-rate.repository';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [PackagesController],
  providers: [PackageInfoService, PackageRateService, PackageInfoRepository, PackageRateRepository, ApiKeyGuard],
})
export class PackagesModule {}
