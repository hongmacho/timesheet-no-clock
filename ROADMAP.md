# ROADMAP: 타임시트: 클릭 없는 시간 기록

**프로젝트**: timesheet-no-clock  
**기간**: 7 sprints (7주)  
**스택**: Next.js 16 (App Router) + TypeScript + shadcn/ui + Drizzle + better-sqlite3

---

## Sprint 0: 프로젝트 셋업 (1주)

### 목표
Next.js 16 프로젝트 뼈대 구축, DB 스키마 확정, 개발 환경 준비

### 완료 기준
- [ ] Next.js 16 프로젝트 생성 (App Router, TypeScript)
- [ ] ESLint + Prettier 설정
- [ ] Drizzle ORM + better-sqlite3 초기화
- [ ] DB 마이그레이션 스크립트 작성
- [ ] .env.example 작성
- [ ] 기본 레이아웃 (Header, Sidebar, Footer) 구성
- [ ] Git 초기화 및 첫 커밋
- [ ] shadcn/ui 설치 및 테마 설정

### 기술 스펙
- **DB 경로**: `./data/app.db` (로컬 SQLite)
- **마이그레이션 경로**: `./drizzle/*.sql`
- **레이아웃 파일**: `app/layout.tsx`, `app/(main)/layout.tsx`
- **환경 변수**:
  - `DATABASE_URL` (기본값: `file:./data/app.db`)
  - `NODE_ENV` (development | production)

### Deliverables
- `package.json` (의존성 확정)
- `next.config.ts` (serverExternalPackages: ['better-sqlite3'])
- `drizzle.config.ts` (마이그레이션 설정)
- `src/db/schema.ts` (Drizzle 스키마)
- `src/db/index.ts` (DB 클라이언트)
- `app/layout.tsx` (루트 레이아웃)

---

## Sprint 1: 대시보드 & 프로젝트 관리 (1주)

### 목표
홈 화면 대시보드 + 프로젝트 CRUD 기능 구현

### 완료 기준
- [ ] 대시보드 화면 (`/`) 구현
  - 이번 주 시간 요약 (카드)
  - 프로젝트별 누계 (테이블)
  - "+ 시간 기록하기" 버튼
- [ ] 프로젝트 관리 화면 (`/projects`)
  - 프로젝트 목록 테이블
  - 프로젝트 생성 모달
  - 프로젝트 편집 인라인
  - 프로젝트 삭제 확인
- [ ] API 라우트 (`/api/projects`)
  - GET /api/projects (목록)
  - POST /api/projects (생성)
  - PATCH /api/projects/[id] (수정)
  - DELETE /api/projects/[id] (삭제)
- [ ] 모바일 반응형 UI (Tailwind)

### Deliverables
- `app/(main)/page.tsx` (대시보드)
- `app/(main)/projects/page.tsx` (프로젝트 목록)
- `app/api/projects/route.ts` (API)
- `components/ProjectForm.tsx` (폼)
- `components/Dashboard.tsx` (대시보드 컴포넌트)

### DB 작업
- users 테이블 기본 seed (현재 사용자)
- projects 테이블 CRUD 쿼리

---

## Sprint 2: 자연어 파싱 & 시간 입력 (2주)

### 목표
핵심 기능: 자연어 텍스트 파싱 엔진, 시간 입력 폼 구현

### 완료 기준
- [ ] 자연어 파싱 엔진 (`src/lib/parser.ts`)
  - 한국어 날짜 인식 (어제, 오늘, 내일, 상대 날짜)
  - 프로젝트명 인식 (기존 프로젝트 목록과 매칭)
  - 시간 형식 인식 (2h, 2시간, 150분, 2:30, 2h30m)
  - 설명/메모 추출
  - 정규식 기반 (AI 아님)
  - > 95% 파싱 성공률 (일반적 패턴)
- [ ] 텍스트 입력 화면 (`/log/new`)
  - 자유형 텍스트 입력
  - 실시간 파싱 미리보기
  - 자동 수정 제안
  - "저장" 버튼
