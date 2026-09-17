export const findMemberIdentityQuery = `
  SELECT USER_ID AS "userId", CUST_NO AS "custNo"
    FROM TBL_MEMBER
   WHERE CUST_NO = :custNo
`;
