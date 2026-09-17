import type { EmployeeMemberRow, EmployeeRow } from '../repositories/employee.repository';

/**
 * HOME 회원명과 IRDB 임직원명을 비교
 * @param employee IRDB 임직원 정보
 * @param member HOME 회원 정보
 * @returns 회원명과 임직원명이 같은 사람으로 볼 수 있는지 여부
 */
export function matchesEmployeeName(employee: EmployeeRow, member: EmployeeMemberRow): boolean {
  if (member.USER_NM?.trim() && employee.EMP_NM?.startsWith(member.USER_NM)) return true;
  const normalize = (value: string) => value.replace(/\s+/g, '').toLowerCase();
  const names = [member.USER_NM ?? ''];
  if (member.USER_ENG_NM1?.trim() && member.USER_ENG_NM2?.trim()) {
    names.push(member.USER_ENG_NM1 + member.USER_ENG_NM2, member.USER_ENG_NM2 + member.USER_ENG_NM1);
  }
  const parts = member.USER_NM?.trim().split(/\s+/) ?? [];
  if (parts.length === 2) names.push(parts[1] + parts[0]);
  const candidates = names.map(normalize).filter(Boolean);
  const employeeNames = [employee.EMP_NM ?? '', employee.ENG_EMP_NM ?? ''].map(normalize).filter(Boolean);
  return candidates.some((name) => employeeNames.some((employeeName) => employeeName.startsWith(name)));
}
