import { Injectable } from '@nestjs/common';
import { LoginStatusRequestDto } from '../dto/login-status.request.dto';
import { LoginStatusResponseDto } from '../dto/login-status.response.dto';
import { toLoginStatusResponse } from '../mappers/member-response.mapper';
import { verifyPssPassword } from '../password/pss-password.util';
import { MemberLoginRepository } from '../repositories/member-login.repository';

const PASSWORD_FAIL_LIMIT = 5;

/**
 * 로그인 전 회원 상태 확인 서비스
 */
@Injectable()
export class MemberLoginService {
  constructor(private readonly memberLoginRepository: MemberLoginRepository) {}

  /**
   * 로그인 상태 확인
   * @param command 로그인 상태 요청 DTO
   * @returns 로그인 상태 응답 DTO
   */
  async checkLoginStatus(command: LoginStatusRequestDto): Promise<LoginStatusResponseDto> {
    const userId = this.normalizeUserId(command.userId);
    return this.memberLoginRepository.withLockedMember(userId, async (member, connection) => {
      if (!member) {
        return toLoginStatusResponse(userId, 'NOT_FOUND', false, 0, PASSWORD_FAIL_LIMIT);
      }

      if (this.isLocked(member.passwordFailCount, member.isPass)) {
        return toLoginStatusResponse(userId, 'LOCKED', false, PASSWORD_FAIL_LIMIT, PASSWORD_FAIL_LIMIT);
      }

      const passwordMatched = verifyPssPassword(command.userPassword, member.userPassword);
      if (!passwordMatched) {
        const previousCount =
          (member.passwordFailCount ?? 0) >= PASSWORD_FAIL_LIMIT && member.isPass === 'PASS'
            ? 0
            : (member.passwordFailCount ?? 0);
        const nextFailCount = Math.min(previousCount + 1, PASSWORD_FAIL_LIMIT);
        await this.memberLoginRepository.updatePasswordFailCount(connection, userId, nextFailCount);
        return toLoginStatusResponse(
          userId,
          nextFailCount >= PASSWORD_FAIL_LIMIT ? 'LOCKED' : 'ACTIVE',
          false,
          nextFailCount,
          PASSWORD_FAIL_LIMIT,
        );
      }

      if ((member.passwordFailCount ?? 0) > 0) {
        await this.memberLoginRepository.resetPasswordFailCount(connection, userId);
      }

      if (
        !member.custNo ||
        !/^\d{10}$/.test(member.custNo) ||
        !(await this.memberLoginRepository.hasUniqueIdentity(connection, userId, member.custNo))
      ) {
        return toLoginStatusResponse(userId, 'IDENTITY_UNAVAILABLE', true, 0, PASSWORD_FAIL_LIMIT);
      }
      return toLoginStatusResponse(userId, 'ACTIVE', true, 0, PASSWORD_FAIL_LIMIT, member.custNo);
    });
  }

  /**
   * 사용자 ID 정규화
   * @param userId 사용자 ID
   * @returns 정규화된 사용자 ID
   */
  private normalizeUserId(userId: string) {
    const trimmedUserId = userId.trim();
    if (/^\d{7}$/.test(trimmedUserId)) return `${trimmedUserId}@p-city.com`;
    return trimmedUserId;
  }

  /**
   * 비밀번호 실패 횟수 확인
   * @param passwordFailCount 비밀번호 실패 횟수
   * @param isPass 비밀번호 통과 여부
   * @returns 비밀번호 실패 횟수 확인 결과
   */
  private isLocked(passwordFailCount: number | null, isPass: 'PASS' | 'UNPASS') {
    return (passwordFailCount ?? 0) >= PASSWORD_FAIL_LIMIT && isPass === 'UNPASS';
  }
}
