import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * 공통 S2S(Server to Server) API 키 인증 가드 (HOME_API_KEY 사용)
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 활성화 여부 확인
   * @param context 실행 컨텍스트
   * @returns 활성화 여부
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const configuredApiKey = this.configService.get<string>('app.homeApiKey');
    const requestApiKey = request.header('x-api-key');

    if (!configuredApiKey) {
      throw new UnauthorizedException('API key is not configured.');
    }

    if (!requestApiKey || requestApiKey !== configuredApiKey) {
      throw new UnauthorizedException('Invalid API key.');
    }

    return true;
  }
}
