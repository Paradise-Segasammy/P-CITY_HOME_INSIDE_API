import { Injectable, Logger, OnModuleDestroy, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

type OraclePoolName = 'home' | 'irdb';

interface OracleConnectionConfig {
  env: string;
  user?: string;
  password?: string;
  connectString?: string;
  poolMin: number;
  poolMax: number;
  poolIncrement: number;
  poolTimeout: number;
  ociLibDir?: string;
}

/**
 * Oracle 커넥션 풀 및 쿼리 실행 서비스
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pools = new Map<OraclePoolName, oracledb.Pool>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * 모듈 초기화
   */
  async onModuleInit() {
    const ociLibDir =
      this.configService.get<string>('oracle.home.ociLibDir') ??
      this.configService.get<string>('oracle.irdb.ociLibDir');
    if (ociLibDir) {
      oracledb.initOracleClient({ libDir: ociLibDir });
    }

    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.fetchAsString = [oracledb.CLOB];

    await this.createPool('home', this.getConnectionConfig('home'));
    await this.createPool('irdb', this.getConnectionConfig('irdb'));
  }

  /**
   * 모듈 종료
   */
  async onModuleDestroy() {
    for (const [name, pool] of this.pools) {
      await pool.close(10);
      this.logger.log(`Oracle ${name.toUpperCase()} connection pool closed.`);
    }

    this.pools.clear();
  }

  /**
   * 쿼리 실행
   * @param sql 쿼리
   * @param binds 바인드
   * @param options 옵션
   * @returns 결과
   */
  async execute<T extends object = Record<string, unknown>>(
    sql: string,
    binds: oracledb.BindParameters = {},
    options: oracledb.ExecuteOptions = {},
  ): Promise<oracledb.Result<T>> {
    return this.executeOn<T>('home', sql, binds, options);
  }

  /**
   * 쿼리 실행
   * @param poolName 풀 이름
   * @param sql 쿼리
   * @param binds 바인드
   * @param options 옵션
   * @returns 결과
   */
  async executeOn<T extends object = Record<string, unknown>>(
    poolName: OraclePoolName,
    sql: string,
    binds: oracledb.BindParameters = {},
    options: oracledb.ExecuteOptions = {},
  ): Promise<oracledb.Result<T>> {
    const pool = this.getPool(poolName);

    const connection = await pool.getConnection();
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

  /**
   * 트랜잭션 실행
   * @param poolName 풀 이름
   * @param work 작업
   * @returns 결과
   */
  async transaction<T>(poolName: OraclePoolName, work: (connection: oracledb.Connection) => Promise<T>): Promise<T> {
    const pool = this.getPool(poolName);
    const connection = await pool.getConnection();

    try {
      // 작업 실행
      const result = await work(connection);
      // 커밋
      await connection.commit();
      return result;
    } catch (error) {
      // 롤백
      await connection.rollback();
      throw error;
    } finally {
      // 커넥션 닫기
      await connection.close();
    }
  }

  /**
   * 평가 실행
   * @returns 결과
   */
  async ping() {
    const result = await this.execute<{ NOW: Date }>('SELECT SYSDATE AS "NOW" FROM DUAL');
    return {
      status: 'up',
      databaseTime: result.rows?.[0]?.NOW ?? null,
    };
  }

  /**
   * 평가 실행
   * @param poolName 풀 이름
   * @returns 결과
   */
  async pingOn(poolName: OraclePoolName) {
    const result = await this.executeOn<{ NOW: Date }>(poolName, 'SELECT SYSDATE AS "NOW" FROM DUAL');
    return {
      status: 'up',
      database: poolName,
      databaseTime: result.rows?.[0]?.NOW ?? null,
    };
  }

  /**
   * 커넥션 설정 가져오기
   * @param poolName 풀 이름
   * @returns 커넥션 설정
   */
  private getConnectionConfig(poolName: OraclePoolName): OracleConnectionConfig {
    return {
      env: this.configService.get<string>(`oracle.${poolName}.env`, 'dev'),
      user: this.configService.get<string>(`oracle.${poolName}.user`),
      password: this.configService.get<string>(`oracle.${poolName}.password`),
      connectString: this.configService.get<string>(`oracle.${poolName}.connectString`),
      poolMin: this.configService.get<number>(`oracle.${poolName}.poolMin`, 1),
      poolMax: this.configService.get<number>(`oracle.${poolName}.poolMax`, 5),
      poolIncrement: this.configService.get<number>(`oracle.${poolName}.poolIncrement`, 1),
      poolTimeout: this.configService.get<number>(`oracle.${poolName}.poolTimeout`, 60),
      ociLibDir: this.configService.get<string>(`oracle.${poolName}.ociLibDir`),
    };
  }

  /**
   * 커넥션 풀 생성
   * @param poolName 풀 이름
   * @param config 커넥션 설정
   */
  private async createPool(poolName: OraclePoolName, config: OracleConnectionConfig) {
    if (!config.user || !config.password || !config.connectString) {
      this.logger.warn(
        `Oracle ${poolName.toUpperCase()} connection is not configured. Set ORACLE_${poolName.toUpperCase()}_ENV and ORACLE_${poolName.toUpperCase()}_* credentials.`,
      );
      return;
    }

    const pool = await oracledb.createPool({
      user: config.user,
      password: config.password,
      connectString: config.connectString,
      poolMin: config.poolMin,
      poolMax: config.poolMax,
      poolIncrement: config.poolIncrement,
      poolTimeout: config.poolTimeout,
    });

    this.pools.set(poolName, pool);
    this.logger.log(`Oracle ${poolName.toUpperCase()} ${config.env} connection pool created.`);
  }

  /**
   * 커넥션 풀 가져오기
   * @param poolName 풀 이름
   * @returns 커넥션 풀
   */
  private getPool(poolName: OraclePoolName) {
    const pool = this.pools.get(poolName);

    if (!pool) {
      throw new ServiceUnavailableException(`Oracle ${poolName.toUpperCase()} connection is not configured.`);
    }

    return pool;
  }
}
