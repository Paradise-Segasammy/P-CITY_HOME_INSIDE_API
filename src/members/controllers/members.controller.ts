import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberTokenGuard, MemberRequest } from '../guards/member-token.guard';
import { MemberAccountService } from '../services/member-account.service';
import { MemberProfileResponseDto } from '../dto/member-profile.response.dto';
import { IdDuplicationRequestDto } from '../dto/id-duplication.request.dto';
import { IdDuplicationResponseDto } from '../dto/id-duplication.response.dto';
import { LoginStatusRequestDto } from '../dto/login-status.request.dto';
import { LoginStatusResponseDto } from '../dto/login-status.response.dto';
import { MemberIdService } from '../services/member-id.service';
import { MemberLoginService } from '../services/member-login.service';
import { MemberPasswordService } from '../services/member-password.service';
import { PasswordChangeLaterResponseDto } from '../dto/password-change-later.response.dto';
import { EmployeeService } from '../services/employee.service';
import { EmployeeRequestDto } from '../dto/employee.request.dto';
import { EmployeeResponseDto } from '../dto/employee.response.dto';
import { MemberAgreementService } from '../services/member-agreement.service';
import { MemberAgreementRequestDto } from '../dto/member-agreement.request.dto';
import { MemberAgreementResponseDto } from '../dto/member-agreement.response.dto';

/**
 * 회원 관련 API 컨트롤러
 */
@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(
    private readonly memberLoginService: MemberLoginService,
    private readonly memberIdService: MemberIdService,
    private readonly memberAccountService: MemberAccountService,
    private readonly memberPasswordService: MemberPasswordService,
    private readonly employeeService: EmployeeService,
    private readonly memberAgreementService: MemberAgreementService,
  ) {}

  /**
   * [PATCH] /members/agreements
   * 선택적 약관 동의 여부 수정
   * @param request member (액세스 토큰)
   * @param body userLocation
   * @returns MemberAgreementResponseDto
   */
  @Patch('agreements')
  @UseGuards(MemberTokenGuard)
  @ApiSecurity({ 'home-api-key': [], 'member-access-token': [] })
  @ApiOperation({
    summary: '선택적 약관 동의 여부 수정',
    description:
      'DX_AUT_100010024. 인천 회원의 위치정보 동의를 수정합니다. userLocation 필수. 앱 PUSH·마케팅 활용 동의는 변경하지 않습니다.',
  })
  @ApiSuccessResponse(MemberAgreementResponseDto)
  updateAgreements(@Req() request: MemberRequest, @Body() body: MemberAgreementRequestDto) {
    return this.memberAgreementService.update(request.member, body, request.ip ?? null);
  }

  /**
   * [POST] /members/employee
   * 임직원 사번 등록
   * @param request member (액세스 토큰)
   * @param body empId, branchCd
   * @returns EmployeeResponseDto
   */
  @Post('employee')
  @UseGuards(MemberTokenGuard)
  @ApiSecurity({ 'home-api-key': [], 'member-access-token': [] })
  @ApiOperation({ summary: '임직원 사번 등록' })
  @ApiSuccessResponse(EmployeeResponseDto)
  registerEmployee(@Req() request: MemberRequest, @Body() body: EmployeeRequestDto) {
    return this.employeeService.register(request.member, body);
  }

  /**
   * [POST] /members/password/change-later
   * 비밀번호 변경 취소일 업데이트
   * @param request member (액세스 토큰)
   * @returns PasswordChangeLaterResponseDto
   */
  @Post('password/change-later')
  @UseGuards(MemberTokenGuard)
  @ApiSecurity({ 'home-api-key': [], 'member-access-token': [] })
  @ApiOperation({ summary: '비밀번호 변경 취소일 업데이트' })
  @ApiSuccessResponse(PasswordChangeLaterResponseDto)
  postponePasswordChange(@Req() request: MemberRequest) {
    return this.memberPasswordService.postponePasswordChange(request.member);
  }

  /**
   * [GET] /members/me
   * 액세스 토큰 기준 인천 회원 정보 및 수신 동의 조회
   * @param request member (액세스 토큰)
   * @returns MemberProfileResponseDto
   */
  @Get('me')
  @UseGuards(MemberTokenGuard)
  @ApiSecurity({ 'home-api-key': [], 'member-access-token': [] })
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiSuccessResponse(MemberProfileResponseDto)
  getMyInfo(@Req() request: MemberRequest) {
    return this.memberAccountService.getMyInfo(request.member);
  }

  /**
   * [POST] /members/login
   * 로그인 전 회원 상태, 비번 일치 여부, 연속 실패횟수 확인
   * @param body userId, userPwd
   * @returns LoginStatusResponseDto
   */
  @Post('login')
  @ApiOperation({
    summary: '로그인'
  })
  @ApiSuccessResponse(LoginStatusResponseDto)
  checkLoginStatus(@Body() body: LoginStatusRequestDto) {
    return this.memberLoginService.checkLoginStatus(body);
  }

  /**
   * [POST] /members/id/duplication
   * 회원가입용 아이디 중복 여부 확인
   * @param body userId
   * @returns IdDuplicationResponseDto
   */
  @Post('id/duplication')
  @ApiOperation({
    summary: '아이디 중복 확인',
  })
  @ApiSuccessResponse(IdDuplicationResponseDto)
  checkIdDuplication(@Body() body: IdDuplicationRequestDto) {
    return this.memberIdService.checkDuplicate(body);
  }
}