- [ ] 정규 폼 입력 화면 (`/log`)
  - 프로젝트 드롭다운
  - 날짜 캘린더
  - 시간 슬라이더 (0~12시간, 15분 단위)
  - 메모 입력
- [ ] API 라우트 (`/api/time-entries`)
  - POST /api/time-entries (생성)
  - POST /api/time-entries/parse (파싱 미리보기)

### Deliverables
- `src/lib/parser.ts` (파싱 엔진)
- `src/lib/parser.test.ts` (테스트 케이스 50+)
- `app/(main)/log/page.tsx` (정규 폼)
- `app/(main)/log/new/page.tsx` (자연어 입력)
- `components/TextInput.tsx` (텍스트 입력)
- `components/TimeForm.tsx` (정규 폼)
- `app/api/time-entries/route.ts` (API)

### 파서 테스트 케이스
```
✓ "Design: 2h" → {project: "Design", hours: 2, date: today}
✓ "어제 오후 2시간 디자인" → {project: "Design", hours: 2, date: yesterday}
✓ "2시간 Backend" → {project: "Backend", hours: 2, date: today}
✓ "150분 회의" → {project: "회의", hours: 2.5, date: today}
✓ "지난주 월요일 3h 컨설팅" → {project: "컨설팅", hours: 3, date: last-monday}
... (50+ 더)
```

---

## Sprint 3: 시간 기록 목록 & 수정/삭제 (1주)

### 목표
기록된 시간 조회, 수정, 삭제 기능 구현

### 완료 기준
- [ ] 시간 기록 목록 화면 (`/logs`)
  - 날짜순 정렬 테이블
  - 프로젝트 | 날짜 | 시간 | 메모 열
  - 인라인 편집 (프로젝트, 시간, 메모)
  - 인라인 삭제 (확인 후)
  - 빈 상태 메시지
- [ ] 일괄 삭제 (체크박스)
- [ ] Undo 기능 (최근 삭제)
- [ ] API 라우트
  - GET /api/time-entries (목록)
  - PATCH /api/time-entries/[id] (수정)
  - DELETE /api/time-entries/[id] (삭제)
  - POST /api/time-entries/[id]/undo (되돌리기)
- [ ] 모바일 UI (터치 친화적 편집)

### Deliverables
- `app/(main)/logs/page.tsx` (목록)
- `components/TimeEntryList.tsx` (테이블)
- `components/TimeEntryRow.tsx` (행, 인라인 편집)
- `app/api/time-entries/[id]/route.ts` (PATCH, DELETE)

---

## Sprint 4: 검색/필터 & 통계 (1주)

### 목표
시간 기록 검색, 필터링, 통계 대시보드 구현

### 완료 기준
- [ ] 검색 & 필터 UI (`/logs`)
  - 프로젝트 검색 (자동완성)
  - 날짜 범위 필터 (From~To)
  - 태그 필터
  - 필터 초기화 버튼
- [ ] 통계 화면 (`/analytics`)
  - 주간 요약 탭 (프로젝트별 누계)
  - 월간 요약 탭 (프로젝트별 누계)
  - 막대 차트 (recharts 사용)
  - 총 시간, 평균 시간
  - 예상 청구액 (누적 시간 × 프로젝트 시급)
- [ ] API 라우트
  - GET /api/time-entries?from=&to=&project=&tags= (필터링)
  - GET /api/analytics/weekly
  - GET /api/analytics/monthly
- [ ] 캐싱 (선택사항, 성능)

### Deliverables
- `app/(main)/logs/page.tsx` (검색/필터 추가)
- `app/(main)/analytics/page.tsx` (통계)
- `components/SearchFilter.tsx` (검색/필터)
- `components/Analytics.tsx` (차트)
- `src/lib/analytics.ts` (집계 로직)

---

## Sprint 5: 청구서 생성 & CSV 내보내기 (1주)

### 목표
청구서 자동 생성, PDF 다운로드, 데이터 내보내기

