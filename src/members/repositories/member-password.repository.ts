import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { BusinessException } from '../../common/errors/business.exception';
import { CommonErrorCode } from '../../common/errors/common-error-code';
import { updatePasswordChangeLaterQuery } from './queries/member-password.queries';

/**
 * 회원 비밀번호 리포지토리
 */
@Injectable()
export class MemberPasswordRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * 비밀번호 변경 유예 시각 갱신
   * @param userId - 사용자 ID
   * @returns 비밀번호 변경 유예 시각 갱신 완료
   */
  async postponePasswordChange(userId: string): Promise<void> {
    await this.database.transaction('home', async (connection) => {
      const result = await connection.execute(
        updatePasswordChangeLaterQuery,
        { USER_ID: userId },
        { autoCommit: false },
      );
      // Check the result before commit so missing or ambiguous members cannot succeed.
      if (!result.rowsAffected) throw new BusinessException(CommonErrorCode.RESOURCE_NOT_FOUND);
      if (result.rowsAffected !== 1) throw new Error('Unexpected member update count.');
    });
  }
}
