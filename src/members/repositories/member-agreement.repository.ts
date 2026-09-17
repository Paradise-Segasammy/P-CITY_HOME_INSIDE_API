import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { DatabaseService } from '../../database/database.service';
import {
  findAgreementMemberQuery,
  findOptionalAgreementQuery,
  lockAgreementCustomerQuery,
  mergeOptionalAgreementQuery,
} from './queries/member-agreement.queries';

export interface AgreementIdentityRow {
  CUST_NO: string | null;
}
export interface OptionalAgreementRow {
  LOCATION_FLAG: string | null;
}
export interface AgreementKey {
  branchCd: string;
  custNo: string;
}
export interface AgreementChange {
  location: 'Y' | 'N';
  channel: string;
  ip: string | null;
}

/**
 * 멤버 동의 정보
 */
@Injectable()
export class MemberAgreementRepository {
  constructor(
    private readonly database: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  /**
   * 트랜잭션 처리
   * @param work - 트랜잭션 작업 함수
   * @returns 트랜잭션 작업 결과
   */
  transaction<T>(work: (connection: oracledb.Connection) => Promise<T>) {
    return this.database.transaction('irdb', work);
  }

  /**
   * 멤버 동의 정보 조회
   * @param connection - 데이터베이스 연결
   * @param userId - 사용자 아이디
   * @returns 멤버 동의 정보 조회 결과
   */
  async findMember(connection: oracledb.Connection, userId: string) {
    const link = this.config.get<string>('home.memberDbLink');
    if (link && !/^[A-Z0-9_]+$/i.test(link)) throw new Error('Invalid member DB link configuration.');
    const table = link ? `TBL_MEMBER@${link}` : 'TBL_MEMBER';
    const result = await connection.execute<AgreementIdentityRow>(
      findAgreementMemberQuery(table),
      { USER_ID: userId },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: false,
      },
    );
    return result.rows ?? [];
  }

  /**
   * 멤버 동의 정보 잠금
   * @param connection - 데이터베이스 연결
   * @param key - 멤버 동의 정보 키
   * @returns 멤버 동의 정보 잠금 결과
   */
  async lockCustomer(connection: oracledb.Connection, key: AgreementKey) {
    const result = await connection.execute<AgreementIdentityRow>(lockAgreementCustomerQuery, this.binds(key), {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: false,
    });
    return result.rows ?? [];
  }

  /**
   * 멤버 동의 정보 조회
   * @param connection - 데이터베이스 연결
   * @param key - 멤버 동의 정보 키
   * @returns 멤버 동의 정보 조회 결과
   */
  async findCurrent(connection: oracledb.Connection, key: AgreementKey) {
    const result = await connection.execute<OptionalAgreementRow>(findOptionalAgreementQuery, this.binds(key), {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: false,
    });
    return result.rows ?? [];
  }

  /**
   * 멤버 동의 정보 저장
   * @param connection - 데이터베이스 연결
   * @param key - 멤버 동의 정보 키
   * @param change - 멤버 동의 정보 변경
   * @returns 멤버 동의 정보 저장 결과
   */
  async save(connection: oracledb.Connection, key: AgreementKey, change: AgreementChange) {
    const result = await connection.execute<{ PO_RESULT: number }>(
      mergeOptionalAgreementQuery,
      {
        ...this.binds(key),
        LOCATION_FLAG: change.location,
        CHANNEL: change.channel,
        IP: change.ip,
        PO_RESULT: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { autoCommit: false },
    );
    if (result.outBinds?.PO_RESULT !== 0) throw new Error('Optional agreement PL/SQL failed.');
    return 1;
  }

  /**
   * 멤버 동의 정보 키 바인딩
   * @param key - 멤버 동의 정보 키
   * @returns 멤버 동의 정보 키 바인딩 결과
   */
  private binds(key: AgreementKey) {
    return { BRANCH_CD: key.branchCd, CUST_NO: key.custNo };
  }
}
