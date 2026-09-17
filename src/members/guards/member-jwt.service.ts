import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'node:fs';
import { MemberAccessTokenVerifier } from './member-access-token.verifier';

/**
 * 인천 회원 토큰 검증 서비스
 */
@Injectable()
export class MemberJwtService {
  private verifier?: MemberAccessTokenVerifier;
  constructor(private readonly config: ConfigService) {}
  /**
   * 인천 회원 토큰 검증
   * @param token 토큰
   * @returns 토큰 검증 결과
   */
  verify(token: string) {
    if (!this.verifier) {
      try {
        const file = this.config.get<string>('app.webJwt.keysFile');
        if (!file) throw new Error('Missing keys file.');
        const document = JSON.parse(readFileSync(file, 'utf8'));
        this.verifier = new MemberAccessTokenVerifier({
          issuer: this.config.get<string>('app.webJwt.issuer')!,
          audience: this.config.get<string>('app.webJwt.audience')!,
          maxLifetimeSeconds: this.config.get<number>('app.webJwt.maxLifetimeSeconds')!,
          clockToleranceSeconds: this.config.get<number>('app.webJwt.clockToleranceSeconds')!,
          keys: document.keys,
        });
      } catch {
        throw new ServiceUnavailableException('Web JWT verification is not configured correctly.');
      }
    }
    try {
      return this.verifier.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.');
    }
  }
}
