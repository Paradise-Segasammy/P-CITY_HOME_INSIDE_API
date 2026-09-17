import { FindIdResponseDto } from '../dto/find-id.response.dto';

/**
 * 회원 아이디 찾기 응답 매퍼
 * @returns FindIdResponseDto
 */
export function toFindIdResponse(): FindIdResponseDto {
  return { queued: true };
}
