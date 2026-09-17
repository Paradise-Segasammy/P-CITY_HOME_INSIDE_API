import { IdDuplicationResponseDto } from '../dto/id-duplication.response.dto';
import { LoginStatusResponseDto, MemberStatus } from '../dto/login-status.response.dto';
import { MemberAgreementResponseDto } from '../dto/member-agreement.response.dto';
import { EmployeeResponseDto } from '../dto/employee.response.dto';
import { MemberProfileResponseDto } from '../dto/member-profile.response.dto';
import { PasswordChangeLaterResponseDto } from '../dto/password-change-later.response.dto';
import { MemberAgreementRow, MemberProfileRow } from '../repositories/member-account.repository';

export const toMemberAgreementResponse = (): MemberAgreementResponseDto => ({ updated: true });

export const toEmployeeResponse = (): EmployeeResponseDto => ({ registered: true });

export const toPasswordChangeLaterResponse = (): PasswordChangeLaterResponseDto => ({ updated: true });

/**
 * 아이디 중복 확인
 * @param userId 회원 ID
 * @param duplicated 중복 여부
 * @returns 아이디 중복 확인 응답 DTO
 */
export const toIdDuplicationResponse = (userId: string, duplicated: boolean): IdDuplicationResponseDto => ({
  userId,
  available: !duplicated,
  duplicated,
  legacyResultCode: duplicated ? 411 : 200,
});

/**
 * 로그인 상태 응답
 * @param userId 회원 ID
 * @param memberStatus 회원 상태
 * @param pwdMatched 비밀번호 일치 여부
 * @param pwdFailCnt 비밀번호 실패 횟수
 * @param pwdFailLimit 비밀번호 실패 제한
 * @returns 로그인 상태 응답 DTO
 */
export const toLoginStatusResponse = (
  userId: string,
  memberStatus: MemberStatus,
  pwdMatched: boolean,
  pwdFailCnt: number,
  pwdFailLimit: number,
  custNo: string | null = null,
): LoginStatusResponseDto => ({
  userId,
  memberStatus,
  pwdMatched,
  pwdFailCnt,
  pwdFailLimit,
  authenticated: memberStatus === 'ACTIVE' && pwdMatched && custNo !== null,
  subject: memberStatus === 'ACTIVE' && pwdMatched ? custNo : null,
  custNo: memberStatus === 'ACTIVE' && pwdMatched ? custNo : null,
});

/**
 * 문자열 분리
 * @param value 문자열
 * @returns 문자열 분리 응답 DTO
 */
const split = (value: string | null): string[] | null => (value ? value.split(', ') : null);

/**
 * 회원 정보 응답
 * @param profile 회원 정보
 * @param agreement 약관 동의 정보
 * @returns 회원 정보 응답 DTO
 */
export const toMemberProfileResponse = (
  profile: MemberProfileRow,
  agreement: MemberAgreementRow | null,
): MemberProfileResponseDto => {
  const marketing = split(profile.userDmDivision?.replace('휴대폰', '전화').replace('SMS', '문자') ?? null) ?? [];
  if (agreement?.PUSH_RCV_FLAG === 'Y') marketing.push('푸시알림');
  if (agreement?.MAIL_RCV_FLAG === 'Y') marketing.push('DM');
  return {
    userId: profile.userId,
    userName: profile.userName,
    userSex: profile.userSex,
    userFirstName: profile.userFirstName,
    userLastName: profile.userLastName,
    userBirthday: profile.userBirthday?.includes('--') ? null : profile.userBirthday,
    userZipCode: profile.userZipCode,
    userAddress1: profile.userAddress1,
    userAddress2: profile.userAddress2,
    userAddress3: profile.userAddress3,
    userCityTown: profile.userCityTown,
    userState: profile.userState,
    userPhone: profile.userPhone,
    userEmail: profile.userEmail,
    userWeddingAnniversary: profile.userWeddingAnniversary,
    userJob: profile.userJob,
    userCountryNumber: profile.userCountryNumber,
    userCountryName: profile.userCountryName,
    userAllowMarketingYN: agreement?.MARKETING_USE_YN || 'N',
    userAllowLocationYN: agreement?.LOCATION_FLAG || 'N',
    userInfoUseSelect: agreement?.SEL_CUSTINFO_USE_YN || 'N',
    userAllowMarketing: [...new Set(marketing)],
    userSelectInformation: split(profile.userSelectInformation),
    userInterest: split(profile.userInterest),
  };
};
