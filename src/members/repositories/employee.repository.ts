import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { DatabaseService } from '../../database/database.service';
import {
  checkEmployeeMappingQuery,
  getEmployeeMemberQuery,
  getMatchingEmployeeQuery,
  insertEmployeeMappingQuery,
  lockEmployeeMappingsQuery,
  restoreEmployeeMappingQuery,
} from './queries/employee.queries';

/**
 * 임직원 검증에 사용할 HOME 회원 행
 */
export interface EmployeeMemberRow {
  USER_NM: string | null;
  USER_ENG_NM1: string | null;
  USER_ENG_NM2: string | null;
  USER_TEL: string | null;
  CUST_NO: string | null;
}

/**
 * IRDB 임직원 행
 */
export interface EmployeeRow {
  EMP_NM: string | null;
  ENG_EMP_NM: string | null;
}

/**
 * 회원-임직원 매핑 조회 결과
 */
export interface EmployeeMappingRow {
  IS_MAPPED: number;
  IS_DEL: number;
}

/**
 * 회원-임직원 매핑 키
 */
export interface EmployeeMappingKey {
  branchCd: string;
  empId: string;
  custNo: string;
}

/**
 * 회원 임직원 사번 등록 리포지토리
 */
@Injectable()
export class EmployeeRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * 트랜잭션 작업
   * @param work - 트랜잭션 작업
   * @returns 트랜잭션 결과
   */
  transaction<T>(work: (connection: oracledb.Connection) => Promise<T>) {
    return this.database.transaction('home', work);
  }

  /**
   * 임직원 검증 대상 HOME 회원 조회
   * @param connection - 데이터베이스 연결
   * @param userId - 사용자 ID
   * @returns HOME 회원 행
   */
  async findMember(connection: oracledb.Connection, userId: string): Promise<EmployeeMemberRow[]> {
    const result = await connection.execute<EmployeeMemberRow>(
      getEmployeeMemberQuery,
      { USER_ID: userId },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: false,
      },
    );
    return result.rows ?? [];
  }

  /**
   * 입력 사번과 회원 전화번호로 IRDB 임직원 조회
   * @param empId - 입력받은 임직원 사번
   * @param phone - HOME 회원 전화번호
   * @returns IRDB 임직원 행
   */
  async findEmployees(empId: string, phone: string): Promise<EmployeeRow[]> {
    const result = await this.database.executeOn<EmployeeRow>('irdb', getMatchingEmployeeQuery, {
      EMP_ID: empId,
      MOBILE_NO: phone,
    });
    return result.rows ?? [];
  }

  /**
   * 회원-임직원 매핑 테이블 잠금
   * @param connection - 데이터베이스 연결
   */
  async lockMappings(connection: oracledb.Connection): Promise<void> {
    await connection.execute(lockEmployeeMappingsQuery, {}, { autoCommit: false });
  }

  /**
   * 회원-임직원 매핑 중복 및 삭제 매핑 조회
   * @param connection - 데이터베이스 연결
   * @param key - 회원-임직원 매핑 키
   * @returns 회원-임직원 매핑 조회 결과
   */
  async findMapping(connection: oracledb.Connection, key: EmployeeMappingKey): Promise<EmployeeMappingRow | undefined> {
    const result = await connection.execute<EmployeeMappingRow>(checkEmployeeMappingQuery, this.binds(key), {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: false,
    });
    return result.rows?.[0];
  }

  /**
   * 회원-임직원 매핑 저장 또는 삭제 매핑 복원
   * @param connection - 데이터베이스 연결
   * @param key - 회원-임직원 매핑 키
   * @param restore - 복원 여부
   * @returns 변경 행 수
   */
  async saveMapping(connection: oracledb.Connection, key: EmployeeMappingKey, restore: boolean): Promise<number> {
    const result = await connection.execute(
      restore ? restoreEmployeeMappingQuery : insertEmployeeMappingQuery,
      this.binds(key),
      { autoCommit: false },
    );
    return result.rowsAffected ?? 0;
  }

  /**
   * 회원-임직원 매핑 바인드 생성
   * @param key - 회원-임직원 매핑 키
   * @returns 회원-임직원 매핑 바인드
   */
  private binds(key: EmployeeMappingKey) {
    return { BRANCH_CD: key.branchCd, EMP_ID: key.empId, CUST_NO: key.custNo };
  }
}
