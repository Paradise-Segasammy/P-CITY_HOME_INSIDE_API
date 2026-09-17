/**
 * 멤버 로그인 조회 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 로그인 조회 쿼리
 */
export const findMemberLoginQuery = (memberTable: string) => `
      SELECT USER_ID AS "userId", CUST_NO AS "custNo", USER_PWD AS "userPassword",
             NVL(PWD_ERR_CNT, 0) AS "passwordFailCount",
             CASE
               WHEN PWD_ERR_DT IS NOT NULL
                AND PWD_ERR_DT >= SYSDATE - INTERVAL '10' MINUTE
               THEN 'UNPASS'
               ELSE 'PASS'
             END AS "isPass"
        FROM ${memberTable}
       WHERE USER_ID = :userId
      `;

/**
 * 멤버 로그인 조회 쿼리 (잠금)
 * @returns 멤버 로그인 조회 쿼리 (잠금)
 */
export const findMemberLoginForUpdateQuery = findMemberLoginQuery('TBL_MEMBER') + ' FOR UPDATE NOWAIT';

/**
 * 멤버 아이디 조회 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 아이디 조회 쿼리
 */
export const countMemberByUserIdQuery = (memberTable: string) => `
      SELECT COUNT(USER_ID) AS "count"
        FROM ${memberTable}
       WHERE USER_ID = :userId
      `;

/**
 * 멤버 비밀번호 실패 횟수 업데이트 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 비밀번호 실패 횟수 업데이트 쿼리
 */
export const updatePasswordFailCountQuery = (memberTable: string) => `
        UPDATE ${memberTable}
           SET PWD_ERR_CNT = :passwordFailCount,
               PWD_ERR_DT = SYSDATE
         WHERE USER_ID = :userId
        `;

/**
 * 멤버 비밀번호 실패 횟수 초기화 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 비밀번호 실패 횟수 초기화 쿼리
 */
export const resetPasswordFailCountQuery = (memberTable: string) => `
        UPDATE ${memberTable}
           SET PWD_ERR_CNT = 0,
               PWD_ERR_DT = NULL
         WHERE USER_ID = :userId
        `;
