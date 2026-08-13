import { Injectable, Logger, OnModuleDestroy, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool?: oracledb.Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const env = this.configService.get<string>('oracle.home.env', 'dev');
    const user = this.configService.get<string>('oracle.home.user');
    const password = this.configService.get<string>('oracle.home.password');
    const connectString = this.configService.get<string>('oracle.home.connectString');

    if (!user || !password || !connectString) {
      this.logger.warn('Oracle HOME connection is not configured. Set ORACLE_HOME_ENV and ORACLE_HOME_* credentials.');
      return;
    }

    const ociLibDir = this.configService.get<string>('oracle.home.ociLibDir');
    if (ociLibDir) {
      oracledb.initOracleClient({ libDir: ociLibDir });
    }

    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.fetchAsString = [oracledb.CLOB];

    this.pool = await oracledb.createPool({
      user,
      password,
      connectString,
      poolMin: this.configService.get<number>('oracle.home.poolMin', 1),
      poolMax: this.configService.get<number>('oracle.home.poolMax', 5),
      poolIncrement: this.configService.get<number>('oracle.home.poolIncrement', 1),
      poolTimeout: this.configService.get<number>('oracle.home.poolTimeout', 60),
    });

    this.logger.log(`Oracle HOME ${env} connection pool created.`);
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.close(10);
      this.pool = undefined;
    }
  }

  async execute<T extends object = Record<string, unknown>>(
    sql: string,
    binds: oracledb.BindParameters = {},
    options: oracledb.ExecuteOptions = {},
  ): Promise<oracledb.Result<T>> {
    if (!this.pool) {
      throw new ServiceUnavailableException('Oracle HOME connection is not configured.');
    }

    const connection = await this.pool.getConnection();
    try {
      return await connection.execute<T>(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: false,
        ...options,
      });
    } finally {
      await connection.close();
    }
  }

  async ping() {
    const result = await this.execute<{ NOW: Date }>('SELECT SYSDATE AS "NOW" FROM DUAL');
    return {
      status: 'up',
      databaseTime: result.rows?.[0]?.NOW ?? null,
    };
  }
}
