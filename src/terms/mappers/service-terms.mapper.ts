import { ServiceTermsLanguage, ServiceTermsType } from '../dto/service-terms-query.dto';
import { ServiceTermResponseDto, ServiceTermsResponseDto } from '../dto/service-terms.response.dto';
import { ServiceTermsRow } from '../repositories/service-terms.repository';
import { SRV_TERMS_DIV_MAPPING } from './service-terms-division';
import { userAgreeTitle } from './service-terms-title';

/**
 * 서비스 약관 응답 매퍼
 * @param rows 서비스 약관 데이터
 * @param gubun 약관 유형
 * @param language 언어
 * @returns 서비스 약관 응답 DTO
 */
export function toServiceTermsResponse(
  rows: ServiceTermsRow[],
  gubun: ServiceTermsType,
  language: ServiceTermsLanguage,
): ServiceTermsResponseDto {
  const agreementsList: ServiceTermResponseDto[] = [];
  for (const row of rows) {
    let division = row.DIVISION;
    let isY = 'Y';
    let titleDivision = row.DIVISION;
    const titleTarget = gubun === 'PAYMENT_GUEST' ? 'PAYMENT' : gubun;

    if (gubun === 'JOIN' || gubun === 'GROUP') {
      const mapped = SRV_TERMS_DIV_MAPPING[row.DIVISION];
      if (!mapped?.division) continue;
      division = mapped.division;
      isY = mapped.isY;
    } else if (gubun === 'PAYMENT' || gubun === 'PAYMENT_GUEST') {
      const privacyDivision = gubun === 'PAYMENT' ? 'OFFER_PRIVACY_LOGIN' : 'OFFER_PRIVACY';
      if (row.DIVISION === privacyDivision) {
        division = 'userInfoUse';
      } else if (row.DIVISION === 'OFFER_PRIVACY_REFUND') {
        division = 'cancel';
        titleDivision = 'CANCEL';
      } else {
        continue;
      }
    } else if (gubun === 'CASINO' && row.DIVISION === 'INTG_CSN_MARKETING') {
      isY = 'N';
    }

    agreementsList.push({
      division,
      isY,
      title: row.TITLE,
      koTitle: userAgreeTitle(language, titleTarget, titleDivision) ?? null,
      content: row.CONTENT ?? '',
    });
  }
  return { agreementsList };
}
