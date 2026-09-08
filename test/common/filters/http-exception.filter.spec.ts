import { ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { BusinessException } from '../../../src/common/errors/business.exception';
import { CommonErrorCode } from '../../../src/common/errors/common-error-code';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('HttpExceptionFilter', () => {
  let log: jest.SpyInstance;
  beforeEach(() => { log = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined); });
  afterEach(() => jest.restoreAllMocks());
  const render = (error: unknown) => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = {
      switchToHttp: () => ({ getResponse: () => response, getRequest: () => ({ url: '/api/members/me' }) }),
    } as ArgumentsHost;
    new HttpExceptionFilter().catch(error, host);
    return response;
  };

  it('returns the business code at the top level with its HTTP status', () => {
    const response = render(new BusinessException(CommonErrorCode.RESOURCE_NOT_FOUND));
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 404,
      code: 'RESOURCE_NOT_FOUND',
      message: CommonErrorCode.RESOURCE_NOT_FOUND.message,
      timestamp: expect.any(String),
      path: '/api/members/me',
    });
  });

  it('preserves existing validation error responses', () => {
    const error = new BadRequestException(['userId must be an email']);
    const response = render(error);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json.mock.calls[0][0].message).toEqual(error.getResponse());
    expect(response.json.mock.calls[0][0]).not.toHaveProperty('code');
  });

  it('does not expose unexpected internal errors', () => {
    const response = render(new Error('Internal SQL details'));
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json.mock.calls[0][0].message).toBe('Internal server error');
    expect(response.json.mock.calls[0][0]).not.toHaveProperty('code');
  });

  it('logs database codes without leaking error details', () => {
    render(new Error('ORA-00942: private SQL and credentials; NJS-500'));
    const entry = JSON.parse(log.mock.calls[0][0]);
    expect(entry).toMatchObject({ statusCode: 500, databaseCodes: ['ORA-00942', 'NJS-500'] });
    expect(log.mock.calls[0][0]).not.toContain('private SQL');
    expect(log.mock.calls[0][0]).not.toContain('credentials');
  });

  it('does not log client validation errors as server errors', () => {
    render(new BadRequestException('invalid input'));
    expect(log).not.toHaveBeenCalled();
  });
});
