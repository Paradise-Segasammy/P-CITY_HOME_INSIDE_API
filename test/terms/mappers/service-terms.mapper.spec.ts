import { toServiceTermsResponse } from '../../../src/terms/mappers/service-terms.mapper';
import { SERVICE_TERMS_LANGUAGES } from '../../../src/terms/dto/service-terms-query.dto';

describe('service terms mapper', () => {
  it.each(SERVICE_TERMS_LANGUAGES)('preserves localized titles for %s', (lang) => {
    const result = toServiceTermsResponse([{ DIVISION: 'AGREEMENT', TITLE: 'Title', CONTENT: 'Text' }], 'JOIN', lang);
    expect(result.agreementsList[0].koTitle).toBeTruthy();
  });

  it.each(['PAYMENT', 'PAYMENT_GUEST'] as const)('maps %s privacy and refund terms', (gubun) => {
    const result = toServiceTermsResponse([
      { DIVISION: gubun === 'PAYMENT' ? 'OFFER_PRIVACY_LOGIN' : 'OFFER_PRIVACY', TITLE: 'Privacy', CONTENT: 'Text' },
      { DIVISION: 'OFFER_PRIVACY_REFUND', TITLE: 'Refund', CONTENT: 'Text' },
    ], gubun, 'KO');
    expect(result.agreementsList.map(x => x.division)).toEqual(['userInfoUse', 'cancel']);
    expect(result.agreementsList.every(x => x.isY === 'Y')).toBe(true);
  });

  it('keeps casino marketing optional', () => {
    const result = toServiceTermsResponse([
      { DIVISION: 'INTG_CSN_MARKETING', TITLE: 'Marketing', CONTENT: 'Text' },
      { DIVISION: 'INTG_CSN_AGREEMENT', TITLE: 'Terms', CONTENT: 'Text' },
    ], 'CASINO', 'KO');
    expect(result.agreementsList.map(x => x.isY)).toEqual(['N', 'Y']);
  });
});
