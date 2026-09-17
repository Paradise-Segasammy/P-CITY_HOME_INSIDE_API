import { ApiProperty } from '@nestjs/swagger';

/**
 * 내 정보 조회 응답 DTO
 */
export class MemberProfileResponseDto {
  @ApiProperty({ type: String, nullable: true })
  userId: string | null;

  @ApiProperty({ type: String, nullable: true })
  userName: string | null;

  @ApiProperty({ type: String, nullable: true })
  userSex: string | null;

  @ApiProperty({ type: String, nullable: true })
  userFirstName: string | null;

  @ApiProperty({ type: String, nullable: true })
  userLastName: string | null;

  @ApiProperty({ type: String, nullable: true })
  userBirthday: string | null;

  @ApiProperty({ type: String, nullable: true })
  userZipCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  userAddress1: string | null;

  @ApiProperty({ type: String, nullable: true })
  userAddress2: string | null;

  @ApiProperty({ type: String, nullable: true })
  userAddress3: string | null;

  @ApiProperty({ type: String, nullable: true })
  userCityTown: string | null;

  @ApiProperty({ type: String, nullable: true })
  userState: string | null;

  @ApiProperty({ type: String, nullable: true })
  userPhone: string | null;

  @ApiProperty({ type: String, nullable: true })
  userEmail: string | null;

  @ApiProperty({ type: String, nullable: true })
  userWeddingAnniversary: string | null;

  @ApiProperty({ type: String, nullable: true })
  userJob: string | null;

  @ApiProperty({ type: String, nullable: true })
  userCountryNumber: string | null;

  @ApiProperty({ type: String, nullable: true })
  userCountryName: string | null;

  @ApiProperty({ example: 'N' })
  userAllowMarketingYN: string;

  @ApiProperty({ example: 'N' })
  userAllowLocationYN: string;

  @ApiProperty({ example: 'N' })
  userInfoUseSelect: string;

  @ApiProperty({ type: [String] })
  userAllowMarketing: string[];

  @ApiProperty({ type: [String], nullable: true })
  userSelectInformation: string[] | null;

  @ApiProperty({ type: [String], nullable: true })
  userInterest: string[] | null;
}
