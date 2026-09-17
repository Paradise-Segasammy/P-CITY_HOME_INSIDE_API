import { ApiProperty } from '@nestjs/swagger';

export class FindIdResponseDto {
  @ApiProperty({ description: '문자 발송 DB 적재 완료 여부. 실제 수신 완료를 의미하지 않음', example: true })
  queued: boolean;
}
