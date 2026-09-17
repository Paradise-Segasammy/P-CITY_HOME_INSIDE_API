import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { enqueueSmsQuery } from './queries/member-sms.queries';

/**
 * SMS 메시지 정보
 */
export interface SmsMessage {
  countryCd: string | null;
  callPhone: string;
  msg: string;
  kind: 'S' | 'M' | 'I';
}

/**
 * 회원 SMS 메시지 저장 리포지토리
 */
@Injectable()
export class MemberSmsRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * SMS 메시지 저장
   * @param message countryCd, callPhone, msg, kind
   */
  async enqueue(message: SmsMessage): Promise<void> {
    await this.database.transaction('irdb', async connection => {
      const { countryCd, callPhone, msg, kind } = message;
      const binds = countryCd ? { countryCd, callPhone, msg } : { callPhone, msg, kind };
      const result = await connection.execute(enqueueSmsQuery(!!countryCd), binds, { autoCommit: false });
      if (result.rowsAffected !== 1) throw new ServiceUnavailableException('SMS queue insert failed.');
    });
  }
}
