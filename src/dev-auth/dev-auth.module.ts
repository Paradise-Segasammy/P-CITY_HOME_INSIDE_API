import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevWebAuthController } from './controllers/dev-web-auth.controller';
import { DevWebAuthService } from './services/dev-web-auth.service';

@Module({
  imports: [ConfigModule],
  controllers: [DevWebAuthController],
  providers: [DevWebAuthService],
})
export class DevAuthModule {}
