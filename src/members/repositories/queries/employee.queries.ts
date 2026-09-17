/**
 * 회원-임직원 매핑 중복 및 삭제 매핑 조회 쿼리
 * @returns 회원-임직원 매핑 조회 쿼리
 */
export const checkEmployeeMappingQuery = `
    SELECT (SELECT COUNT(*)
            FROM TBL_EMP_CUST_MAPPING
            WHERE BRANCH_CD = :BRANCH_CD
                AND EMP_ID = :EMP_ID
                AND (DEL_YN != 'Y' OR DEL_YN IS NULL)) AS IS_MAPPED
        , ( SELECT COUNT(*)
            FROM TBL_EMP_CUST_MAPPING
            WHERE BRANCH_CD = :BRANCH_CD
                AND EMP_ID = :EMP_ID
                AND CUST_NO = :CUST_NO
                AND DEL_YN = 'Y') AS IS_DEL
    FROM DUAL
`;

/**
 * 임직원 검증 대상 HOME 회원 조회 쿼리
 * @returns HOME 회원 조회 쿼리
 */
export const getEmployeeMemberQuery = `
    SELECT USER_NM, USER_ENG_NM1, USER_ENG_NM2, USER_TEL, CUST_NO
    FROM TBL_MEMBER
    WHERE USER_ID = :USER_ID
`;

/**
 * 입력 사번과 회원 전화번호로 IRDB 임직원 조회 쿼리
 * @returns IRDB 임직원 조회 쿼리
 */
export const getMatchingEmployeeQuery = `
    SELECT EMP_NM
        , ENG_EMP_NM
    FROM HR_EMP_MST
    WHERE EMP_ID = :EMP_ID
        AND SUBSTR(REGEXP_REPLACE(MOBILE_NO, '[^0-9]', ''), -8) LIKE CASE WHEN LENGTH(REGEXP_REPLACE(:MOBILE_NO, '[^0-9]', '')) <= 8 THEN '%' || REGEXP_REPLACE(:MOBILE_NO, '[^0-9]', '')
            ELSE '%' || SUBSTR(REGEXP_REPLACE(:MOBILE_NO, '[^0-9]', ''), -8) END
        AND STAT_NM IN ('재직', '휴직')
`;

/**
 * 회원-임직원 매핑 삽입 쿼리
 * @returns 회원-임직원 매핑 삽입 쿼리
 */
export const insertEmployeeMappingQuery = `
    INSERT INTO TBL_EMP_CUST_MAPPING (BRANCH_CD, EMP_ID, CUST_NO)
    VALUES (:BRANCH_CD, :EMP_ID, :CUST_NO)
`;

/**
 * 삭제된 회원-임직원 매핑 복원 쿼리
 * @returns 회원-임직원 매핑 복원 쿼리
 */
export const restoreEmployeeMappingQuery = `
    UPDATE TBL_EMP_CUST_MAPPING
    SET DEL_YN = 'N'
        , MOD_DTIME = SYSDATE
    WHERE BRANCH_CD = :BRANCH_CD
        AND EMP_ID = :EMP_ID
        AND CUST_NO = :CUST_NO
`;

/**
 * 회원-임직원 매핑 테이블 잠금 쿼리
 * @returns 회원-임직원 매핑 잠금 쿼리
 */
export const lockEmployeeMappingsQuery = 'LOCK TABLE TBL_EMP_CUST_MAPPING IN SHARE ROW EXCLUSIVE MODE NOWAIT';
