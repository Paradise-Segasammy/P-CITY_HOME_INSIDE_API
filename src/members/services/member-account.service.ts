import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/errors/business.exception';
import { CommonErrorCode } from '../../common/errors/common-error-code';
import { MemberIdentity } from '../guards/member-token.guard';
import { MemberAccountRepository } from '../repositories/member-account.repository';
import { MemberProfileResponseDto } from '../dto/member-profile.response.dto';
import { toMemberProfileResponse } from '../mappers/member-response.mapper';

/**
 * 회원 정보 조회 서비스
 */
@Injectable()
export class MemberAccountService {
  constructor(private readonly repository: MemberAccountRepository) {}

  /**
   * 회원 정보 조회
   * @param member 회원 정보
   * @returns 회원 정보 조회 응답 DTO
   */
  async getMyInfo(member: MemberIdentity): Promise<MemberProfileResponseDto> {
    if (member.mode !== 'MEMBER') throw new ForbiddenException('Members only.');
    this.assertIncheonMember(member);
    const profile = await this.repository.findProfile(member.userId);
    if (!profile) throw new BusinessException(CommonErrorCode.RESOURCE_NOT_FOUND);
    if (profile.userId !== member.userId || profile.custNo !== member.custNo) {
      throw new ForbiddenException('Member identity does not match.');
    }
    const agreement = await this.repository.findAgreement(member.custNo);
    return toMemberProfileResponse(profile, agreement);
  }

  /**
   * 인천 회원 여부 확인
   * @param member 회원 정보
   * @returns 인천 회원 여부 확인 응답 DTO
   */
  private assertIncheonMember(member: MemberIdentity) {
    if (Number.isNaN(Number(member.userId)) && member.userId.length > 3 && !member.userId.includes('@')) {
      throw new BadRequestException('Busan-only members are not supported.');
    }
  }
}
