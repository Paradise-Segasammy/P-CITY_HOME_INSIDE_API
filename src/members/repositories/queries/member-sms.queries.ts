/** IRDB 연결에서 기존 문자 발송 DB Link를 사용한다. */
export function enqueueSmsQuery(international: boolean): string {
  if (international) {
    return `INSERT INTO SUREDATA@DBLINK_SMSSEND
      (SEQNO, INTIME, USERCODE, REQNAME, REQPHONE, COUNTRY, CALLNAME, CALLPHONE, SUBJECT, MSG, KIND, DEPTCODE, REQTIME)
      VALUES (SUREDATA_SEQNO.NEXTVAL@DBLINK_SMSSEND,
        CONCAT(TO_CHAR(SYSDATE, 'yyyymmddhh24MI'), '00'), 'pcity2017', 'PHM',
        '8218338855', :countryCd, ' ', :callPhone, 'Message', :msg, 'I', 'OI-VVE-IL', '00000000000000')`;
  }
  return `INSERT INTO SUREDATA@DBLINK_SMSSEND
    (SEQNO, INTIME, USERCODE, REQNAME, REQPHONE, CALLNAME, CALLPHONE, SUBJECT, MSG, KIND, DEPTCODE, REQTIME)
    VALUES (SUREDATA_SEQNO.NEXTVAL@DBLINK_SMSSEND,
      CONCAT(TO_CHAR(SYSDATE, 'yyyymmddhh24MI'), '00'), 'pcity2017', 'PHM',
      '18338855', ' ', :callPhone, 'Message', :msg, :kind, 'OI-VVE-IL', '00000000000000')`;
}
