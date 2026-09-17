import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { findIdMembersQuery } from './queries/member-find-id.queries';

export interface FindIdMemberRow {
  USER_ID: string;
  USER_NM: string | null;
  USER_TEL: string | null;
  ENG_NAME: string | null;
  INTEGRATED_YN: string | null;
}

/**
 * 회원 아이디 찾기 리포지토리
 */
@Injectable()
export class MemberFindIdRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * 회원 아이디 찾기
   * @param userTel 회원 전화번호
   * @returns FindIdMemberRow[]
   */
  async findMembers(userTel: string): Promise<FindIdMemberRow[]> {
    const result = await this.database.executeOn<FindIdMemberRow>('home', findIdMembersQuery, { userTel });
    return result.rows ?? [];
  }
}
