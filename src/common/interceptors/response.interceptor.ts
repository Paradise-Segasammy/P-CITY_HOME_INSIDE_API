import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_RESPONSE_ENVELOPE } from '../decorators/skip-response-envelope.decorator';

/**
 * API 응답 인터페이스
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * 정상 JSON 응답 공통 포맷 인터셉터. 실패는 Exception Filter에서 처리합니다.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | T> {
  constructor(private readonly reflector: Reflector) {}

  /**
   * 인터셉트
   * @param context 실행 컨텍스트
   * @param next 다음 핸들러
   * @returns 관찰 가능한 객체
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | T> {
    if (this.reflector.getAllAndOverride<boolean>(SKIP_RESPONSE_ENVELOPE, [context.getHandler(), context.getClass()])) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest<{ url: string }>();

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