### 완료 기준
- [ ] 청구서 화면 (`/invoices`)
  - 청구서 생성 폼
    - 기간 선택 (From~To 또는 월/년 선택)
    - 프로젝트 선택 (멀티 또는 단일)
  - 청구서 미리보기
    - 청구자 정보
    - 청구 대상 정보
    - 항목별 시간, 시급, 금액
    - 총액
  - "PDF 다운로드" 버튼 (pdfkit 또는 html2pdf)
  - 생성된 청구서 목록 (drafted, sent, paid)
- [ ] API 라우트
  - POST /api/invoices (생성)
  - GET /api/invoices (목록)
  - GET /api/invoices/[id] (상세)
  - POST /api/invoices/[id]/pdf (PDF 생성)
  - PATCH /api/invoices/[id]/status (상태 업데이트)
- [ ] CSV 내보내기
  - GET /api/time-entries/export?format=csv (시간 기록)
  - GET /api/invoices/[id]/export?format=csv

### Deliverables
- `app/(main)/invoices/page.tsx` (청구서 목록 & 생성)
- `components/InvoiceForm.tsx` (폼)
- `components/InvoicePreview.tsx` (미리보기)
- `app/api/invoices/route.ts` (API)
- `src/lib/pdf.ts` (PDF 생성)
- `src/lib/csv.ts` (CSV 내보내기)

---

## Sprint 6: 마무리 & QA (1주)

### 목표
버그 수정, 성능 최적화, 배포 준비, 문서 완성

### 완료 기준
- [ ] 모든 화면 한국어 UI 100% (버튼, 레이블, 메시지)
- [ ] 모바일 반응형 테스트 (Chrome DevTools)
- [ ] 성능 최적화
  - 번들 크기 < 300KB (gzip)
  - Lighthouse 점수 > 80
  - 페이지 로드 < 1.5초
- [ ] 버그 수정 & 엣지 케이스
  - 파싱 오류 케이스
  - 시간 입력 유효성 검사
  - 빈 프로젝트/기록 상태
- [ ] 테스트 커버리지 > 80%
  - 파서 테스트 완전
  - API 테스트
  - 컴포넌트 스냅샷 테스트
- [ ] README.md 작성 (설치, 실행, 기능)
- [ ] .gitignore 확인 (*.db, .env.local 포함)
- [ ] 린트/포매터 최종 체크
  - `npm run lint` → 0 errors
  - `npm run format` → 전체 코드
- [ ] 최종 커밋 & 푸시

### Deliverables
- `README.md` (한국어)
- 모든 파일 한국어 UI 검증
- 테스트 결과 스크린샷
- `CHANGELOG.md` (변경사항)

---

## 컴포넌트 구조 (Component Architecture)

