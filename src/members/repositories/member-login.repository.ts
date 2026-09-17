import {
  findMemberLoginForUpdateQuery,
  countMemberByUserIdQuery,
  updatePasswordFailCountQuery,
  resetPasswordFailCountQuery,
} from './queries/member-login.queries';
import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { findMemberIdentityQuery } from './queries/member-identity.queries';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';

export interface MemberLoginRow {
  userId: string;
  custNo: string | null;
  userPassword: string;
  passwordFailCount: number | null;
  isPass: 'PASS' | 'UNPASS';
}

/**
 * 회원 로그인/아이디 조회 리포지토리
 */
@Injectable()
export class MemberLoginRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 잠금 상태 멤버 처리
   * @param userId - 사용자 아이디
   * @param work - 작업 함수
   * @returns 작업 결과
   */
  async withLockedMember<T>(
    userId: string,
    work: (member: MemberLoginRow | null, connection: oracledb.Connection) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.databaseService.transaction('home', async (connection) => {
        const result = await connection.execute<MemberLoginRow>(
          findMemberLoginForUpdateQuery,
          { userId },
          { outFormat: oracledb.OUT_FORMAT_OBJECT, maxRows: 2, autoCommit: false },
        );
        if ((result.rows?.length ?? 0) > 1) throw new ServiceUnavailableException('Member account is ambiguous.');
        return work(result.rows?.[0] ?? null, connection);
      });
    } catch (error) {
      if ((error as { errorNum?: number }).errorNum === 54) {
        throw new ServiceUnavailableException('Login is being processed. Retry shortly.');
      }
      throw error;
    }
  }

  /**
   * 고유 식별자 조회
   * @param connection - 데이터베이스 연결
   * @param userId - 사용자 아이디
   * @param custNo - 카지노 회원번호
   * @returns 고유 식별자 조회 결과
   */
  async hasUniqueIdentity(connection: oracledb.Connection, userId: string, custNo: string): Promise<boolean> {
    const result = await connection.execute<{ userId: string; custNo: string }>(
      findMemberIdentityQuery,
      { custNo },
      { outFormat: oracledb.OUT_FORMAT_OBJECT, maxRows: 2, autoCommit: false },
    );
    return result.rows?.length === 1 && result.rows[0].userId === userId && result.rows[0].custNo === custNo;
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const result = await this.databaseService.executeOn<{ count: number }>(
      'irdb',
      countMemberByUserIdQuery(this.memberTableName()),
      { userId },
    );

    return (result.rows?.[0]?.count ?? 0) > 0;
  }

  /**
   * 비밀번호 실패 횟수 업데이트
   * @param connection - 데이터베이스 연결
   * @param userId - 사용자 아이디
   * @param passwordFailCount - 비밀번호 실패 횟수
   */
  async updatePasswordFailCount(
    connection: oracledb.Connection,
    userId: string,
    passwordFailCount: number,
  ): Promise<void> {
    const result = await connection.execute(
      updatePasswordFailCountQuery('TBL_MEMBER'),
      { userId, passwordFailCount },
      { autoCommit: false },
    );

    if (result.rowsAffected !== 1) throw new ServiceUnavailableException('Member account update failed.');
  }

  /**
   * 비밀번호 실패 횟수 초기화
   * @param connection - 데이터베이스 연결
   * @param userId - 사용자 아이디
   */
  async resetPasswordFailCount(connection: oracledb.Connection, userId: string): Promise<void> {
    const result = await connection.execute(
      resetPasswordFailCountQuery('TBL_MEMBER'),
      { userId },
      { autoCommit: false },
    );

    if (result.rowsAffected !== 1) throw new ServiceUnavailableException('Member account update failed.');
  }

  /**
   * 멤버 테이블 이름 반환
   * @returns 멤버 테이블 이름
   */
  private memberTableName() {
    const dbLink = this.configService.get<string>('home.memberDbLink');
    if (!dbLink) return 'TBL_MEMBER';

    if (!/^[A-Z0-9_]+$/i.test(dbLink)) {
      throw new BadRequestException('Invalid member DB link configuration.');
    }

    return `TBL_MEMBER@${dbLink}`;
  }
}
