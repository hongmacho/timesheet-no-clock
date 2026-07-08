# PRD: 타임시트: 클릭 없는 시간 기록

## 1. 개요 (Executive Summary)

**제품명**: 타임시트: 클릭 없는 시간 기록 (Timesheet No-Clock)  
**목표**: 프리랜서/컨설턴트가 클릭 없이 텍스트 한 줄로 시간을 기록하고, 청구서를 자동 생성하는 간단한 타임시트 앱  
**핵심 차별점**: 자연어 패턴 인식으로 "어제 오후 2시간 디자인 회의" 한 줄을 파싱 → 즉시 타임시트 등록 (타이머 클릭 불필요)  
**가치**: Clockify 대비 80% 간단, 텍스트 중심 UX, 즉시 청구서 생성

---

## 2. 타겟 페르소나

### 주 타겟
- **이름**: 김프리 (freelancer)
- **나이**: 28-45세
- **직업**: 웹 개발 프리랜서, UX 디자인 컨설턴트, 경영 컨설턴트
- **주요 Pain**:
  - 매일 여러 프로젝트에 시간을 분산하며, 어느 프로젝트에 몇 시간을 썼는지 기억 안 남
  - Toggl/Harvest 클릭 인터페이스 너무 번거로움
  - 월말에 청구서 수작업 작성 (프로젝트별 시간 × 시급 계산)
  - 수정·추가 기록이 자주 필요함 (회의 시간 기억 후 추가)
- **기술 수준**: 웹/앱 기본 사용 가능 (개발자 아닐 수도)
- **시간 기록 빈도**: 주 5-10회 (퇴근 후 또는 자기 전)
- **팀 규모**: 1인 ~ 5인 프로젝트 다중 보유

### 부 타겟
- **이름**: 박디렉터 (director at consulting firm)
- **나이**: 35-55세
- **직업**: 소규모 컨설팅펌 프로젝트 리더
- **주요 Pain**: 팀원 시간 기록 수집 → 청구서 일괄 생성 필요
- **기대**: 팀원 추가 → 각자 시간 기록 → 청구서 자동 생성

---

## 3. MoSCoW 기능 목록

### Must-Have (8개 이상, 필수)

#### 3.1 텍스트 기반 시간 입력 (자연어 파싱)
**설명**: 사용자가 자유로운 형식의 텍스트 한 줄을 입력하면, AI 아닌 규칙 기반 파서가 다음을 인식:
- 프로젝트명 (예: "디자인", "Backend", "회의")
- 시간 (예: "2h", "2시간", "2:30", "150분")
- 날짜 (예: "어제", "2025-01-15", "월요일")
- 설명 (예: "회의")

**서브기능**:
- 자연어 형식 인식 (한국어 기반 정규식, 영문 혼용)
  - "프로젝트: 시간" (예: "Design: 2h")
  - "시간 프로젝트" (예: "2시간 마케팅")
  - "어제 오후 2시간 디자인 회의"
  - 상대 날짜 해석 (어제, 오늘, 내일, 지난주 월요일)
- 실시간 미리보기 (입력 후 파싱 결과 표시)
- 자동 수정 제안 (일반적 오류 감지, 예: 존재하지 않는 프로젝트 추천)

#### 3.2 프로젝트 관리
**설명**: 사용자가 청구 대상 프로젝트를 정의하고 시급 설정

**서브기능**:
- 프로젝트 생성 (이름, 시급, 설명)
- 프로젝트 편집/삭제
- 프로젝트 상태 (활성/보관)
- 프로젝트별 태그 지원 (예: "web", "consulting")

#### 3.3 시간 기록 (수동 정규 입력)
**설명**: 자연어 파싱 실패 시 또는 빠른 입력을 위해 정규 폼 제공

**서브기능**:
- 프로젝트 선택 (드롭다운)
- 날짜 선택 (캘린더 또는 상대 날짜)
- 시간 입력 (슬라이더 또는 텍스트)
- 메모/설명 추가

#### 3.4 시간 기록 목록 & 수정
**설명**: 기록된 시간을 리스트로 표시, 수정/삭제 기능

**서브기능**:
- 일자별/프로젝트별 리스트 뷰
- 각 기록의 인라인 수정 (프로젝트, 시간, 날짜, 메모)
- 일괄 삭제 (체크박스)
- Undo 기능 (최근 삭제)

#### 3.5 검색 & 필터
**설명**: 기록된 시간을 빠르게 찾음

**서브기능**:
- 프로젝트명 검색 (자동완성)
- 날짜 범위 필터 (From~To)
- 태그 필터
- 메모 텍스트 검색

#### 3.6 통계 & 대시보드
**설명**: 시간 누적을 한눈에 파악

**서브기능**:
- 주간 요약 (프로젝트별 누계)
- 월간 요약 (프로젝트별 누계)
- 프로젝트별 누적 시간 (연/월/주)
- 예상 청구액 (누적 시간 × 프로젝트 시급)

