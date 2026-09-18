import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AriModule } from './ari/ari.module';
import { DevAuthModule } from './dev-auth/dev-auth.module';
import { MembersModule } from './members/members.module';
import { TermsModule } from './terms/terms.module';
import { MembershipsModule } from './memberships/memberships.module';
import { MypagesModule } from './mypages/mypages.module';
import { ActivitiesModule } from './activities/activities.module';
import { FacilitiesModule } from './facilities/facilities.module';

/**
 * 루트 애플리케이션 모듈
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    DatabaseModule,//데이터베이스 모듈
    HealthModule,//상태 모니터링 모듈
    AriModule,//ARI 모듈
    DevAuthModule,//개발용 Web Auth 모듈
    MembersModule,//회원 모듈
    TermsModule,//약관 모듈
    MembershipsModule,
    MypagesModule,
    ActivitiesModule,
    FacilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
