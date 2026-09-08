import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  toDatabaseHealthResponse,
  toHealthResponse,
  toNamedDatabaseHealthResponse,
} from './mappers/health-response.mapper';

/**
 * 앱/DB 상태 점검 서비스
 */
@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  check() {
    return toHealthResponse(process.uptime());
  }

  async checkDatabase() {
    return toDatabaseHealthResponse(await this.databaseService.ping());
  }

  async checkIrdbDatabase() {
    return toNamedDatabaseHealthResponse(await this.databaseService.pingOn('irdb'));
  }
}
