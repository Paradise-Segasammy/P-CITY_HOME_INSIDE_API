import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PackageRoomRatesParamDto {
  @ApiProperty({
    description: '패키지 마스터 번호 또는 SALESTYPE_SEQ',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  packageNumber: string;

  @ApiProperty({
    description: '룸 타입 코드',
    example: 'GAD',
  })
  @IsNotEmpty()
  @IsString()
  roomCode: string;
}
