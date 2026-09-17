import { Module } from '@nestjs/common';
import { MemberFindIdService } from './services/member-find-id.service';
import { MemberFindIdRepository } from './repositories/member-find-id.repository';
import { MemberSmsRepository } from './repositories/member-sms.repository';
import { MemberJwtService } from './guards/member-jwt.service';
import { MemberIdentityRepository } from './repositories/member-identity.repository';
import { MemberTokenGuard } from './guards/member-token.guard';
import { MemberAccountService } from './services/member-account.service';
import { MemberAccountRepository } from './repositories/member-account.repository';
import { DatabaseModule } from '../database/database.module';
import { MemberIdService } from './services/member-id.service';
import { MemberLoginService } from './services/member-login.service';
import { MembersController } from './controllers/members.controller';
import { MemberLoginRepository } from './repositories/member-login.repository';
import { MemberPasswordService } from './services/member-password.service';
import { MemberPasswordRepository } from './repositories/member-password.repository';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { MemberAgreementService } from './services/member-agreement.service';
import { MemberAgreementRepository } from './repositories/member-agreement.repository';

/**
 * 회원 도메인 모듈
 */
@Module({
  imports: [DatabaseModule],
  controllers: [MembersController], //회원 컨트롤러
  providers: [
    MemberFindIdService,
    MemberFindIdRepository,
    MemberSmsRepository,
    MemberJwtService, //회원 JWT 서비스
    MemberIdentityRepository,
    MemberAgreementService, //약관 동의
    MemberAgreementRepository, //약관 동의 리포지토리
    EmployeeService, //회원 임직원 사번 등록
    EmployeeRepository, //회원 임직원 사번 등록 리포지토리
    MemberPasswordService, //비밀번호 관리
    MemberPasswordRepository, //비밀번호 관리 리포지토리
    MemberIdService, //회원 아이디 관리
    MemberLoginService, //로그인 서비스
    MemberLoginRepository, //로그인 리포지토리
    MemberTokenGuard, //회원 토큰 보호 가드
    MemberAccountService, //회원 계정 관리
    MemberAccountRepository, //회원 계정 리포지토리 관리
  ],
})
export class MembersModule {}
