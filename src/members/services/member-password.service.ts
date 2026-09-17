import { ForbiddenException, Injectable } from '@nestjs/common';
import { MemberIdentity } from '../guards/member-token.guard';
import { MemberPasswordRepository } from '../repositories/member-password.repository';
import { toPasswordChangeLaterResponse } from '../mappers/member-response.mapper';

/**
 * 회원 비밀번호 서비스
 */
@Injectable()
export class MemberPasswordService {
  constructor(private readonly repository: MemberPasswordRepository) {}

  /**
   * 비밀번호 변경 연기
   * @param member 회원 정보
   * @returns 비밀번호 변경 연기 응답
   */
  async postponePasswordChange(member: MemberIdentity) {
    if (member.mode !== 'MEMBER') throw new ForbiddenException('Members only.');
    await this.repository.postponePasswordChange(member.userId);
    return toPasswordChangeLaterResponse();
  }
}
