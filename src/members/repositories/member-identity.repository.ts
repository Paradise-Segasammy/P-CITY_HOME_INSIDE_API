import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { findMemberIdentityQuery } from './queries/member-identity.queries';

export interface MemberIdentityRow {
  userId: string;
  custNo: string;
}

@Injectable()
export class MemberIdentityRepository {
  constructor(private readonly database: DatabaseService) {}

  async findUnique(custNo: string): Promise<MemberIdentityRow | null> {
    const result = await this.database.executeOn<MemberIdentityRow>(
      'home',
      findMemberIdentityQuery,
      { custNo },
      { maxRows: 2 },
    );
    const rows = result.rows ?? [];
    if (rows.length !== 1 || !rows[0].userId?.trim() || rows[0].custNo !== custNo) return null;
    return rows[0];
  }
}
