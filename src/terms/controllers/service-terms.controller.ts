import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { ServiceTermsQueryDto } from '../dto/service-terms-query.dto';
import { ServiceTermsResponseDto } from '../dto/service-terms.response.dto';
import { ServiceTermsService } from '../services/service-terms.service';

/**
 * 서비스 약관 조회 API 컨트롤러
 */
@ApiTags('terms')
@Controller('terms')
export class ServiceTermsController {
  constructor(private readonly service: ServiceTermsService) {}

  /**
   * @description 약관 조회 API
   * @param query 약관 조회 쿼리
   * @returns 약관 조회 응답
   */
  @Get()
  @ApiOperation({ summary: '약관 조회'})
  @ApiSuccessResponse(ServiceTermsResponseDto)
  getTerms(@Query() query: ServiceTermsQueryDto) {
    return this.service.getTerms(query);
  }
}