#### 3.7 청구서 생성 (청구 관리)
**설명**: 프로젝트/기간별 청구서 자동 생성

**서브기능**:
- 기간 선택 (월/기간)
- 프로젝트 선택
- 청구서 미리보기
- PDF 다운로드
- 인보이스 메타 (청구자 정보, 청구 대상, 조건)

#### 3.8 빈 상태 처리 & UX
**설명**: 사용자 경험 완성도

**서브기능**:
- 빈 화면 가이드 (첫 시간 기록 유도)
- 로딩 상태 (스켈레톤 UI)
- 에러 메시지 (명확한 한국어 가이드)
- 성공 피드백 (토스트 메시지)

---

### Should-Have (3개)

#### 3.9 CSV 내보내기
- 시간 기록 CSV 내보내기 (날짜, 프로젝트, 시간, 메모)
- 청구서 기록 내보내기

#### 3.10 핸드폰 최적화
- 모바일 UI (기록 입력 최우선)
- 터치 친화적 상호작용

#### 3.11 데이터 백업 & 복원
- 로컬 SQLite 자동 백업
- JSON 다운로드 (데이터 이동)

---

### Could-Have (2개)

#### 3.12 팀 기능 (향후 유료)
- 팀원 추가
- 팀원별 시간 기록 수집
- 팀 청구서 통합

#### 3.13 반복 기록 (템플릿)
- 매주 반복되는 기록 (예: "매주 월요일 2시간 회의")

---

### Won't-Have (범위 제외)

- AI 기반 자동 파싱 (정규식 기반만)
- 외부 결제 연동 (Stripe 등)
- 음성 입력
- 팀 협업 (MVP: 1인 전용)
- 슬랙/이메일 연동

---

## 4. 화면 설계 (7개 이상)

### 화면 1: 대시보드 (홈 화면)
**Path**: `/`  
**목적**: 오늘/이번 주 시간 요약 + 빠른 액션  
**한국어 UI 요소**:
- "이번 주 시간" (헤더)
- "프로젝트별 누계" (테이블 제목)
- "+ 시간 기록하기" (버튼)
- "이번 달 총 청구액" (요약)

### 화면 2: 텍스트 입력 (자연어 파싱)
**Path**: `/new` 또는 모달  
**목적**: 한 줄 텍스트 → 자동 파싱  
**한국어 UI 요소**:
- "시간 기록 (텍스트)" (입력 제목)
- "예: 어제 오후 2시간 디자인 회의" (플레이스홀더)
- "미리보기:" (섹션, 파싱 결과 표시)
- "저장" (버튼)

### 화면 3: 시간 입력 (폼)
**Path**: `/log`  
**목적**: 정규 폼 입력 (파싱 실패 시 폴백)  
**한국어 UI 요소**:
- "프로젝트" (드롭다운 레이블)
- "날짜" (캘린더 레이블)
- "시간" (텍스트 또는 슬라이더 레이블)
- "메모 (선택)" (텍스트 필드 레이블)
- "저장" (버튼)

### 화면 4: 시간 기록 목록
**Path**: `/logs`  
**목적**: 기록 조회 & 수정/삭제  
**한국어 UI 요소**:
- "시간 기록 목록" (제목)
- "검색 / 필터" (입력 필드 플레이스홀더)
- "날짜 | 프로젝트 | 시간 | 메모" (테이블 헤더)
- "편집" (인라인 버튼)
- "삭제" (인라인 버튼)
- "빈 상태": "기록이 없습니다. 첫 시간을 기록해보세요."

### 화면 5: 대시보드 & 통계
**Path**: `/dashboard` 또는 `/analytics`  
**목적**: 주간/월간 시간 집계, 예상 청구액  
**한국어 UI 요소**:
- "주간 요약" / "월간 요약" (탭)
- "프로젝트별 누계" (테이블 제목)
- "총 시간: 40시간" (요약)
- "예상 청구액: ₩1,200,000" (요약)
- "차트" (막대/원형 차트)

### 화면 6: 청구서 생성 & 관리
**Path**: `/invoices`  
**목적**: 청구서 생성, 다운로드, 기록  
**한국어 UI 요소**:
- "청구서" (제목)
- "새 청구서 생성" (버튼)
- "기간" (From~To 선택)
- "프로젝트" (선택)
- "미리보기" (청구서 내용)
- "PDF 다운로드" (버튼)
- "생성된 청구서 목록" (테이블)

### 화면 7: 프로젝트 관리
**Path**: `/projects`  
**목적**: 프로젝트 추가, 수정, 삭제  
**한국어 UI 요소**:
- "프로젝트" (제목)
- "+ 새 프로젝트" (버튼)
- "프로젝트명 | 시급 | 상태" (테이블 헤더)
- "편집" / "삭제" (인라인 버튼)
- "활성/보관" (상태 토글)

### 화면 8: 설정
**Path**: `/settings`  
**목적**: 사용자 정보, 청구자 정보  
**한국어 UI 요소**:
- "설정" (제목)
- "청구자 정보" (섹션)
- "이름", "이메일", "전화" (입력 필드)
- "회사명" (입력 필드)
- "기본 통화" (드롭다운)

