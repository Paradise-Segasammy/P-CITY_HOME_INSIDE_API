import { BadRequestException, Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/errors/business.exception';
import { CommonErrorCode } from '../../common/errors/common-error-code';
import { FindIdRequestDto } from '../dto/find-id.request.dto';
import { toFindIdResponse } from '../mappers/member-find-id.mapper';
import { MemberFindIdRepository } from '../repositories/member-find-id.repository';
import { MemberSmsRepository } from '../repositories/member-sms.repository';
import { matchesMemberName } from '../utils/member-name-matcher.util';
import { parseSmsPhone, sameSmsPhone } from '../utils/sms-phone.util';

/**
 * 회원 아이디 찾기 서비스
 */
@Injectable()
export class MemberFindIdService {
  constructor(
    private readonly members: MemberFindIdRepository,
    private readonly sms: MemberSmsRepository,
  ) {}

  /**
   * 휴대폰 아이디 찾기
   * @param body name, phoneNumber
   * @returns FindIdResponseDto
   */
  async findId(body: FindIdRequestDto) {
    const requestedPhone = parseSmsPhone(body.userTel);
    if (!requestedPhone || (requestedPhone.countryCd === '86' && body.lang !== 'KO')) {
      throw new BadRequestException('Unsupported phone number.');
    }
    const rows = await this.members.findMembers(requestedPhone.callPhone);
    const matched = rows.filter(row => {
      const phone = row.USER_TEL ? parseSmsPhone(row.USER_TEL) : null;
      return phone && sameSmsPhone(requestedPhone, phone)
        && matchesMemberName(body.userNm, row.USER_NM, row.ENG_NAME);
    });
    if (!matched.length) throw new BusinessException(CommonErrorCode.RESOURCE_NOT_FOUND);

    // 수신처는 회원 DB 값에서만 구성하며 동일한 전체 번호의 아이디만 포함한다.
    const phone = parseSmsPhone(matched[0].USER_TEL!)!;
    const ids = [...new Set(matched.map(row => row.USER_ID))];
    const idText = ids.length > 1 ? ids.map(id => `**${id.substring(2)}`).join(', ') : ids[0];
    const integrated = matched.every(row => row.INTEGRATED_YN === 'Y');
    const label = body.lang === 'KO'
      ? (integrated ? '통합회원 :' : '인천 파라다이스 :')
      : (integrated ? 'Integrated member :' : 'Paradise in Incheon :');
    const content = `${label} ${idText}`;
    const msg = body.lang === 'KO' ? `귀하의 아이디는 [${content}] 입니다.` : `Your ID is [${content}].`;
    await this.sms.enqueue({
      ...phone, msg,
      kind: phone.countryCd ? 'I' : Buffer.byteLength(msg, 'utf8') > 80 ? 'M' : 'S',
    });
    return toFindIdResponse();
  }
}
