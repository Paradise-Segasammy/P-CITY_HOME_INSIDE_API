/**
 * 회원 아이디 찾기 쿼리
 */
export const findIdMembersQuery = `
SELECT USER_ID, USER_NM, USER_TEL,
       USER_ENG_NM1 || ' ' || USER_ENG_NM2 AS ENG_NAME, INTEGRATED_YN
FROM TBL_MEMBER
WHERE (
  (LENGTH(REPLACE(REPLACE(TRIM(USER_TEL), '-', ''), '+', '')) < 8
   AND REPLACE(REPLACE(TRIM(USER_TEL), '-', ''), '+', '') =
       REPLACE(REPLACE(TRIM(:userTel), '-', ''), '+', ''))
  OR
  (LENGTH(REPLACE(REPLACE(TRIM(USER_TEL), '-', ''), '+', '')) >= 8
   AND SUBSTR(REPLACE(REPLACE(TRIM(USER_TEL), '-', ''), '+', ''), -8) =
       SUBSTR(REPLACE(REPLACE(TRIM(:userTel), '-', ''), '+', ''), -8))
)
ORDER BY USER_ID`;
