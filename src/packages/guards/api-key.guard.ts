import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const configuredApiKey = this.configService.get<string>('app.packageApiKey');
    const requestApiKey = request.header('x-api-key');

    if (!configuredApiKey) {
      throw new UnauthorizedException('Package API key is not configured.');
    }

    if (!requestApiKey || requestApiKey !== configuredApiKey) {
      throw new UnauthorizedException('Invalid Package API key.');
    }

    return true;
  }
}
