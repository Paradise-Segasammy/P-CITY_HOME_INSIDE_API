import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request = require('supertest');
import { AppModule } from '../../../src/app.module';
import { DatabaseService } from '../../../src/database/database.service';
import { ResponseInterceptor } from '../../../src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('Service terms API', () => {
  let app: INestApplication;
  const executeOn = jest.fn();
  const endpoint = '/api/terms';

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ConfigService)
      .useValue({ get: (key: string) => key === 'app.homeApiKey' ? 'terms-test-key' : undefined })
      .overrideProvider(DatabaseService)
      .useValue({ executeOn })
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  beforeEach(() => executeOn.mockReset().mockResolvedValue({ rows: [] }));
  afterAll(async () => { await app?.close(); });

  it.each([undefined, 'wrong'])('rejects invalid API key %s', async (key) => {
    const req = request(app.getHttpServer()).get(endpoint).query({ gubun: 'JOIN', LANG: 'KO' });
    if (key) req.set('x-api-key', key);
    await req.expect(401);
    expect(executeOn).not.toHaveBeenCalled();
  });

  it.each([
    {}, { gubun: 'JOIN' }, { LANG: 'KO' },
    { gubun: 'INVALID', LANG: 'KO' }, { gubun: 'JOIN', LANG: 'XX' },
    { gubun: 'JOIN', LANG: 'KO', unexpected: 'value' },
  ])('rejects invalid query %j', async (query) => {
    await request(app.getHttpServer()).get(endpoint).set('x-api-key', 'terms-test-key').query(query).expect(400);
    expect(executeOn).not.toHaveBeenCalled();
  });

  it.each([
    ['JOIN', 'AGREEMENT', 'EN'], ['GROUP', 'INTG_AGREEMENT', 'EN'],
    ['PAYMENT', 'OFFER_PRIVACY_LOGIN', 'KO'], ['PAYMENT_GUEST', 'OFFER_PRIVACY', 'KO'],
    ['DINING_PAYMENT', 'PRV_DINING', 'KO'], ['CASINO', 'INTG_CSN_AGREEMENT', 'EN'],
  ])('selects the legacy %s query and language without a member token', async (gubun, division, language) => {
    const { body } = await request(app.getHttpServer()).get(endpoint)
      .set('x-api-key', 'terms-test-key').query({ gubun, LANG: 'EN' }).expect(200);
    expect(executeOn).toHaveBeenCalledWith('home', expect.stringContaining(`'${division}'`), { LANG: language });
    const sql = executeOn.mock.calls[0][1];
    expect(sql).toContain('TBL_FOOTER');
    expect(sql).toContain('ROW_NUMBER()');
    expect(sql).toContain('RN = 1');
    expect(sql).toContain('SYSDATE');
    expect(body).toMatchObject({ success: true, data: { agreementsList: [] } });
    expect(body.timestamp).toEqual(expect.any(String));
    expect(body.path).toContain(endpoint);
  });

  it('maps required and optional terms and exposes only response fields', async () => {
    executeOn.mockResolvedValue({ rows: [
      { DIVISION: 'AGREEMENT', TITLE: 'Terms', CONTENT: '<p>Terms</p>', INTERNAL: 'hidden' },
      { DIVISION: 'MARKETING', TITLE: 'Marketing', CONTENT: null },
      { DIVISION: 'UNKNOWN', TITLE: 'Unknown', CONTENT: '' },
    ] });
    const { body } = await request(app.getHttpServer()).get(endpoint).set('x-api-key', 'terms-test-key')
      .query({ gubun: 'JOIN', LANG: 'KO' }).expect(200);
    expect(body.data.agreementsList).toHaveLength(2);
    expect(body.data.agreementsList[0]).toEqual({
      division: 'userAppAgree', isY: 'Y', title: 'Terms', koTitle: expect.any(String), content: '<p>Terms</p>',
    });
    expect(body.data.agreementsList[1]).toMatchObject({ division: 'userMarketingUseYN', isY: 'N', content: '' });
  });

  it('does not expose database errors', async () => {
    executeOn.mockRejectedValue(new Error('private database detail'));
    const { body } = await request(app.getHttpServer()).get(endpoint).set('x-api-key', 'terms-test-key')
      .query({ gubun: 'JOIN', LANG: 'KO' }).expect(500);
    expect(body.success).toBe(false);
    expect(JSON.stringify(body)).not.toContain('private database detail');
  });

  it('documents the wrapped response', () => {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder().build());
    const response = document.paths[endpoint]?.get?.responses['200'] as any;
    expect(response.content['application/json'].schema.allOf[1].properties.data.$ref).toBe('#/components/schemas/ServiceTermsResponseDto');
    expect(document.components?.schemas?.ServiceTermsResponseDto).toBeDefined();
  });

  it.each([
    ['/api/packages', 'get', 'PackageListResponseDto'],
    ['/api/packages/{packageNumber}/rooms/{roomCode}/rates', 'get', 'PackageRoomRatesResponseDto'],
  ])('documents %s with the shared envelope', (path, method, model) => {
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().build());
    const operation = doc.paths[path]?.[method as 'get' | 'post'];
    const response = operation?.responses['200'] as any;
    expect(response.content['application/json'].schema.allOf).toEqual([
      { $ref: '#/components/schemas/ApiSuccessResponseDto' },
      { type: 'object', required: ['data'], properties: { data: { $ref: `#/components/schemas/${model}` } } },
    ]);
    expect(doc.components?.schemas?.[model]).toBeDefined();
  });
});
