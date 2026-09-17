import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

/**
 * 아이디 중복 확인 요청 DTO
 */
export class IdDuplicationRequestDto {
  @ApiProperty({ description: '중복 확인할 사용자 아이디', example: 'user@example.com' })
  /**
   * 중복 확인할 사용자 아이디
   */
  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(200)
  userId: string;
}
