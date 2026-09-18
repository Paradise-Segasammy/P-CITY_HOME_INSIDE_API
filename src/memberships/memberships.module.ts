import { Module } from '@nestjs/common';
import { MembershipsController } from './controllers/memberships.controller';
import { MembershipsService } from './services/memberships.service';
import { MembershipsRepository } from './repositories/memberships.repository';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsRepository],
})
export class MembershipsModule {}
