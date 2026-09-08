import {
  DatabaseHealthResponseDto,
  HealthResponseDto,
  NamedDatabaseHealthResponseDto,
} from '../dto/health-response.dto';

export const toHealthResponse = (uptime: number): HealthResponseDto => ({ status: 'up', uptime });

export const toDatabaseHealthResponse = (result: {
  status: string;
  databaseTime: Date | null;
}): DatabaseHealthResponseDto => ({
  status: result.status,
  databaseTime: result.databaseTime,
});

export const toNamedDatabaseHealthResponse = (result: {
  status: string;
  databaseTime: Date | null;
  database: string;
}): NamedDatabaseHealthResponseDto => ({
  ...toDatabaseHealthResponse(result),
  database: result.database,
});
