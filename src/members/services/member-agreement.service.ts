import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import type { Connection } from 'oracledb';
import { BusinessException } from '../../common/errors/business.exception';
import { CommonErrorCode } from '../../common/errors/common-error-code';
import { MemberAgreementRequestDto } from '../dto/member-agreement.request.dto';
import { MemberIdentity } from '../guards/member-token.guard';
import { toMemberAgreementResponse } from '../mappers/member-response.mapper';
import { MemberAgreementRepository } from '../repositories/member-agreement.repository';
import type { AgreementIdentityRow, AgreementKey } from '../repositories/member-agreement.repository';

/**
 * 약관 동의 서비스
 */
@Injectable()
export class MemberAgreementService {
  constructor(private readonly repository: MemberAgreementRepository) {}

  /**
   * 약관 동의 업데이트
   * @param member 회원 정보
   * @param body 약관 동의 요청 DTO
   * @param ip 요청 IP
   * @returns 약관 동의 응답 DTO
   */
  async update(member: MemberIdentity, body: MemberAgreementRequestDto, ip: string | null) {
    if (member.mode !== 'MEMBER') throw new ForbiddenException('Members only.');
    if (body.userLocation !== 'Y' && body.userLocation !== 'N') {
      throw new BadRequestException('Location consent must be Y or N.');
    }
    // 회원 정보 키
    const key = { branchCode: '1000', custNo: member.custNo };
    await this.repository.transaction(async (connection) => {
      await this.findVerifiedMember(connection, member);
      await this.lockCustomer(connection, key);
      await this.applyAgreementChanges(connection, key, body, ip);
    });
    return toMemberAgreementResponse();
  }

  /**
   * 회원 정보 조회
   * @param connection 데이터베이스 연결
   * @param member 회원 정보
   * @returns 회원 정보 조회 응답 DTO
   */
  private async findVerifiedMember(connection: Connection, member: MemberIdentity): Promise<AgreementIdentityRow> {
    const members = await this.repository.findMember(connection, member.userId);
    if (!members.length) throw new BusinessException(CommonErrorCode.RESOURCE_NOT_FOUND);
    if (members.length !== 1) throw new Error('Ambiguous member identity.');
    if (members[0].CUST_NO !== member.custNo) throw new ForbiddenException('Member identity does not match.');
    return members[0];
  }

  /**
   * 회원 정보 잠금
   * @param connection 데이터베이스 연결
   * @param key 회원 정보 키
   * @returns 회원 정보 잠금 응답 DTO
   */
  private async lockCustomer(connection: Connection, key: AgreementKey): Promise<void> {
    let customers: AgreementIdentityRow[];
    try {
      customers = await this.repository.lockCustomer(connection, key);
    } catch (error) {
      if ((error as { errorNum?: number })?.errorNum === 54) {
        throw new BusinessException(CommonErrorCode.AGREEMENT_UPDATE_BUSY);
      }
      throw error;
    }
    if (!customers.length) throw new BusinessException(CommonErrorCode.RESOURCE_NOT_FOUND);
    if (customers.length !== 1) throw new Error('Ambiguous Rewards customer.');
  }

  /**
   * 약관 동의 변경 적용
   * @param connection 데이터베이스 연결
   * @param key 약관 동의 키
   * @param body 약관 동의 요청 DTO
   * @param ip 요청 IP
   * @returns 약관 동의 변경 적용 응답 DTO
   */
  private async applyAgreementChanges(
    connection: Connection,
    key: AgreementKey,
    body: MemberAgreementRequestDto,
    ip: string | null,
  ): Promise<void> {
    const rows = await this.repository.findCurrent(connection, key);
    if (rows.length > 1) throw new Error('Ambiguous optional agreement.');
    const changed = await this.repository.save(connection, key, {
      location: body.userLocation,
      channel: 'WEB',
      ip,
    });
    if (changed !== 1) throw new Error('Unexpected optional agreement write count.');
  }
}
