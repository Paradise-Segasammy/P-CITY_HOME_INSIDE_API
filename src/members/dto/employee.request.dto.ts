import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsString, Matches } from 'class-validator';

/**
 * 회원 임직원 사번 등록 요청 DTO
 */
export class EmployeeRequestDto {
  @ApiProperty({ description: '회원이 등록할 임직원 사번. DB EMP_ID 매핑 대상', example: 'E12345' })
  /**
   * 회원이 등록할 임직원 사번
   */
  @IsString()
  /**
   * 임직원 사번 유효성 검사
   */
  @Matches(/^\S+$/)
  /**
   * 임직원 사번
   */
  empId!: string;

  /**
   * 회원-임직원 매핑 지점 코드
   */
  @ApiPropertyOptional({ description: '회원-임직원 매핑 지점 코드. DB BRANCH_CD', enum: ['1000'], default: '1000' })
  @IsString()
  @IsIn(['1000'])
  branchCd: string = '1000';
}
