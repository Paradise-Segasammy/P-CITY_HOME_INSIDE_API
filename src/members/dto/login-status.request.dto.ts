import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * 로그인 상태 확인 요청 DTO
 */
export class LoginStatusRequestDto {
  @ApiProperty({ description: '사용자 아이디 또는 카지노 회원번호', example: 'test1@test.com' })
  /**
   * 사용자 아이디 또는 카지노 회원번호
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  userId: string;

  @ApiProperty({ description: '사용자 비밀번호', example: 'paradisecity1!' })
  /**
   * 사용자 비밀번호
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  userPassword: string;
}
