import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BusinessException } from '../../../src/common/errors/business.exception';
import { CommonErrorCode } from '../../../src/common/errors/common-error-code';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('HttpExceptionFilter', () => {
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
});