```
app/
├── layout.tsx                    (루트 레이아웃)
├── (main)/
│   ├── layout.tsx               (메인 레이아웃: 헤더, 사이드바)
│   ├── page.tsx                 (대시보드 / 홈)
│   ├── projects/
│   │   └── page.tsx             (프로젝트 관리)
│   ├── log/
│   │   ├── page.tsx             (정규 폼 입력)
│   │   └── new/page.tsx         (자연어 파싱)
│   ├── logs/
│   │   └── page.tsx             (시간 기록 목록)
│   ├── analytics/
│   │   └── page.tsx             (통계 대시보드)
│   ├── invoices/
│   │   └── page.tsx             (청구서 관리)
│   └── settings/
│       └── page.tsx             (설정)
├── api/
│   ├── projects/
│   │   ├── route.ts             (GET, POST)
│   │   └── [id]/route.ts        (PATCH, DELETE)
│   ├── time-entries/
│   │   ├── route.ts             (GET, POST)
│   │   ├── [id]/route.ts        (PATCH, DELETE)
│   │   ├── parse/route.ts       (파싱 미리보기)
│   │   └── export/route.ts      (CSV 내보내기)
│   ├── analytics/
│   │   ├── weekly/route.ts
│   │   └── monthly/route.ts
│   └── invoices/
│       ├── route.ts             (GET, POST)
│       └── [id]/
│           ├── route.ts         (GET, PATCH)
│           ├── pdf/route.ts     (PDF 생성)
│           └── export/route.ts  (CSV 내보내기)
├── 404.tsx
└── error.tsx

components/
├── layout/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── dashboard/
│   ├── Dashboard.tsx
│   └── WeeklySummary.tsx
├── projects/
│   ├── ProjectList.tsx
│   ├── ProjectForm.tsx
│   └── ProjectCard.tsx
├── time-entries/
│   ├── TimeEntryList.tsx
│   ├── TimeEntryRow.tsx
│   ├── TextInput.tsx
│   └── TimeForm.tsx
├── analytics/
│   ├── Analytics.tsx
│   ├── WeeklyChart.tsx
│   ├── MonthlyChart.tsx
│   └── StatsCard.tsx
├── invoices/
│   ├── InvoiceForm.tsx
│   ├── InvoicePreview.tsx
│   ├── InvoiceList.tsx
│   └── InvoiceItem.tsx
├── common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   └── EmptyState.tsx
└── ui/
    └── (shadcn/ui 컴포넌트)

src/
├── db/
│   ├── schema.ts                (Drizzle 스키마)
│   ├── index.ts                 (DB 클라이언트)
│   └── migrations/              (SQL 마이그레이션)
├── lib/
│   ├── parser.ts                (자연어 파싱 엔진)
│   ├── parser.test.ts           (파서 테스트)
│   ├── analytics.ts             (통계 로직)
│   ├── pdf.ts                   (PDF 생성)
│   ├── csv.ts                   (CSV 내보내기)
│   ├── utils.ts                 (헬퍼 함수)
│   └── constants.ts             (상수)
├── types/
│   └── index.ts                 (TS 타입 정의)
└── services/
    ├── projectService.ts
    ├── timeEntryService.ts
    ├── invoiceService.ts
    └── analyticsService.ts
```

---

## DB 스키마 (최종 확정)

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company_name TEXT,
  currency TEXT DEFAULT 'KRW',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### projects
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  hourly_rate REAL NOT NULL,
  description TEXT,
  tags TEXT, -- JSON array: '["web", "consulting"]'
  status TEXT DEFAULT 'active', -- 'active' | 'archived'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, name)
);
CREATE INDEX idx_projects_user_id ON projects(user_id);
```

### time_entries
```sql
CREATE TABLE time_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  date DATE NOT NULL,
  hours REAL NOT NULL, -- 2.5 = 2h 30m
  notes TEXT,
  source TEXT DEFAULT 'manual', -- 'manual' | 'parsed'
  deleted BOOLEAN DEFAULT 0, -- Soft delete for Undo
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
```

### invoices
```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_hours REAL,
  total_amount REAL,
  status TEXT DEFAULT 'draft', -- 'draft' | 'sent' | 'paid'
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
```

### invoice_items
```sql
CREATE TABLE invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  hours REAL NOT NULL,
  hourly_rate REAL NOT NULL,
  amount REAL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
```

---

## 개발 환경 체크리스트

- [ ] Node.js 18+ 설치
- [ ] `npm install`
- [ ] `.env.local` 생성 (DATABASE_URL 기본값 OK)
- [ ] `npm run dev` (localhost:3000)
- [ ] 브라우저에서 `/` 확인
- [ ] ESLint/Prettier 자동 포매팅 설정

---

## 배포 체크리스트 (Sprint 6 후)

- [ ] `npm run build` 성공
- [ ] `npm run lint` 0 errors
- [ ] `npm run test` 모든 테스트 통과
- [ ] DB 마이그레이션 자동화
- [ ] README.md 완성
- [ ] .gitignore 확인
- [ ] 최종 커밋 & 푸시
- [ ] git log 확인 (커밋 메시지 명확)

---

END OF ROADMAP
