export const findPackagesQuery = `
      SELECT M.RP_SEQ AS "masterPackageNumber",
             TO_CHAR(M.SALESTYPE_SEQ) AS "packageNumber",
             P.RP_ORDER AS "order",
             P.RP_DIVISION AS "division",
             P.OFFER_TYPE AS "offerType",
             P.OFFER_TYPE_CD AS "offerTypeCode",
             P.BADGE_TYPE1 AS "badgeType1",
             P.BADGE_TYPE2 AS "badgeType2",
             P.SOLDOUT_YN AS "soldoutYn",
             P.SALE_PRC AS "salePrice",
             P.DISC_PRC AS "discountPrice",
             P.DISC_RATE AS "discountRate",
             P.SINGLE_PRC_YN AS "singlePriceYn",
             P.RP_KEYWORD_ADD AS "keywordAdd",
             P.SRC_KEYWORD AS "searchKeyword",
             F.F_NAME AS "imageName",
             F.F_URL AS "imagePath",
             P.RP_NAME AS "name",
             P.RP_SUMMARY AS "summary",
             P.RP_KEYWORD AS "keyword"
        FROM TBL_RESERVATION_PACKAGE P
        JOIN TBL_RESERVATION_MAPPING M
          ON P.RP_SEQ = M.RP_SEQ
        LEFT JOIN TBL_FILE F
          ON P.RP_SEQ = F.F_PK
         AND F.F_DIVISION = 'PKG_B'
       WHERE TO_CHAR(SYSDATE, 'YYYY-MM-DD') BETWEEN NVL(P.RP_ST_DT, '0000-00-00') AND NVL(P.RP_ED_DT, '9999-99-99')
         AND P.RP_USE_YN = 'Y'
         AND P.RP_DEL_YN = 'N'
         AND P.RP_HIDDEN_YN = 'N'
         AND P.OFFER_TYPE = 'TA'
         AND P.RP_SCOPE LIKE '%' || :channel || '%'
         AND P.LANG_SET = :langSet
         AND P.RP_CN_YN = :pCnYn
         AND P.SBU_CD LIKE '%' || :sbuCd || '%'
         AND HP_CODE_INF_INFO('TBL_RESERVATION_PACKAGE', 'OFFER_TYPE_CD', P.OFFER_TYPE_CD, 'INF2') = 'Y'
       ORDER BY P.RP_ORDER DESC, P.RP_SEQ DESC, M.SALESTYPE_SEQ
      `;