---

## 5. 데이터 모델 (DB 스키마 초안)

### 테이블 1: Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company_name TEXT,
  currency TEXT DEFAULT 'KRW',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 테이블 2: Projects
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  hourly_rate REAL NOT NULL,
  description TEXT,
  tags TEXT, -- JSON array as string
  status TEXT DEFAULT 'active', -- 'active' | 'archived'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 테이블 3: TimeEntries
```sql
CREATE TABLE time_entries (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  date DATE NOT NULL,
  hours REAL NOT NULL, -- decimal: 2.5 = 2h 30m
  notes TEXT,
  source TEXT, -- 'manual' | 'parsed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

### 테이블 4: Invoices
```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  invoice_number TEXT UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_hours REAL,
  total_amount REAL,
  status TEXT DEFAULT 'draft', -- 'draft' | 'sent' | 'paid'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

### 테이블 5: InvoiceItems (청구 상세)
```sql
CREATE TABLE invoice_items (
  id INTEGER PRIMARY KEY,
  invoice_id INTEGER NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  hours REAL NOT NULL,
  hourly_rate REAL NOT NULL,
  amount REAL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
```

---

## 6. 비기능 요구사항

### 성능
- 페이지 로드 < 1.5초
- 시간 입력 저장 < 500ms
- 파싱 결과 표시 < 200ms

### 신뢰성
- 오프라인 모드 지원 (로컬 SQLite)
- 데이터 손실 방지 (자동 저장)
- 중복 입력 방지 (예: 같은 시간/프로젝트)

### 보안
- 로컬 데이터만 (클라우드 동기화 금지, MVP 단계)
- 클라이언트 사이드 암호화 (선택사항)

### 접근성
- 한국어 UI 100% (버튼, 레이블, 메시지 모두 한국어)
- 모바일 터치 친화적
- 키보드 네비게이션 지원

### 브라우저 호환성
- Chrome, Firefox, Safari (최신 2 버전)
- 모바일: iOS Safari, Chrome Mobile

---

## 7. Flaw Mitigations (ideas_final.json 반영)

| 위험요소 | 완화 방안 |
|---------|---------|
| **파싱 오류**: 사용자 입력 형식 다양 | 자동 수정 제안 (pattern matching). 실시간 미리보기. 정규식 기반만 (AI 아님). 직관적 형식 가이드. |
| **사용성**: Clockify 대비 80% 간단 | 텍스트-중심 UX. 자연어 입력 대우. 정규 폼 폴백. 모바일 최적화. |
| **기능 기대**: 사용자가 추가 요구 | Freemium 모델 (기본 기록 무료, 청구서/리포트는 유료). MVP 스코프 명시. |

---

## 8. 성공 지표 (Success Metrics)

- **사용성**: 첫 시간 기록 완료까지 < 2분
- **정확도**: 파싱 성공률 > 95% (일반적 패턴)
- **가치**: 월별 1회 이상 청구서 생성
- **만족도**: NPS > 50 (향후)

---

## 9. 일정 및 마일스톤

- **Sprint 0** (1주): 프로젝트 셋업, DB 구축
- **Sprint 1** (1주): 대시보드, 프로젝트 관리
- **Sprint 2** (2주): 자연어 파싱, 시간 입력
- **Sprint 3** (1주): 시간 기록 목록, 수정/삭제
- **Sprint 4** (1주): 검색/필터, 통계
- **Sprint 5** (1주): 청구서 생성, PDF 다운로드
- **Sprint 6** (1주): 마무리, QA, 배포

---

## 10. 위험 및 의존성

| 위험 | 영향도 | 완화 |
|-----|--------|------|
| Next.js 16 Drizzle 호환성 | 높음 | 초기 POC 검증 |
| 한국어 자연어 파싱 정확도 | 중간 | 정규식 테스트 케이스 충분히 작성 |
| 모바일 성능 | 중간 | 번들 크기 최적화, 로컬 데이터만 |

---

## 11. 참고: 한국어 UI 텍스트 가이드

### 일반
- "저장", "취소", "삭제", "편집", "확인", "닫기", "뒤로", "다음"
- "기록이 없습니다." (빈 상태)
- "로딩 중..." (로딩 상태)
- "오류가 발생했습니다." (에러)

### 시간 관련
- "시간 기록하기", "시간 추가", "시간 입력"
- "프로젝트", "날짜", "시간", "메모"
- "예시: 어제 오후 2시간 디자인 회의"

### 통계/청구
- "이번 주 시간", "이번 달 시간", "총 시간"
- "프로젝트별 누계"
- "예상 청구액", "청구서 생성", "PDF 다운로드"

### 피드백
- "저장되었습니다" (성공)
- "오류: 프로젝트를 선택해주세요" (에러)
- "어제 오후 2시간 디자인 회의 → [프로젝트: Design] [시간: 2h] [날짜: 2025-01-14]" (파싱 결과)

---

END OF PRD
