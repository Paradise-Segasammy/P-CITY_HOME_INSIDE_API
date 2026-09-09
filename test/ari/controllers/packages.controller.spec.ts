import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request = require('supertest');
import { AppModule } from '../../../src/app.module';
import { DatabaseService } from '../../../src/database/database.service';
import { ResponseInterceptor } from '../../../src/common/interceptors/response.interceptor';
import { PackageInfoService } from '../../../src/ari/services/package-info.service';
import { PackageRateService } from '../../../src/ari/services/package-rate.service';

describe('ARI package routes', () => {
  let app: INestApplication;
  const getPackages = jest.fn().mockResolvedValue({ packages: [] });
  const getPackageRoomRates = jest.fn().mockResolvedValue({ rates: [] });
  const base = '/api/ari/packages';
  const rates = `${base}/12345/rooms/GAD/rates`;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(DatabaseService).useValue({})
      .overrideProvider(ConfigService).useValue({ get: (key: string) => key === 'app.homeApiKey' ? 'test-key' : undefined })
      .overrideProvider(PackageInfoService).useValue({ getPackages })
      .overrideProvider(PackageRateService).useValue({ getPackageRoomRates })
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    await app.init();
  });
  beforeEach(() => jest.clearAllMocks());
  afterAll(async () => { await app?.close(); });

  it('serves packages under ARI with the existing query and envelope', async () => {
    const { body } = await request(app.getHttpServer()).get(base).set('x-api-key', 'test-key')
      .query({ langSet: 'KO', channel: 'WEB' }).expect(200);
    expect(getPackages).toHaveBeenCalledWith(expect.objectContaining({ langSet: 'KO', channel: 'WEB' }));
    expect(body).toMatchObject({ success: true, data: { packages: [] }, path: `${base}?langSet=KO&channel=WEB` });
  });

  it('preserves rate parameters and query', async () => {
    const { body } = await request(app.getHttpServer()).get(rates).set('x-api-key', 'test-key')
      .query({ startSearchDate: '20260908', endSearchDate: '20260909' }).expect(200);
    expect(getPackageRoomRates).toHaveBeenCalledWith(
      expect.objectContaining({ packageNumber: '12345', roomCode: 'GAD' }),
      expect.objectContaining({ startSearchDate: '20260908', endSearchDate: '20260909' }),
    );
    expect(body).toMatchObject({ success: true, data: { rates: [] } });
  });

  it.each([base, rates])('requires the shared key for %s', async path => {
    for (const key of [undefined, 'wrong']) {
      const req = request(app.getHttpServer()).get(path);
      if (key) req.set('x-api-key', key);
      await req.expect(401);
    }
    expect(getPackages).not.toHaveBeenCalled();
    expect(getPackageRoomRates).not.toHaveBeenCalled();
  });

  it.each(['/api/packages', '/api/packages/12345/rooms/GAD/rates'])('does not expose legacy route %s', async path => {
    await request(app.getHttpServer()).get(path).set('x-api-key', 'test-key').expect(404);
    expect(getPackages).not.toHaveBeenCalled();
    expect(getPackageRoomRates).not.toHaveBeenCalled();
  });

  it('retains query validation', async () => {
    await request(app.getHttpServer()).get(rates).set('x-api-key', 'test-key')
      .query({ startSearchDate: 'invalid' }).expect(400);
    expect(getPackageRoomRates).not.toHaveBeenCalled();
  });

  it('groups both operations under ari in Swagger', () => {
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().build());
    for (const path of [base, `${base}/{packageNumber}/rooms/{roomCode}/rates`]) {
      expect(doc.paths[path].get!.tags).toEqual(['ari']);
      expect(doc.paths[path].get!.responses['200']).toBeDefined();
    }
    expect(doc.paths['/api/packages']).toBeUndefined();
    expect(doc.paths['/api/packages/{packageNumber}/rooms/{roomCode}/rates']).toBeUndefined();
  });
});
