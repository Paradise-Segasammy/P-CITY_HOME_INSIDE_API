import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ServiceTermsController } from './controllers/service-terms.controller';
import { ServiceTermsService } from './services/service-terms.service';
import { ServiceTermsRepository } from './repositories/service-terms.repository';

/**
 * 약관 모듈
 */
@Module({
  imports: [DatabaseModule],
  controllers: [ServiceTermsController],
  providers: [ServiceTermsService, ServiceTermsRepository],// 서비스 약관 서비스, 서비스 약관 리포지토리
})
export class TermsModule {}
