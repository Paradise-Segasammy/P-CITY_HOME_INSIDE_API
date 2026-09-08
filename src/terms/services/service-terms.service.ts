import { Injectable } from '@nestjs/common';
import { ServiceTermsQueryDto } from '../dto/service-terms-query.dto';
import { toServiceTermsResponse } from '../mappers/service-terms.mapper';
import { ServiceTermsRepository } from '../repositories/service-terms.repository';

/**
 * 서비스 약관 서비스
 */
@Injectable()
export class ServiceTermsService {
  constructor(private readonly repository: ServiceTermsRepository) {}

  /**
   * 서비스 약관 조회
   * @param query 조회 쿼리
   * @returns 서비스 약관 응답 DTO
   */
  async getTerms(query: ServiceTermsQueryDto) {
    // 결제, 다이닝 결제 약관 정책 유지
    const language = ['PAYMENT', 'PAYMENT_GUEST', 'DINING_PAYMENT'].includes(query.gubun) ? 'KO' : query.LANG;
    const rows = await this.repository.findTerms(query.gubun, language);
    return toServiceTermsResponse(rows, query.gubun, language);
  }
}
