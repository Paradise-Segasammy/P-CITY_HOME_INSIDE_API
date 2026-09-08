import { Injectable } from '@nestjs/common';
import { toAppResponse } from './mappers/app-response.mapper';

/**
 * 루트 경로 응답 서비스
 */
@Injectable()
export class AppService {
  getRoot() {
    return toAppResponse();
  }
}
