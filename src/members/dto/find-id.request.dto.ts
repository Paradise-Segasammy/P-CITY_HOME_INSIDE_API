import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches, MaxLength } from 'class-validator';

/**
 * 회원 아이디 찾기 요청 DTO
 */
export class FindIdRequestDto {
  /** TBL_MEMBER.USER_NM 또는 영문 이름 대조값 */
  @ApiProperty({ description: '회원 이름. USER_NM 또는 영문 이름과 대조', example: '홍길동' })
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  userNm: string;

  /** TBL_MEMBER.USER_TEL 대조값. 해외 번호는 국가번호-현지번호 형식 */
  @ApiProperty({ description: '가입 휴대폰번호. 해외는 86-18962300378 형식', example: '010-1234-5678' })
  @IsString()
  @Matches(/^\+?\d[\d-]{6,28}\d$/)
  userTel: string;

  @ApiProperty({ description: 'KO 외에는 영문 발송', enum: ['KO', 'EN', 'JA', 'ZNCN', 'ZNTW'] })
  @IsIn(['KO', 'EN', 'JA', 'ZNCN', 'ZNTW'])
  lang: string;
}
