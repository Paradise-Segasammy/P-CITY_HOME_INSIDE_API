import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot() {
    return {
      service: 'HOME_API',
      status: 'ok',
    };
  }
}
