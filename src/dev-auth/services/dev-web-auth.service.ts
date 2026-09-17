import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicKey, generateKeyPairSync } from 'node:crypto';
import { dirname } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { sign } from 'jsonwebtoken';
import { DevWebAuthTokenRequestDto } from '../dto/dev-web-auth-token.request.dto';
import { DevWebAuthTokenResponseDto } from '../dto/dev-web-auth-token.response.dto';
import { toDevWebAuthTokenResponse } from '../mappers/dev-auth-response.mapper';

const DEFAULT_EXPIRES_IN_SECONDS = 300;
const DEV_KEY_ID = 'web-dev-01';

/**
 * 개발용 Web Auth Service
 */
@Injectable()
export class DevWebAuthService {
  constructor(private readonly config: ConfigService) {}

  /**
   * 개발용 Web Auth Token 생성
   * @param command - 개발용 Web Auth Token 생성 요청 명령
   * @returns 개발용 Web Auth Token 응답
   */
  createToken(command: DevWebAuthTokenRequestDto): DevWebAuthTokenResponseDto {
    this.assertEnabled();
    const issuer = this.config.get<string>('app.webJwt.issuer');
    const audience = this.config.get<string>('app.webJwt.audience');
    const privateKeyFile = this.config.get<string>('app.devAuth.privateKeyFile');
    const keysFile = this.config.get<string>('app.webJwt.keysFile');
    if (!issuer || !audience || !privateKeyFile || !keysFile) {
      throw new ServiceUnavailableException('Development web auth is not configured correctly.');
    }

    const expiresIn = command.expiresIn ?? DEFAULT_EXPIRES_IN_SECONDS;
    try {
      const privateKey = this.loadOrCreateKeyPair(privateKeyFile, keysFile);
      const accessToken = sign({ token_use: 'access', sub: command.subject }, privateKey, {
        algorithm: 'RS256',
        keyid: DEV_KEY_ID,
        issuer,
        audience,
        expiresIn,
      });
      return toDevWebAuthTokenResponse(accessToken, command.subject, expiresIn);
    } catch {
      throw new ServiceUnavailableException('Development web auth signing keys are unavailable.');
    }
  }

  /**
   * 개발용 Web Auth 활성화 여부 확인
   */
  private assertEnabled() {
    const nodeEnv = this.config.get<string>('app.nodeEnv', 'local');
    const enabled = this.config.get<boolean>('app.devAuth.enabled', false);
    if (nodeEnv === 'production' || !enabled) throw new NotFoundException('Development web auth is disabled.');
  }

  /**
   * 개발용 키쌍 로드 또는 최초 자동 생성
   * @param privateKeyFile 개인키 파일 경로
   * @param keysFile 공개키 목록 파일 경로
   * @returns 개인키 PEM
   */
  private loadOrCreateKeyPair(privateKeyFile: string, keysFile: string): string {
    if (!existsSync(privateKeyFile)) {
      if (existsSync(keysFile)) throw new Error('Development public key exists without private key.');
      const pair = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        publicKeyEncoding: { type: 'spki', format: 'pem' },
      });
      mkdirSync(dirname(privateKeyFile), { recursive: true, mode: 0o700 });
      mkdirSync(dirname(keysFile), { recursive: true, mode: 0o700 });
      writeFileSync(privateKeyFile, pair.privateKey, { mode: 0o600, flag: 'wx' });
      writeFileSync(keysFile, JSON.stringify({ keys: [{ kid: DEV_KEY_ID, publicKey: pair.publicKey }] }, null, 2), {
        mode: 0o600,
        flag: 'wx',
      });
      return pair.privateKey;
    }

    const privateKey = readFileSync(privateKeyFile, 'utf8');
    if (!existsSync(keysFile)) {
      const publicKey = createPublicKey(privateKey).export({ type: 'spki', format: 'pem' }).toString();
      mkdirSync(dirname(keysFile), { recursive: true, mode: 0o700 });
      writeFileSync(keysFile, JSON.stringify({ keys: [{ kid: DEV_KEY_ID, publicKey }] }, null, 2), {
        mode: 0o600,
        flag: 'wx',
      });
    }
    return privateKey;
  }
}
