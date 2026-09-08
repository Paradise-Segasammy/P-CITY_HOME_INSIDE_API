/**
 * 서비스 약관 조회 쿼리
 */
const queryByTermsType = {
    JOIN: () => serviceTerms_getServiceTerms_Query('JOIN'),
    GROUP: () => serviceTerms_getServiceTerms_Query('GROUP'),
    PAYMENT: () => serviceTerms_getServiceTermsPaymentMember_Query(),
    PAYMENT_GUEST: () => serviceTerms_getServiceTermsPaymentGuest_Query(),
    DINING_PAYMENT: () => serviceTerms_getServiceTermsDining_Query(),
    CASINO: () => serviceTerms_getServiceTermsCasino_Query(),
};

export type ServiceTermsQueryType = keyof typeof queryByTermsType;

export function getServiceTermsQuery(gubun: ServiceTermsQueryType): string {
    return queryByTermsType[gubun]();
}

/**
 * 그룹 약관 조회 쿼리
 * @param MODE 약관 유형
 * @returns 그룹 약관 조회 쿼리
 */
export const serviceTerms_getServiceTerms_Query = (MODE?: string | null) => {
    if (MODE === 'GROUP') {
        return `SELECT F_DIVISION AS DIVISION
            , F_TITLE AS TITLE
            , F_CTNT AS CONTENT
        FROM (SELECT F_DIVISION
                , F_TITLE
                , F_CTNT
                , ROW_NUMBER() OVER(PARTITION BY F_DIVISION ORDER BY F_REVISION_DT DESC) AS RN
                FROM TBL_FOOTER
                WHERE F_DEL_YN = 'N'
                    AND LANG_SET = :LANG
                    AND TO_DATE(F_REVISION_DT, 'YYYY-MM-DD') <= SYSDATE
                    AND F_DIVISION IN ('INTG_AGREEMENT', 'INTG_MARKETING', 'INTG_PRIVACY', 'INTG_PRIVACY_SEL', 'INTG_PRIVACY_THIRD', 'LOCATION')
                ORDER BY F_REVISION_DT DESC)
        WHERE RN = 1
        ORDER BY CASE F_DIVISION
            WHEN 'INTG_AGREEMENT' THEN 1
            WHEN 'INTG_PRIVACY' THEN 2
            WHEN 'INTG_PRIVACY_SEL' THEN 3
            WHEN 'INTG_PRIVACY_THIRD' THEN 4
            WHEN 'INTG_MARKETING' THEN 5
            WHEN 'LOCATION' THEN 6
        END
    `;
    } else {
        return `SELECT F_DIVISION AS DIVISION
            , F_TITLE AS TITLE
            , F_CTNT AS CONTENT
        FROM (SELECT F_DIVISION
                , F_TITLE
                , F_CTNT
                , ROW_NUMBER() OVER(PARTITION BY F_DIVISION ORDER BY F_REVISION_DT DESC) AS RN
            FROM TBL_FOOTER
            WHERE F_DEL_YN = 'N'
                AND LANG_SET = :LANG
                AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') >= F_REVISION_DT
                        AND F_DIVISION IN ('AGREEMENT', 'PRIVACY', 'REWARDS_MBRSHP', 'MARKETING', 'PRIVACY_THIRD')
            ORDER BY F_REVISION_DT DESC)
        WHERE RN = 1
        `;
    }
};

/**
 * @description 결제 회원 약관 조회 쿼리
 * @returns 결제 회원 약관 조회 쿼리
 */
export const serviceTerms_getServiceTermsPaymentMember_Query = () => {
    return `SELECT F_DIVISION AS DIVISION
    , F_TITLE AS TITLE
    , F_CTNT AS CONTENT
FROM (SELECT F_DIVISION
          , F_TITLE
          , F_CTNT
          , ROW_NUMBER() OVER(PARTITION BY F_DIVISION ORDER BY F_REVISION_DT DESC) AS rn
          , CASE F_DIVISION
                WHEN 'OFFER_PRIVACY_LOGIN' THEN 1
                WHEN 'OFFER_PRIVACY_REFUND' THEN 2
            END AS SORT_ORDER
     FROM TBL_FOOTER
     WHERE F_DEL_YN='N'
       AND LANG_SET = :LANG
       AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') >= F_REVISION_DT
       AND F_DIVISION IN ('OFFER_PRIVACY_REFUND', 'OFFER_PRIVACY_LOGIN')
     ORDER BY F_REVISION_DT DESC) WHERE RN = 1
     ORDER BY SORT_ORDER`;
}

