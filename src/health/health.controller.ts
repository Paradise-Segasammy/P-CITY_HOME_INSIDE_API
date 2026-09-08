import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthService } from './health.service';

/**
 * 헬스체크 API 컨트롤러
 */
@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }

  @Get('db')
  checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Get('db/irdb')
  checkIrdbDatabase() {
    return this.healthService.checkIrdbDatabase();
  }
}
