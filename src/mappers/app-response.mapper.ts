import { AppResponseDto } from '../dto/app-response.dto';

export const toAppResponse = (): AppResponseDto => ({ service: 'HOME_API', status: 'ok' });
