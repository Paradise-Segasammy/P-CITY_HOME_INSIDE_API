/**
 * 멤버 프로필 조회 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 프로필 조회 쿼리
 */
export const findMemberProfileQuery = (memberTable: string) => `
      SELECT USER_ID AS "userId",
             CUST_NO AS "custNo",
             USER_NM AS "userName",
             USER_SEX AS "userSex",
             USER_ENG_NM1 AS "userFirstName",
             USER_ENG_NM2 AS "userLastName",
             USER_BIRTHDAY AS "userBirthday",
             USER_ZIP_CD AS "userZipCode",
             USER_ADDR1 AS "userAddress1",
             USER_ADDR2 AS "userAddress2",
             USER_ADDR3 AS "userAddress3",
             USER_CITY AS "userCityTown",
             USER_STATE AS "userState",
             USER_TEL AS "userPhone",
             USER_EMAIL AS "userEmail",
             USER_WEDDING AS "userWeddingAnniversary",
             USER_JOB AS "userJob",
             USER_NATIONNO AS "userCountryNumber",
             USER_COUNTRY AS "userCountryName",
             USER_DM_DIVISION AS "userDmDivision",
             USER_SELECT_INFO AS "userSelectInformation",
             USER_INTEREST AS "userInterest"
        FROM ${memberTable}
       WHERE USER_ID = :userId
    `;

/**
 * 멤버 수신 동의 조회 쿼리
 * @param schema - 스키마 이름
 * @returns 멤버 수신 동의 조회 쿼리
 */
export const findMemberAgreementQuery = (schema?: string) => `
      SELECT CD.MARKETING_USE_YN, CD.MAIL_RCV_FLAG, CD.SEL_CUSTINFO_USE_YN,
             CP.PUSH_RCV_FLAG, CP.LOCATION_FLAG
        FROM ${schema ? `${schema}.` : ''}CR_ICM_CUST_DET_R CD
        LEFT JOIN ${schema ? `${schema}.` : ''}CR_ICM_CUST_DET_R_SUB CP ON CD.CUST_NO = CP.CUST_NO
       WHERE CD.CUST_NO = :custNo
    `;
