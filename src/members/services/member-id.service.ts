import { Injectable } from '@nestjs/common';
import { toIdDuplicationResponse } from '../mappers/member-response.mapper';
import { IdDuplicationRequestDto } from '../dto/id-duplication.request.dto';
import { IdDuplicationResponseDto } from '../dto/id-duplication.response.dto';
import { MemberLoginRepository } from '../repositories/member-login.repository';

/**
 * 아이디 중복 확인 서비스
 */
@Injectable()
export class MemberIdService {
  constructor(private readonly memberLoginRepository: MemberLoginRepository) {}

  /**
   * 아이디 중복 확인
   * @param command 아이디 중복 확인 요청 DTO
   * @returns 아이디 중복 확인 응답 DTO
   */
  async checkDuplicate(command: IdDuplicationRequestDto): Promise<IdDuplicationResponseDto> {
    const userId = command.userId.trim();
    const duplicated = await this.memberLoginRepository.existsByUserId(userId);

    return toIdDuplicationResponse(userId, duplicated);
  }
}
