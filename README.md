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



## 코드 작성 기준

### 이름과 주석

파일명은 `member-find-id.service.ts`처럼 소문자와 하이픈을 사용한다.
클래스와 타입은 `MemberFindIdService`, `FindIdMemberRow`처럼 PascalCase,
메서드와 변수는 `findMembers`, `userTel`처럼 camelCase로 작성한다.

DB 컬럼에 대응하는 DTO 필드와 내부 변수는 컬럼 약어를 기준으로 이름을 맞춘다.

| DB 컬럼 | 코드 필드 | 의미 |
| --- | --- | --- |
| USER_ID | userId | 로그인 아이디 |
| USER_PWD | userPwd | 비밀번호 |
| USER_NM | userNm | 회원 이름 |
| USER_TEL | userTel | 회원 전화번호 |
| CUST_NO | custNo | 고객번호 |
| BRANCH_CD | branchCd | 지점 코드 |
| EMP_ID | empId | 사번 |


DTO에는 필드 의미와 대응 컬럼을 주석으로 남기고, Swagger에 입력 조건과 예시를 작성한다.
필수 여부, 길이, 허용값은 설명만 쓰지 않고 검증 데코레이터에도 반영한다.

```ts
/** TBL_MEMBER.USER_NM: 회원 이름 */
@ApiProperty({ description: '회원 이름. USER_NM 대조값', example: '홍길동' })
@IsString()
@Matches(/\S/)
@MaxLength(100)
userNm: string;
```

### 계층별 역할

| 구분 | 역할 |
| --- | --- |
| Controller | 요청 DTO 수신, Service 호출, URL과 인증 및 응답 계약 정의 |
| Service | 회원 매칭 등 업무 판단, 처리 순서와 트랜잭션 범위 결정 |
| Repository | 연결 풀 선택, 바인딩, SQL 실행, 조회 결과 반환 |
| queries | SQL 정의와 순수한 SQL 선택 및 조립 |
| Mapper | 처리 결과를 Response DTO로 변환 |
| DTO | 요청 검증과 공개 응답 구조 정의 |

Controller에는 SQL이나 업무 판단을 넣지 않는다. 같은 도메인의 요청은 기존 Controller에 모으고,
규모나 책임이 달라질 때 분리한다. 엔드포인트가 늘었다는 이유만으로 Controller를 하나씩 만들지 않는다.

Service와 Repository도 API별로 무조건 나누지 않는다. 함께 변경되는 업무는 한곳에 두고,
문자 발송처럼 다른 기능에서도 사용하는 DB 처리는 별도 Repository로 관리한다.
새 Provider와 Controller를 추가하면 도메인의 `module.ts`에 등록한다.

이름 비교나 날짜 변환처럼 DB와 Nest 의존성이 없는 함수는 도메인 `utils/`에 둔다.
여러 도메인에서 실제로 함께 쓰는 경우에만 `common/`으로 옮긴다.
웹과 앱의 업무 로직은 재사용하고, 인증과 세션 처리처럼 채널마다 다른 부분을 구분한다.

### SQL 및 트랜잭션

- SQL은 `repositories/queries/`에 Repository의 책임 단위로 묶는다. 업무 SQL 본문을 Service나 Repository에 직접 작성하지 않는다.
- 사용자 값은 `:userId` 같은 바인드 변수로 전달한다. 문자열에 직접 이어 붙이지 않는다.
- 설정에서 받은 DB Link 등 SQL 식별자는 Repository에서 허용 형식을 검증한 뒤 query 함수에 전달한다.
- queries에서는 DB, 환경변수, HTTP DTO, 현재 시각에 직접 접근하지 않는다.
- Repository의 Row 타입은 DTO와 별도로 정의하고, SELECT 컬럼 및 별칭과 맞춘다.
- 같은 트랜잭션의 SQL에는 동일한 connection을 전달한다. 실제 commit/rollback은 `DatabaseService.transaction()`으로 처리한다.
- HOME과 IRDB를 각각 호출하는 작업은 하나의 트랜잭션이 아니다. 중간 실패 시 어느 작업까지 반영되는지 확인한다.

