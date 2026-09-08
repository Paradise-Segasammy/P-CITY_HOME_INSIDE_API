import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Oracle DB 연결 모듈
 */
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
