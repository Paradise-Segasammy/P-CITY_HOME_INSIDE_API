/**
 * 멤버 비밀번호 변경 나중에 처리 쿼리
 * @returns 멤버 비밀번호 변경 나중에 처리 쿼리
 */
export const updatePasswordChangeLaterQuery = `UPDATE TBL_MEMBER
    SET PWD_MOD_REJ_DT = SYSDATE
    WHERE USER_ID = :USER_ID
    `;
