export class HealthResponseDto {
  status: string;
  uptime: number;
}

export class DatabaseHealthResponseDto {
  status: string;
  databaseTime: Date | null;
}

export class NamedDatabaseHealthResponseDto extends DatabaseHealthResponseDto {
  database: string;
}
