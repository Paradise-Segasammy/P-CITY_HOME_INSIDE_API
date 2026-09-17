import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsString, Matches } from 'class-validator';

/**
 * 회원 임직원 사번 등록 요청 DTO
 */
export class EmployeeRequestDto {
  @ApiProperty({ description: '회원이 등록할 임직원 사번', example: 'E12345' })
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
  employeeId!: string;

  /**
   * 회원-임직원 매핑 지점 코드
   */
  @ApiPropertyOptional({ description: 'Incheon mapping branch code', enum: ['1000'], default: '1000' })
  @IsString()
  @IsIn(['1000'])
  branchCode: string = '1000';
}
