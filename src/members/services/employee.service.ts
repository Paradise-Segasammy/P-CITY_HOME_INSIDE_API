import { ForbiddenException, Injectable } from '@nestjs/common';
import type { Connection } from 'oracledb';
import { BusinessException } from '../../common/errors/business.exception';
import { CommonErrorCode } from '../../common/errors/common-error-code';
import { EmployeeRequestDto } from '../dto/employee.request.dto';
import { MemberIdentity } from '../guards/member-token.guard';
import { toEmployeeResponse } from '../mappers/member-response.mapper';
import { EmployeeRepository } from '../repositories/employee.repository';
import type { EmployeeMappingKey, EmployeeMemberRow } from '../repositories/employee.repository';
import { matchesEmployeeName } from '../utils/employee-name-matcher.util';

/**
 * 회원 임직원 사번 등록 서비스
 */
@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  /**
   * 회원 계정에 임직원 사번을 등록
   * @param member 회원 정보
   * @param body 임직원 등록 요청 DTO
   * @returns 임직원 등록 응답 DTO
   */
  async register(member: MemberIdentity, body: EmployeeRequestDto) {
    if (member.mode !== 'MEMBER') throw new ForbiddenException('Members only.');
    await this.repository.transaction(async (connection) => {
      const account = await this.findVerifiedMember(connection, member);
      await this.verifyEmployee(body.empId, account);
      await this.registerMapping(connection, {
        branchCd: body.branchCd,
        empId: body.empId,
        custNo: member.custNo,
      });
    });
    return toEmployeeResponse();
  }

  /**
   * JWT 회원 식별자와 HOME 회원 정보를 대조
   * @param connection 데이터베이스 연결
   * @param member 회원 정보
   * @returns 임직원 검증에 사용할 회원 정보
   */
  private async findVerifiedMember(connection: Connection, member: MemberIdentity): Promise<EmployeeMemberRow> {
    const members = await this.repository.findMember(connection, member.userId);
    if (!members.length) throw new BusinessException(CommonErrorCode.RESOURCE_NOT_FOUND);
    if (members.length !== 1) throw new Error('Ambiguous member identity.');
    const account = members[0];
    if (account.CUST_NO !== member.custNo) throw new ForbiddenException('Member identity does not match.');
    return account;
  }

  /**
   * 회원 전화번호와 이름으로 IRDB 임직원 정보를 확인
   * @param empId 입력받은 임직원 사번
   * @param account HOME 회원 정보
   */
  private async verifyEmployee(empId: string, account: EmployeeMemberRow): Promise<void> {
    if (!account.USER_TEL || account.USER_TEL.replace(/\D/g, '').length < 7) {
      throw new BusinessException(CommonErrorCode.MEMBER_PHONE_INVALID);
    }
    const employees = await this.repository.findEmployees(empId, account.USER_TEL);
    if (employees.length !== 1 || !matchesEmployeeName(employees[0], account)) {
      throw new BusinessException(CommonErrorCode.EMPLOYEE_NOT_MATCHED);
    }
  }

  /**
   * 회원 고객번호와 임직원 사번의 매핑을 등록
   * @param connection 데이터베이스 연결
   * @param key 회원-임직원 매핑 키
   */
  private async registerMapping(connection: Connection, key: EmployeeMappingKey): Promise<void> {
    // Keep the table lock short: only the final duplicate check and write are serialized.
    try {
      await this.repository.lockMappings(connection);
    } catch (error) {
      if ((error as { errorNum?: number })?.errorNum === 54) {
        throw new BusinessException(CommonErrorCode.EMPLOYEE_REGISTRATION_BUSY);
      }
      throw error;
    }
    const mapping = await this.repository.findMapping(connection, key);
    if (!mapping) throw new Error('Missing mapping count result.');
    if (mapping.IS_MAPPED > 0) throw new BusinessException(CommonErrorCode.EMPLOYEE_ALREADY_REGISTERED);
    const changed = await this.repository.saveMapping(connection, key, mapping.IS_DEL > 0);
    if (changed !== 1) throw new Error('Unexpected employee mapping write count.');
  }
}
