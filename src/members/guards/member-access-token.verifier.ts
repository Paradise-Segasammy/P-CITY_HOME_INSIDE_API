import { createPublicKey, KeyObject } from 'node:crypto';
import { decode, verify } from 'jsonwebtoken';

export interface MemberAccessTokenPolicy {
  issuer: string;
  audience: string;
  maxLifetimeSeconds: number;
  clockToleranceSeconds: number;
  keys: Array<{ kid: string; publicKey: string }>;
}

export interface VerifiedMemberAccessToken {
  subject: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * 인천 회원 토큰 검증 검증기
 */
export class MemberAccessTokenVerifier {
  private readonly keys = new Map<string, KeyObject>();
  private readonly policy: Omit<MemberAccessTokenPolicy, 'keys'>;

  constructor(policy: MemberAccessTokenPolicy) {
    if (
      !policy.issuer?.trim() ||
      !policy.audience?.trim() ||
      !Number.isSafeInteger(policy.maxLifetimeSeconds) ||
      policy.maxLifetimeSeconds <= 0 ||
      !Number.isSafeInteger(policy.clockToleranceSeconds) ||
      policy.clockToleranceSeconds < 0 ||
      !policy.keys?.length
    )
      throw new Error('Invalid member access token policy.');

    this.policy = {
      issuer: policy.issuer,
      audience: policy.audience,
      maxLifetimeSeconds: policy.maxLifetimeSeconds,
      clockToleranceSeconds: policy.clockToleranceSeconds,
    };
    for (const entry of policy.keys) {
      if (!entry.kid?.trim() || this.keys.has(entry.kid)) throw new Error('Invalid or duplicate signing key ID.');
      if (!/^-----BEGIN (RSA )?PUBLIC KEY-----/.test(entry.publicKey.trim())) {
        throw new Error('Only PEM public keys are accepted.');
      }
      const key = createPublicKey(entry.publicKey);
      if (key.asymmetricKeyType !== 'rsa' || (key.asymmetricKeyDetails?.modulusLength ?? 0) < 2048) {
        throw new Error('An RSA public key of at least 2048 bits is required.');
      }
      this.keys.set(entry.kid, key);
    }
  }

  /**
   * 인천 회원 토큰 검증
   * @param token 토큰
   * @returns 토큰 검증 결과
   */
  verify(token: string): VerifiedMemberAccessToken {
    try {
      if (typeof token !== 'string' || token.length > 16384) throw new Error();
      // Unverified headers are used only to select a preconfigured key, never a URL or file.
      const decoded = decode(token, { complete: true });
      if (
        !decoded ||
        decoded.header.alg !== 'RS256' ||
        decoded.header.typ !== 'JWT' ||
        typeof decoded.header.kid !== 'string' ||
        decoded.header.crit !== undefined
      )
        throw new Error();
      const key = this.keys.get(decoded.header.kid);
      if (!key) throw new Error();
      const now = Math.floor(Date.now() / 1000);
      const payload = verify(token, key, {
        algorithms: ['RS256'],
        issuer: this.policy.issuer,
        audience: this.policy.audience,
        clockTimestamp: now,
        clockTolerance: this.policy.clockToleranceSeconds,
      });
      if (
        typeof payload === 'string' ||
        payload.token_use !== 'access' ||
        typeof payload.sub !== 'string' ||
        !payload.sub.trim() ||
        payload.sub !== payload.sub.trim() ||
        !Number.isSafeInteger(payload.iat) ||
        !Number.isSafeInteger(payload.exp)
      )
        throw new Error();
      const issuedAt = payload.iat as number;
      const expiresAt = payload.exp as number;
      if (
        issuedAt < 0 ||
        issuedAt > now + this.policy.clockToleranceSeconds ||
        expiresAt <= issuedAt ||
        expiresAt - issuedAt > this.policy.maxLifetimeSeconds
      )
        throw new Error();
      return { subject: payload.sub, issuedAt, expiresAt };
    } catch {
      throw new Error('Invalid member access token.');
    }
  }
}
