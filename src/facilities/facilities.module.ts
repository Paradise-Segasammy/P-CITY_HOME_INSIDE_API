import { Module } from '@nestjs/common';
import { FacilitiesController } from './controllers/facilities.controller';
import { FacilitiesService } from './services/facilities.service';
import { FacilitiesRepository } from './repositories/facilities.repository';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesRepository],
})
export class FacilitiesModule {}
