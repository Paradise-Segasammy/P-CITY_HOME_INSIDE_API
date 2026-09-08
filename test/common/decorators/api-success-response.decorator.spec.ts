import { Controller, Get, HttpCode, INestApplication, Post } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ApiProperty, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request = require('supertest');
import { ApiSuccessResponse } from '../../../src/common/decorators/api-success-response.decorator';
import { SkipResponseEnvelope } from '../../../src/common/decorators/skip-response-envelope.decorator';
import { ResponseInterceptor } from '../../../src/common/interceptors/response.interceptor';

class ResultDto {
  @ApiProperty()
  id: string;
}

@Controller('responses')
class ResponseTestController {
  @Get()
  @ApiSuccessResponse(ResultDto)
  get() { return { id: 'one' }; }

  @Post()
  @ApiSuccessResponse(ResultDto)
  post() { return { id: 'one' }; }

  @Post('created')
  @ApiSuccessResponse(ResultDto, { status: 201 })
  created() { return { id: 'one' }; }

  @Post('accepted')
  @ApiSuccessResponse(ResultDto, { status: 202 })
  accepted() { return { id: 'one' }; }

  @Get('array')
  @ApiSuccessResponse(ResultDto, { isArray: true })
  array() { return []; }

  @Get('raw')
  @SkipResponseEnvelope()
  raw() { return { providerStatus: 'OK' }; }

  @Post('empty')
  @HttpCode(204)
  @SkipResponseEnvelope()
  empty() { return undefined; }
}

describe('Shared success response contract', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({ controllers: [ResponseTestController] }).compile();
    app = module.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    await app.init();
  });
  afterAll(async () => { await app?.close(); });

  it('wraps a response once', async () => {
    const { body } = await request(app.getHttpServer()).get('/responses').expect(200);
    expect(body).toEqual({ success: true, data: { id: 'one' }, timestamp: expect.any(String), path: '/responses' });
  });

  it.each([['', 200], ['/created', 201], ['/accepted', 202]])('keeps POST %s status aligned with Swagger', async (suffix, status) => {
    const { body } = await request(app.getHttpServer()).post(`/responses${suffix}`).expect(status as number);
    expect(body.data).toEqual({ id: 'one' });
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().build());
    expect(doc.paths[`/responses${suffix}`]?.post?.responses[String(status)]).toBeDefined();
  });

  it('supports an empty data array and registers referenced models', async () => {
    const { body } = await request(app.getHttpServer()).get('/responses/array').expect(200);
    expect(body.data).toEqual([]);
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().build());
    const response = doc.paths['/responses/array'].get?.responses['200'] as any;
    expect(response.content['application/json'].schema.allOf[1].properties.data).toEqual({
      type: 'array', items: { $ref: '#/components/schemas/ResultDto' },
    });
    expect(doc.components?.schemas?.ApiSuccessResponseDto).toMatchObject({ required: ['success', 'timestamp', 'path'] });
    expect(doc.components?.schemas?.ResultDto).toBeDefined();
  });

  it('leaves an explicitly excluded response unchanged', async () => {
    const { body } = await request(app.getHttpServer()).get('/responses/raw').expect(200);
    expect(body).toEqual({ providerStatus: 'OK' });
  });

  it('supports an explicitly excluded 204 response', async () => {
    const { text } = await request(app.getHttpServer()).post('/responses/empty').expect(204);
    expect(text).toBe('');
  });
});
