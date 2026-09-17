import { createHash, timingSafeEqual } from 'crypto';

/**
 * 레거시 PSS 비밀번호 해시/검증 유틸
 */
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i;

/**
 * 레거시 PSS 비밀번호 해시
 * @param password - 비밀번호
 * @returns 레거시 PSS 비밀번호 해시
 */
export const hashPssPassword = (password: string): string => {
  const md5Password = createHash('md5').update(password).digest('hex');
  return createHash('sha256').update(md5Password.toUpperCase()).digest('hex');
};

/**
 * 레거시 PSS 비밀번호 검증
 * @param password - 비밀번호
 * @param storedHash - 저장된 해시
 * @returns 레거시 PSS 비밀번호 검증 결과
 */
export const verifyPssPassword = (password: string, storedHash: string): boolean => {
  if (!SHA256_HEX_PATTERN.test(storedHash)) return false;

  const passwordHash = Buffer.from(hashPssPassword(password), 'hex');
  const expectedHash = Buffer.from(storedHash, 'hex');
  return timingSafeEqual(passwordHash, expectedHash);
};
