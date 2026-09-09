/**
 * 패키지 룸 타입별 일자별 요금 조회 쿼리
 */
export const findPackageRoomRatesQuery = `
      /* 1. 패키지/룸타입/일자 조건에 맞는 HMS 요금 원천 row를 조회 */
      WITH RATE_ROWS AS (
        SELECT P.RATEDATE,
               P.RMTYPE,
               TO_NUMBER(HM_ROOM_RATE_WEB_FUN@PCT(
                 :branchCd,
                 'ROOMRATE',
                 '0000000000',
                 P.SALESTYPE,
                 '0',
                 P.SALESTYPE_SEQ,
                 :channel,
                 P.RMTYPE,
                 P.RATEDATE,
                 TO_CHAR(TO_DATE(P.RATEDATE, 'YYYYMMDD') + 1, 'YYYYMMDD'),
                 '',
                 '1',
                 '0'
               )) AS SALE_PRICE,
              /* ROOMRATE_ST: ROOMRATE에 대응되는 세금/봉사료 금액. basePrice 임시 산정에 사용 */
               TO_NUMBER(HM_ROOM_RATE_WEB_FUN@PCT(
                 :branchCd,
                 'ROOMRATE_ST',
                 '0000000000',
                 P.SALESTYPE,
                 '0',
                 P.SALESTYPE_SEQ,
                 :channel,
                 P.RMTYPE,
                 P.RATEDATE,
                 TO_CHAR(TO_DATE(P.RATEDATE, 'YYYYMMDD') + 1, 'YYYYMMDD'),
                 '',
                 '1',
                 '0'
               )) AS TAX_PRICE
          FROM HM_RPM_SALESTYPE_RATE_PHM_V@PCT P
         WHERE P.SALESTYPE_SEQ = :packageNumber
           AND P.RMTYPE = :roomCode
           AND P.RATEDATE BETWEEN :startDate AND :endDate
           AND P.CHANNEL = :channel
           AND P.QTY > 0
           AND P.ROOM_USE_YN = 'Y'
           AND P.BRANCH_CD = :branchCd
           AND P.SALES_CUST_NO = '0000000000'
      ),
      /* 2. 동일 일자에 여러 룸타입/요금 row가 있을 수 있어, 일자별 최저 판매가 row 하나를 선택 */
      RANKED_RATE_ROWS AS (
        SELECT RATEDATE,
               RMTYPE,
               SALE_PRICE,
               TAX_PRICE,
               -- FIXME: basePrice is temporarily treated as tax-included normal sale price.
               SALE_PRICE + TAX_PRICE AS BASE_PRICE,
               ROW_NUMBER() OVER (
                 PARTITION BY RATEDATE
                 ORDER BY SALE_PRICE ASC, RMTYPE ASC
               ) AS RN
          FROM RATE_ROWS
      )
      /* 3. 선택된 같은 row의 basePrice/salePrice를 내려서 서로 다른 row의 최저값이 섞이지 않게 처리 */
      SELECT RATEDATE AS "date",
             BASE_PRICE AS "basePrice",
             SALE_PRICE AS "salePrice",
             'N' AS "isTaxIncluded"
        FROM RANKED_RATE_ROWS
       WHERE RN = 1
       ORDER BY RATEDATE
      `;