기존 SQL을 옮기는 작업에서는 조회 조건, 바인드, 정렬, DB 함수 호출을 먼저 보존한다.
업무상 조건 변경이 필요하면 구조 변경과 구분해서 기록하고 테스트한다.
자세한 기준은 [Repository 및 SQL 작성 기준](docs/repository-query-conventions.md)을 참고한다.

### 응답과 오류

성공 결과는 순수 Mapper에서 Response DTO로 변환한다. DB Row를 그대로 응답하거나
Service에서 `success`, `data`를 직접 감싸지 않는다. 공통 응답은 `ResponseInterceptor`가 한 번만 적용한다.

- 일반 JSON API는 `@ApiSuccessResponse(ResponseDto)`로 실제 HTTP 상태와 Swagger 응답을 함께 정의한다.
- 다른 성공 상태가 필요하면 위 데코레이터의 상태 옵션을 사용한다. 충돌하는 `@HttpCode`를 따로 붙이지 않는다.
- 업무 오류는 `BusinessException`, 일반 HTTP 오류는 Nest 예외로 전달하고 공통 필터에서 응답을 만든다.
- 예외를 잡아서 성공 응답 형태로 반환하지 않는다. 내부 SQL 오류나 접속 정보를 응답에 포함하지 않는다.
- 파일, 스트림, 외부 콜백, 본문 없는 204 등은 실제 계약에 맞게 별도로 문서화한다.
- `@SkipResponseEnvelope()`는 성공 응답 포장만 생략한다. 인증이나 예외 처리를 생략하는 설정이 아니다.

### 테스트와 문서

테스트는 루트 `test/` 아래에 소스의 도메인과 계층을 맞춰 작성한다.
예를 들어 `src/members/services/member-login.service.ts`의 테스트는
`test/members/services/member-login.service.spec.ts`에 둔다. `src/` 안에는 테스트를 만들지 않는다.
여러 도메인을 함께 검증하는 E2E 테스트는 `test/e2e/*.e2e-spec.ts`에 둔다.

API 추가나 변경 시 정상 처리 외에 입력 오류, 인증 실패, 조회 결과 없음, DB 실패를 확인한다.
쓰기 작업은 commit/rollback을, 구조 변경은 기존 SQL과 바인드 및 응답 계약이 유지되는지 확인한다.
모킹한 테스트 통과와 실제 Oracle 연동 확인은 구분해서 기록한다.

API 명세는 `docs/api/<domain>/<DX_ID>.md`에 코드와 함께 수정한다.
요청과 응답 표, 예시, 오류, 이관 변경점, 검증 상태를 반영하고 DX ID와 명칭은 유지한다.
기존 INF ID는 이관 참고 항목으로 별도 표기한다. 미구현 항목에 호출 가능한 것처럼 URL이나 필드를 적지 않는다.

직접 사용하는 연결 풀과 DB Link를 통한 접근은 구분해서 개별 명세와
[DB 접근 목록](docs/api/database-access.md)에 적는다. DB Link의 실제 대상은 이름만 보고 추정하지 않는다.
공통 HTTP 계약은 [공통 API 규칙](docs/api/common.md)을 따른다.



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

실제 S2S 키 검증은 전역 `ApiKeyGuard`, 회원 JWT 검증은 `MemberTokenGuard`가 담당한다.
`@ApiSecurity('home-api-key')`는 Swagger의 인증 요구사항을 표시하는 설정이며 실제 인증을 수행하지 않는다.
현재 `main.ts`에 S2S의 전역 Swagger 설정이 있고, 회원 인증이 필요한 메서드는
S2S와 JWT를 함께 요구하도록 `@ApiSecurity({ 'home-api-key': [], 'member-access-token': [] })`를 명시한다.

개인키는 펜타브리드가 관리하고 HOME_API는 공개키로 검증한다.

로그인 계약과 공개키 설정은 [웹 인증 기준](docs/web-member-auth-contract.md),
Swagger 개발 토큰 발급은 [웹 인증 테스트](docs/web-member-auth-testing.md)를 참고한다.
웹 로그아웃은 펜타에서 처리하며 HOME_API는 로그아웃 API를 제공하지 않는다.

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
