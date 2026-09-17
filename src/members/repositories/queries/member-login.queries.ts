/**
 * 멤버 로그인 조회 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 로그인 조회 쿼리
 */
export const findMemberLoginQuery = (memberTable: string) => `
      SELECT USER_ID AS "userId", CUST_NO AS "custNo", USER_PWD AS "userPwd",
             NVL(PWD_ERR_CNT, 0) AS "pwdFailCnt",
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
export const updatePwdFailCntQuery = (memberTable: string) => `
        UPDATE ${memberTable}
           SET PWD_ERR_CNT = :pwdFailCnt,
               PWD_ERR_DT = SYSDATE
         WHERE USER_ID = :userId
        `;

/**
 * 멤버 비밀번호 실패 횟수 초기화 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 비밀번호 실패 횟수 초기화 쿼리
 */
export const resetPwdFailCntQuery = (memberTable: string) => `
        UPDATE ${memberTable}
           SET PWD_ERR_CNT = 0,
               PWD_ERR_DT = NULL
         WHERE USER_ID = :userId
        `;
