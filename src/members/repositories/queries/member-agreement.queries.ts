/**
 * 멤버 동의 정보 조회 쿼리
 * @param memberTable - 멤버 테이블 이름
 * @returns 멤버 동의 정보 조회 쿼리
 */
export const findAgreementMemberQuery = (memberTable: string) => `
  SELECT CUST_NO FROM ${memberTable} WHERE USER_ID = :USER_ID
`;

// Lock an existing parent even when the optional consent row has not been created.
/**
 * 멤버 동의 정보 잠금 쿼리
 * @returns 멤버 동의 정보 잠금 쿼리
 */
export const lockAgreementCustomerQuery = `
  SELECT CUST_NO FROM CR_ICM_CUST_DET_R
  WHERE BRANCH_CD = :BRANCH_CD AND CUST_NO = :CUST_NO
  FOR UPDATE NOWAIT
`;

/**
 * 멤버 동의 정보 조회 쿼리
 * @returns 멤버 동의 정보 조회 쿼리
 */
export const findOptionalAgreementQuery = `
  SELECT LOCATION_FLAG FROM CR_ICM_CUST_DET_R_SUB
  WHERE BRANCH_CD = :BRANCH_CD AND CUST_NO = :CUST_NO
`;

// Legacy anonymous PL/SQL MERGE, scoped to web location consent only.
/**
 * 멤버 동의 정보 저장 쿼리
 * @returns 멤버 동의 정보 저장 쿼리
 */
export const mergeOptionalAgreementQuery = `
BEGIN
  MERGE INTO CR_ICM_CUST_DET_R_SUB PT
  USING (SELECT :CUST_NO AS CUST_NO, :BRANCH_CD AS BRANCH_CD FROM DUAL) ST
  ON (PT.CUST_NO = ST.CUST_NO AND PT.BRANCH_CD = ST.BRANCH_CD)
  WHEN MATCHED THEN
    UPDATE SET PT.MOD_DTIME = SYSDATE, PT.MOD_EMPNO = :CHANNEL, PT.MOD_IP = :IP,
      PT.LOCATION_FLAG = :LOCATION_FLAG,
      PT.LOCATION_UPDATE_DT = SYSDATE
  WHEN NOT MATCHED THEN
    INSERT (BRANCH_CD, CUST_NO, LOCATION_FLAG, LOCATION_UPDATE_DT, REG_DTIME, REG_EMPNO, REG_IP)
    VALUES (ST.BRANCH_CD, ST.CUST_NO, :LOCATION_FLAG, SYSDATE, SYSDATE, :CHANNEL, :IP);
  IF SQL%ROWCOUNT = 1 THEN
    :PO_RESULT := 0;
  ELSE
    :PO_RESULT := -1002;
  END IF;
END;
`;
