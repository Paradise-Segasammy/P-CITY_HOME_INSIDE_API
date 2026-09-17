export interface SmsPhone {
  countryCd: string | null;
  callPhone: string;
}

/**
 * 전화번호 파싱 함수
 * @param value 전화번호
 * @returns SmsPhone | null
 */
export function parseSmsPhone(value: string): SmsPhone | null {
  const phone = value.trim().replace(/^\+/, '');
  if (/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(phone)) {
    return { countryCd: null, callPhone: phone.replace(/-/g, '') };
  }
  const match = phone.match(/^([1-9]\d{0,2})-(\d{6,14})$/);
  if (!match) return null;
  const [, countryCd, number] = match;
  if (countryCd === '82') {
    const domestic = number.startsWith('0') ? number : `0${number}`;
    return /^0\d{8,10}$/.test(domestic) ? { countryCd: null, callPhone: domestic } : null;
  }
  if ((countryCd + number).length > 15) return null;
  return { countryCd, callPhone: number };
}

/**
 * 전화번호 동일 여부 확인 함수
 * @param a SmsPhone
 * @param b SmsPhone
 * @returns 동일 여부
 */
export function sameSmsPhone(a: SmsPhone, b: SmsPhone): boolean {
  return a.countryCd === b.countryCd && a.callPhone === b.callPhone;
}
