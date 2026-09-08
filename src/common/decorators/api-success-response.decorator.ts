import { applyDecorators, HttpCode, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponseDto } from '../dto/api-success-response.dto';

interface ApiSuccessResponseOptions {
  status?: 200 | 201 | 202;
  isArray?: boolean;
  description?: string;
}

/**
 * 성공 응답 데코레이터
 * @param model 응답 모델
 * @param options 응답 옵션
 * @returns 성공 응답 데코레이터
 */
export function ApiSuccessResponse(model: Type<unknown>, options: ApiSuccessResponseOptions = {}) {
  const status = options.status ?? 200;
  const reference = { $ref: getSchemaPath(model) };
  return applyDecorators(
    HttpCode(status),
    ApiExtraModels(ApiSuccessResponseDto, model),
    ApiResponse({
      status,
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponseDto) },
          {
            type: 'object',
            required: ['data'],
            properties: {
              data: options.isArray ? { type: 'array', items: reference } : reference,
            },
          },
        ],
      },
    }),
  );
}
