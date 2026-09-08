import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { getServiceTermsQuery, ServiceTermsQueryType } from './queries/service-terms.queries';

export interface ServiceTermsRow {
  DIVISION: string;
  TITLE: string | null;
  CONTENT: string | null;
}

/**
 * 서비스 약관 리포지토리
 */
@Injectable()
export class ServiceTermsRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * @description 서비스 약관 조회
   * @param gubun 약관 구분
   * @param language 언어
   * @returns 서비스 약관 데이터
   */
  async findTerms(gubun: ServiceTermsQueryType, language: string): Promise<ServiceTermsRow[]> {
    const result = await this.database.executeOn<ServiceTermsRow>('home', getServiceTermsQuery(gubun), { LANG: language });
    return result.rows ?? [];
  }
}
