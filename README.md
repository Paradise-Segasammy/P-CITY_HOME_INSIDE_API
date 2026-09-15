# HOME_API

파라다이스 홈페이지의 회원 검증과 내부 DB 연동 API 서버.

## 기술 구성

Node.js 20 이상 / NestJS 11 / TypeScript / Oracle / Jest

## 프로젝트 구조

```text
src/
  common/       공통 인증 가드, 오류 코드, 예외 필터, 응답 인터셉터
  config/       환경 설정
  database/     HOME DB, IRDB 연결 및 트랜잭션
  dto/          루트 API 응답 DTO
  mappers/      루트 API 응답 Mapper
  health/       헬스체크 Controller, Service, DTO, Mapper
  terms/        공통 업무 약관 조회
    terms.module.ts   약관 Controller 및 Provider 등록
    controllers/      약관 요청 처리
    services/         조회 조건 처리
    repositories/     약관 DB 실행 및 Row 반환
      queries/        약관 SQL 정의 및 선택
    mappers/          약관 응답 및 제목 변환
    dto/              요청 및 응답 구조
  members/      회원 계정, 인증, 개인정보
    members.module.ts 회원 Controller 및 Provider 등록
    controllers/      회원 요청 처리
    services/         회원 업무 처리
    repositories/     SQL 실행 및 조회 결과 반환
      queries/        회원 SQL 정의 및 조립
    mappers/          응답 변환
    dto/              요청 및 응답 구조
    guards/           회원 토큰 인증
    password/         기존 비밀번호 해시 및 검증
    utils/            회원 업무 보조 함수
  ari/          ARI 엔진 연계
    ari.module.ts     ARI Controller 및 Provider 등록
    controllers/      기능별 요청 처리
    services/         기능별 업무 처리
    repositories/     SQL 실행 및 조회 결과 반환
      queries/        ARI SQL 정의
    mappers/          응답 변환
    dto/              요청 및 응답 구조
    utils/            날짜 등 업무 보조 함수
  app.module.ts 루트 모듈
  main.ts       서버 엔트리포인트

test/           소스의 도메인과 계층에 대응하는 테스트
  e2e/          도메인 간 E2E 테스트 위치

docs/
  api/          API 명세 및 검증 기록
  repository-query-conventions.md
                구조 및 SQL 작성 규칙
```



## 개발 규칙


| 구분         | 역할                                   |
| ---------- | ------------------------------------ |
| Controller | 요청 DTO 수신, Service 호출, HTTP 계약 정의    |
| Service    | 업무 판단, 처리 순서와 트랜잭션 범위 결정             |
| Repository | 연결 풀 선택, 바인딩, SQL 실행, 독립적인 Row 타입 반환 |
| queries    | SQL 정의, 선택 및 조립                      |
| Mapper     | 처리 결과를 공개 응답 DTO로 변환                 |
| DTO        | 요청 검증과 응답 구조 정의                      |




### SQL 및 트랜잭션

- SQL은 `repositories/queries/`에 Repository 책임 단위로 묶는다.
- 사용자 입력은 바인드 변수로 전달한다.
- DB Link 등 SQL 식별자는 Repository에서 검증한다.
- queries에서 DB, 환경변수, HTTP DTO, 현재 시각에 직접 접근하지 않는다.
- 같은 트랜잭션의 SQL은 동일한 연결을 사용한다.



### 응답 및 문서

- 성공 응답은 Mapper와 Response DTO로 구성한다.
- `ResponseInterceptor`가 공통 응답을 한 번만 적용한다.
- Swagger 성공 응답은 `@ApiSuccessResponse(ResponseDto)`로 정의한다.
- 오류는 예외로 전달하고 공통 예외 필터에서 처리한다.
- 파일, 외부 콜백 등 예외 응답은 실제 계약을 별도로 명시한다.
- API 변경 시 요청, 응답, 오류, 이관 내용과 검증 상태를 함께 갱신한다.



## 인증

일반 Controller 요청은 `x-api-key`로 S2S 인증을 수행한다.
서버용 키는 브라우저에 전달하지 않는다.

웹 인증은 다음 역할 분담으로 전환한다.


| 담당    | 역할                                             |
| ----- | ---------------------------------------------- |
| PSS   | 계정 검증, 회원 식별 정보 반환, S2S 및 JWT 검증, 데이터 접근 권한 확인 |
| 펜타브리드 | RS256 JWT 발급, 토큰 갱신, 로그인 유지, 자동로그인 및 로그아웃 관리   |


```http
x-api-key: <S2S 키>
Authorization: Bearer <Access JWT>
```

최초 로그인 검증은 회원 JWT 없이 S2S 키와 로그인 정보를 전달한다.
이후 회원 인증이 필요한 요청에는 두 헤더를 전달한다.

개인키는 펜타브리드가 관리하고 HOME_API는 공개키로 검증한다.

## 실행

```bash
npm install
npm run start:dev
```

빌드 및 실행:

```bash
npm run build
npm run start:prod
```

테스트:

```bash
npm test
npm run test:e2e
```

기본 API 경로: `/api`  
Swagger 경로: `/api/docs`