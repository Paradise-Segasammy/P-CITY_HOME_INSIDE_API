import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  check() {
    return {
      status: 'up',
      uptime: process.uptime(),
    };
  }

  async checkDatabase() {
    return this.databaseService.ping();
  }
}
