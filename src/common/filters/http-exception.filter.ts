import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../errors/business.exception';

/**
 * HTTP 예외 응답 포맷 필터
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  /**
   * 예외 처리
   * @param exception 예외
   * @param host 인자
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    if (status >= 500) {
      // Log diagnostic codes, not SQL, binds, credentials or request contents.
      const databaseCodes = exception instanceof Error
        ? [...new Set(exception.message.match(/\b(?:ORA|NJS|DPI)-\d+\b/g) ?? [])]
        : [];
      this.logger.error(JSON.stringify({
        event: 'http_server_error',
        statusCode: status,
        method: request.method,
        route: request.route?.path ?? 'unmatched',
        databaseCodes,
      }));
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      ...(exception instanceof BusinessException ? { code: exception.code } : {}),
      message: this.getMessage(exceptionResponse),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  /**
   * 메시지 가져오기
   * @param exceptionResponse 예외 응답
   * @returns 메시지
   */
  private getMessage(exceptionResponse: string | object): string | object {
    if (typeof exceptionResponse === 'string') return exceptionResponse;
    return exceptionResponse;
  }
}
