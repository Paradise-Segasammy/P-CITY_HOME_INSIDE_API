# HOME_API

NestJS 기반 HOME 웹 백엔드 API 서버입니다.

## Scripts

```bash
npm install
npm run start:dev
npm run build
npm run start:prod
```

## Local

```bash
cp .env.example .env
npm install
npm run start:dev
```

기본 API prefix는 `/api`이며 Swagger는 `/api/docs`에서 확인합니다.

## Structure

```text
src/
  common/       공통 인터셉터, 필터, 데코레이터
  config/       환경 설정
  health/       헬스체크
  app.module.ts 루트 모듈
  main.ts       서버 엔트리포인트
```
