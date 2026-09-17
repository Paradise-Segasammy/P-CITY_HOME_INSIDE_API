import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { DevWebAuthTokenRequestDto } from '../dto/dev-web-auth-token.request.dto';
import { DevWebAuthTokenResponseDto } from '../dto/dev-web-auth-token.response.dto';
import { DevWebAuthService } from '../services/dev-web-auth.service';

/**
 * 개발용 Web Auth Controller
 */
@ApiTags('dev-auth')
@Controller('dev/web-auth')
export class DevWebAuthController {
  constructor(private readonly service: DevWebAuthService) {}

  /**
   * 개발용 Web Auth Token 생성
   * @param body - 개발용 Web Auth Token 요청 DTO
   * @returns 개발용 Web Auth Token 응답 DTO
   */
  @Post('token')
  @ApiSecurity('home-api-key')
  @ApiOperation({
    summary: '개발용 Access JWT 생성',
    description:
      '로컬/개발 Swagger 테스트 전용. 운영에서는 비활성화되며, 실제 연동에서는 펜타브리드가 JWT를 발급',
  })
  @ApiSuccessResponse(DevWebAuthTokenResponseDto)
  createToken(@Body() body: DevWebAuthTokenRequestDto) {
    return this.service.createToken(body);
  }
}
