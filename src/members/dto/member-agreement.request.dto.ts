import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

/**
 * 약관 동의 요청 DTO
 */
export class MemberAgreementRequestDto {
  @ApiProperty({ enum: ['Y', 'N'], description: 'Location consent. App PUSH consent is not modified.' })
  /**
   * 위치 동의
   */
  @IsIn(['Y', 'N'])
  userLocation!: 'Y' | 'N';
}
