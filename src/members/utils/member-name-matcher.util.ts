/**
 * 회원 이름 매칭 함수
 * @param input 
 * @param userNm 회원 이름
 * @param engNm 회원 영문 이름
 * @returns 매칭 여부
 */
export function matchesMemberName(input: string, userNm: string | null, engNm: string | null): boolean {
  const normalize = (value: string) => value.replace(/\s+/g, '').toLowerCase();
  const name = normalize(input);
  if (!name) return false;
  const parts = input.trim().split(/\s+/);
  const candidates = [name];
  if (parts.length === 2) candidates.push(normalize(parts[1] + parts[0]));
  return [userNm, engNm].some(value => !!value && candidates.includes(normalize(value)));
}
