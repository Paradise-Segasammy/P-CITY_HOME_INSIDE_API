import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { MemberIdentityRepository } from '../repositories/member-identity.repository';
import { MemberJwtService } from './member-jwt.service';

export interface MemberIdentity {
  userId: string;
  custNo: string;
  mode: 'MEMBER' | 'GUEST';
}
export interface MemberRequest extends Request {
  member: MemberIdentity;
}

/**
 * 인천 회원 토큰 검증 가드
 */
@Injectable()
export class MemberTokenGuard implements CanActivate {
  constructor(
    private readonly jwt: MemberJwtService,
    private readonly identities: MemberIdentityRepository,
  ) {}
  /**
   * 인천 회원 토큰 검증 가드 활성화 여부 확인
   * @param context 실행 컨텍스트
   * @returns 토큰 검증 여부
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<MemberRequest>();
    const header = request.headers.authorization;
    const token = typeof header === 'string' ? /^Bearer ([^\s]+)$/i.exec(header)?.[1] : undefined;

    if (!token) throw new UnauthorizedException('Bearer access token is required.');
    
    const { subject } = this.jwt.verify(token);
    
    if (!/^\d{10}$/.test(subject)) throw new UnauthorizedException('Invalid member subject.');
    
    const member = await this.identities.findUnique(subject);
    
    if (!member) throw new ForbiddenException('Member identity is unavailable or ambiguous.');
    request.member = { userId: member.userId, custNo: member.custNo, mode: 'MEMBER' };
    return true;
  }
}
