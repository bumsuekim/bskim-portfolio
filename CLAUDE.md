# 포트폴리오 풀스택 웹앱 개발 가이드

## 프로젝트 개요

**1인 포트폴리오 웹앱** — 전문성과 기술력을 보여주는 개인 포트폴리오 플랫폼

**설계**: `design/` 폴더의 Google Stitch 프로토타입 (HTML+Tailwind)
- **페이지**: Home(_1), About(_2), Projects(_3), Contact(_4), Admin(_5)
- **색상 시스템**: Indigo Professional (Primary: #00236f, Secondary: #505f76)
- **타이포그래피**: Inter 폰트, 8px 그리드 시스템 (1200px 컨테이너)

## 기술 스택

| 계층 | 프레임워크 | 배포 | DB |
|------|----------|------|-----|
| **프론트엔드** | TypeScript + React (Vite) | Vercel | - |
| **백엔드** | Python FastAPI | Railway | SQLite (dev) / PostgreSQL (prod) |
| **ORM** | SQLAlchemy (양립) | - | - |

## 개발 원칙

**Karpathy 4원칙**:
1. **가정 명시** — 암묵적 가정을 코드에 드러낼 것
2. **단순함** — 복잡성은 필요할 때만 (over-engineering 지양)
3. **외과적 수정** — 핵심만 건드려 부작용 최소화
4. **검증 루프** — 변경마다 테스트 실행

**언어 규칙**:
- 모든 답변은 **한국어**
- 라이브러리 문법 확인: Context7 참조
- 화면 점검: Playwright (자동화 테스트)
- 기능 검증: TDD (테스트 먼저 작성)

## 프로젝트 규칙

- **주석**: WHY가 명확할 때만 (WHAT은 코드가 말함)
- **역호환**: 지원하지 않음 (필요하면 그냥 수정)
- **에러 처리**: 시스템 경계(사용자 입력, 외부 API)에서만
- **추상화**: 3줄 이상 중복일 때만 (과도한 설계 금지)
- **마이그레이션**: SQLAlchemy로 dev/prod 환경 양립

## 디자인 시스템 (design/indigo_professional_portfolio/DESIGN.md)

### 색상 팔레트
- **Primary**: #00236f (Deep Indigo) — 메인 액션
- **Secondary**: #505f76 (Slate Gray) — 메타 정보
- **Surface**: #faf8ff (Slate-50) — 배경
- **Error**: #ba1a1a (Red) — 경고

### 타이포그래피 (Inter)
- `display-lg`: 48px / 700 weight (데스크톱)
- `headline-md`: 30px / 600 weight
- `title-lg`: 20px / 600 weight (카드 제목)
- `body-md`: 16px / 400 weight (1.6 line-height)
- `label-sm`: 14px / 500 weight

### 레이아웃
- **Container**: max-width 1200px
- **Spacing**: 8px 기본 단위 (xs=4px, sm=8px, md=16px, lg=24px, xl=40px)
- **Responsive**: Desktop(1024px+) → Tablet(768-1023px) → Mobile(<767px)

## 페이지 구성

| 경로 | 설명 | 상태 |
|------|------|------|
| `/` | Home — 프로필, 스킬, 상점 (_1) | 설계 완료 |
| `/about` | About — 경력, 수상, 연락처 (_2) | 설계 완료 |
| `/projects` | Projects — 포트폴리오 카드 그리드 (_3) | 설계 완료 |
| `/contact` | Contact — 연락 양식 (_4) | 설계 완료 |
| `/admin` | Admin — 콘텐츠 관리 (_5) | 설계 완료 |

## 개발 체크리스트

### Phase 1: 기초 구축
- [ ] Vite + React 프로젝트 초기화
- [ ] Tailwind CSS + design/DESIGN.md 색상/타이포 통합
- [ ] FastAPI 백엔드 스켈레톤
- [ ] SQLAlchemy 설정 (SQLite ↔ PostgreSQL)

### Phase 2: 핵심 기능
- [ ] 프론트엔드: 5개 페이지 마크업 (design/ 참조)
- [ ] 백엔드: API 엔드포인트 (CRUD)
- [ ] 데이터베이스: 스키마 정의
- [ ] 인증: Admin 페이지 보호

### Phase 3: 배포
- [ ] Vercel 연동 (프론트엔드)
- [ ] Railway 연동 (백엔드)
- [ ] 환경 변수 관리 (dev vs. prod)
- [ ] 성능 최적화

## 빠른 참조

**프론트엔드 시작**:
```bash
npm create vite@latest portfolio -- --template react-ts
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

**백엔드 시작**:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary
uvicorn main:app --reload
```

**DB 마이그레이션**:
```bash
# Alembic 초기화 및 마이그레이션
alembic init alembic
alembic revision --autogenerate -m "init"
alembic upgrade head
```

---

**마지막 수정**: 2026-06-19 | **Owner**: bskim@landsoft.co.kr
