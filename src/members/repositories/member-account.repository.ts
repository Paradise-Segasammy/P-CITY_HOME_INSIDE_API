import { findMemberProfileQuery, findMemberAgreementQuery } from './queries/member-account.queries';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
export interface MemberProfileRow {
  userId: string | null;
  custNo: string | null;
  userName: string | null;
  userSex: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userBirthday: string | null;
  userZipCode: string | null;
  userAddress1: string | null;
  userAddress2: string | null;
  userAddress3: string | null;
  userCityTown: string | null;
  userState: string | null;
  userPhone: string | null;
  userEmail: string | null;
  userWeddingAnniversary: string | null;
  userJob: string | null;
  userCountryNumber: string | null;
  userCountryName: string | null;
  userDmDivision: string | null;
  userSelectInformation: string | null;
  userInterest: string | null;
}

export interface MemberAgreementRow {
  MARKETING_USE_YN: string | null;
  MAIL_RCV_FLAG: string | null;
  PUSH_RCV_FLAG: string | null;
  LOCATION_FLAG: string | null;
  SEL_CUSTINFO_USE_YN: string | null;
}

/**
 * 회원 프로필, 수신 동의 리포지토리
 */
@Injectable()
export class MemberAccountRepository {
  constructor(private readonly database: DatabaseService, private readonly config: ConfigService) {}

  /**
   * 멤버 프로필 조회
   * @param userId - 사용자 아이디
   * @returns 멤버 프로필 조회 결과
   */
  async findProfile(userId: string): Promise<MemberProfileRow | null> {
    const result = await this.database.executeOn<MemberProfileRow>('home', findMemberProfileQuery('TBL_MEMBER'), {
      userId,
    });
    return result.rows?.[0] ?? null;
  }

  /**
   * 멤버 수신 동의 조회
   * @param custNo - 카지노 회원번호
   * @returns 멤버 수신 동의 조회 결과
   */
  async findAgreement(custNo: string): Promise<MemberAgreementRow | null> {
    const schema = this.config.get<string>('oracle.irdb.schema');
    if (schema && !/^[A-Za-z][A-Za-z0-9_$#]{0,127}$/.test(schema)) {
      throw new ServiceUnavailableException('Invalid IRDB schema configuration.');
    }
    const result = await this.database.executeOn<MemberAgreementRow>('irdb', findMemberAgreementQuery(schema), { custNo });
    return result.rows?.[0] ?? null;
  }
}
