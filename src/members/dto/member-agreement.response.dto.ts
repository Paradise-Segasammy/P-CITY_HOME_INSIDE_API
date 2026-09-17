import { ApiProperty } from '@nestjs/swagger';

/**
 * 약관 동의 응답 DTO
 */
export class MemberAgreementResponseDto {
  @ApiProperty({ example: true, description: 'Requested consent state is applied, including an unchanged state.' })
  /**
   * 약관 동의 여부
   */
  updated!: boolean;
}
