# 타임시트: 클릭 없는 시간 기록

프리랜서와 컨설턴트를 위한 **간단한 시간 기록 및 청구서 생성 도구**입니다.

## 주요 기능

### 🎯 핵심 기능
- **자연어 시간 기록**: "어제 오후 2시간 디자인 회의" 한 줄로 시간 자동 기록
- **자동 파싱**: 프로젝트, 시간, 날짜를 자동으로 인식
- **프로젝트 관리**: 프로젝트별 시급 설정 및 관리
- **시간 기록 조회**: 날짜별, 프로젝트별 기록 조회
- **통계 대시보드**: 주간/월간 시간 누계 및 예상 청구액 표시

### 🎨 사용자 인터페이스
- 한국어 UI 100% 지원
- 모바일 반응형 디자인
- 직관적인 UX (클릭 최소화)

## 기술 스택

| 분야 | 기술 |
|------|------|
| **프론트엔드** | React 19 + TypeScript |
| **백엔드** | Next.js 16 (App Router) |
| **데이터베이스** | SQLite 3 (로컬) |
| **ORM** | Drizzle ORM 0.28 |
| **스타일링** | Tailwind CSS 3 |
| **UI 컴포넌트** | shadcn/ui |

## 설치 및 실행

### 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone <repo-url>
cd timesheet-no-clock

# 의존성 설치
npm install --legacy-peer-deps

# 환경 변수 설정 (선택사항)
cp .env.example .env.local
```

### 개발 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 사용 방법

### 1. 프로젝트 생성

**경로**: `/projects`

- 프로젝트명, 시급, 설명 입력
- 여러 프로젝트 등록 가능

### 2. 시간 기록 (자연어)

**경로**: `/log/new`

자유로운 형식으로 입력:
```
어제 오후 2시간 디자인 회의
3시간 Backend
150분 Design
2025-01-15 2h 마케팅
```

### 3. 시간 기록 (폼)

**경로**: `/log`

- 프로젝트 선택
- 날짜 입력
- 시간 입력
- 메모 추가

### 4. 시간 기록 조회

**경로**: `/logs`

- 모든 기록 조회
- 프로젝트별 누계
- 예상 청구액 표시

### 5. 통계 및 대시보드

**경로**: `/analytics` 및 `/`

- 주간/월간 시간 요약
- 프로젝트별 누계
- 예상 청구액

## 스크린샷

(스크린샷 추가 예정)

## 데이터 구조

### 주요 테이블

- `users`: 사용자 정보
- `projects`: 프로젝트 (프로젝트명, 시급, 상태)
- `time_entries`: 시간 기록 (프로젝트, 날짜, 시간, 메모)
- `invoices`: 청구서 (현재 개발 중)

모든 데이터는 로컬 SQLite 데이터베이스에 저장됩니다.

## 명령어

```bash
# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check

# 린트 확인
npm run lint

# 포매팅
npm run format

# 빌드
npm run build

# 프로덕션 시작
npm start
```

## 개발 노트

### Next.js 16 특수 사항

- 동적 라우트 params는 Promise: `await params`
- Drizzle ORM: `integer('id').primaryKey({ autoIncrement: true })`
- DB 클라이언트: `BetterSQLite3Database<typeof schema>` 제네릭 필수
- 집계: `sql<number>` + `Number()` 변환

### 파서 (Parser)

자연어 시간 기록은 정규식 기반 패턴 매칭으로 구현:
- 한국어 상대 날짜 인식 (어제, 오늘, 내일, 지난주 등)
- 시간 형식 인식 (2h, 2시간, 150분, 2:30)
- 프로젝트명 매칭 (정확 매칭 → 부분 매칭)

### 구조

```
app/
├── (main)/
│   ├── page.tsx                    (대시보드)
│   ├── projects/page.tsx           (프로젝트 관리)
│   ├── log/page.tsx                (정규 폼 입력)
│   ├── log/new/page.tsx            (자연어 입력)
│   ├── logs/page.tsx               (시간 기록 목록)
│   └── analytics/page.tsx          (통계)
├── api/
│   ├── projects/route.ts           (프로젝트 CRUD)
│   └── time-entries/route.ts       (시간 기록 CRUD)
└── layout.tsx                      (루트 레이아웃)

src/
├── db/
│   ├── schema.ts                   (Drizzle 스키마)
│   └── index.ts                    (DB 클라이언트)
├── lib/
│   ├── parser.ts                   (자연어 파싱 엔진)
│   └── parser.test.ts              (파서 테스트)
├── services/
│   ├── projectService.ts           (프로젝트 서비스)
│   └── timeEntryService.ts         (시간 기록 서비스)
└── types/
    └── index.ts                    (TypeScript 타입)
```

## 제약사항 & 알려진 문제

- MVP 단계: 팀 기능 미지원 (향후 추가)
- 청구서 PDF 생성 미구현 (Sprint 5 예정)
- 클라우드 동기화 미지원 (로컬 데이터만)
- 모바일 앱 버전 미지원

## 향후 계획 (로드맵)

- [ ] 청구서 생성 및 PDF 다운로드
- [ ] CSV 내보내기
- [ ] 팀 기능 (팀원 추가, 시간 수집)
- [ ] AI 기반 고급 파싱
- [ ] 클라우드 백업 및 동기화
- [ ] 반복 기록 (템플릿)
- [ ] 모바일 앱

## 라이선스

MIT

## 기여

이 프로젝트는 개인 학습 프로젝트입니다.

---

**만든이**: Claude (Anthropic)  
**버전**: 0.1.0  
**마지막 업데이트**: 2025-07-08
