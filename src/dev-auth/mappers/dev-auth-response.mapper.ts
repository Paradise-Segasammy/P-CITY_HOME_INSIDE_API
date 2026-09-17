import { DevWebAuthTokenResponseDto } from '../dto/dev-web-auth-token.response.dto';

/**
 * 개발용 Web Auth Token 응답 매퍼
 * @param accessToken - 액세스 토큰 (JWT)
 * @param subject - 주체
 * @param expiresIn - 만료 시간
 * @returns 개발용 Web Auth Token 응답
 */
export const toDevWebAuthTokenResponse = (
  accessToken: string,
  subject: string,
  expiresIn: number,
): DevWebAuthTokenResponseDto => ({
  accessToken,
  tokenType: 'Bearer',
  subject,
  expiresIn,
});
