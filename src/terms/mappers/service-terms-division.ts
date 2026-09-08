/**
 * 서비스 약관 분류 매퍼
 * @description 서비스 약관 분류 매퍼
 */
export const SRV_TERMS_DIV_MAPPING: Record<string, Record<string, string>> = {
    MARKETING: {
        division: 'userMarketingUseYN',
        isY: 'N',
    },
    PRIVACY: {
        division: 'userInfoUse',
        isY: 'Y',
    },
    PRIVACY_THIRD: {
        division: 'userAgree3RDYN',
        isY: 'N',
    },
    REWARDS_MBRSHP: {
        division: 'userAgree',
        isY: 'Y',
    },
    AGREEMENT: {
        division: 'userAppAgree',
        isY: 'Y',
    },
    INTG_MARKETING: {
        division: 'userMarketingUseYN',
        isY: 'N',
    },
    INTG_PRIVACY: {
        division: 'userInfoUse',
        isY: 'Y',
    },
    INTG_PRIVACY_SEL: {
        division: 'userInfoUseSelect',
        isY: 'N',
    },
    INTG_PRIVACY_THIRD: {
        division: 'userAgree3RDYN',
        isY: 'N',
    },
    INTG_AGREEMENT: {
        division: 'userAppAgree',
        isY: 'Y',
    },
    INTG_LOC_INFO: {
        division: 'userLocation',
        isY: 'N',
    },
    LOCATION: {
        division: 'userLocation',
        isY: 'N',
    },
};