/**
 * @description 결제 비회원 약관 조회 쿼리
 * @returns 결제 비회원 약관 조회 쿼리
 */
export const serviceTerms_getServiceTermsPaymentGuest_Query = () => {
    return `SELECT F_DIVISION AS DIVISION
    , F_TITLE AS TITLE
    , F_CTNT AS CONTENT
FROM (SELECT F_DIVISION
          , F_TITLE
          , F_CTNT
          , ROW_NUMBER() OVER(PARTITION BY F_DIVISION ORDER BY F_REVISION_DT DESC) AS rn
          , CASE F_DIVISION
                WHEN 'OFFER_PRIVACY' THEN 1
                WHEN 'OFFER_PRIVACY_REFUND' THEN 2
            END AS SORT_ORDER
     FROM TBL_FOOTER
     WHERE F_DEL_YN='N'
       AND LANG_SET = :LANG
       AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') >= F_REVISION_DT
       AND F_DIVISION IN ('OFFER_PRIVACY_REFUND', 'OFFER_PRIVACY')
     ORDER BY F_REVISION_DT DESC) WHERE RN = 1
     ORDER BY SORT_ORDER`;
}

/**
 * @description 다이닝 약관 조회 쿼리
 * @returns 다이닝 약관 조회 쿼리
 */
export const serviceTerms_getServiceTermsDining_Query = () => {
    return `SELECT F_DIVISION AS DIVISION
                 , F_TITLE AS TITLE
                 , F_CTNT AS CONTENT
            FROM (SELECT F_DIVISION
                       , F_TITLE
                       , F_CTNT
                       , ROW_NUMBER() OVER(PARTITION BY F_DIVISION ORDER BY F_REVISION_DT DESC) AS rn
                       , CASE F_DIVISION
                            WHEN 'PRV_DINING' THEN 1
                            WHEN 'PRV_DINING_RFD' THEN 2
                        END AS SORT_ORDER
                  FROM TBL_FOOTER
                  WHERE F_DEL_YN='N'
                    AND LANG_SET = :LANG
                    AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') >= F_REVISION_DT
                    AND F_DIVISION IN ('PRV_DINING_RFD', 'PRV_DINING')
                  ORDER BY F_REVISION_DT DESC) WHERE RN = 1
            ORDER BY SORT_ORDER`;
};

/**
 * @description 카지노 약관 조회 쿼리
 * @returns 카지노 약관 조회 쿼리
 */
export const serviceTerms_getServiceTermsCasino_Query = () => {
    return `SELECT
        F_DIVISION AS DIVISION
        , F_TITLE AS TITLE
        , F_CTNT AS CONTENT
    FROM (
        SELECT
            F_DIVISION
            , F_TITLE
            , F_CTNT
            , ROW_NUMBER() OVER(PARTITION BY F_DIVISION ORDER BY F_REVISION_DT DESC) AS rn
        FROM
            TBL_FOOTER
        WHERE F_DEL_YN='N'
            AND LANG_SET = :LANG
            AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') >= F_REVISION_DT
            AND F_DIVISION in ('INTG_CSN_AGREEMENT','INTG_CSN_PRIVACY','INTG_CSN_SPC_GBINFO','INTG_CSN_PRIVACY_THIRD','INTG_CSN_MARKETING','INTG_CSN_SENSITIVE_INFO')
        ORDER BY CASE F_DIVISION    WHEN 'INTG_CSN_AGREEMENT' THEN 1
                                    WHEN 'INTG_CSN_PRIVACY' THEN 2
                                    WHEN 'INTG_CSN_SPC_GBINFO' THEN 3
                                    WHEN 'INTG_CSN_PRIVACY_THIRD' THEN 4
                                    WHEN 'INTG_CSN_MARKETING' THEN 5
                                    WHEN 'INTG_CSN_SENSITIVE_INFO' THEN 6
                    END
            , F_REVISION_DT DESC)
    WHERE RN = 1
    `;
};
