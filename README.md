# bskim-portfolio

> 1인 풀스택 포트폴리오 웹앱 — FastAPI 백엔드 + 정적 프론트엔드

---

## 🔗 라이브 데모

| | URL |
|---|---|
| **프론트엔드 (Vercel)** | **[https://bskim-portfolio.vercel.app](https://bskim-portfolio.vercel.app)** |
| **백엔드 API (Railway)** | **[https://bskim-api-production.up.railway.app](https://bskim-api-production.up.railway.app)** |
| API 문서 (Swagger) | [https://bskim-api-production.up.railway.app/docs](https://bskim-api-production.up.railway.app/docs) |

---

## 프로젝트 소개

개인 포트폴리오를 공개하고 관리하기 위한 풀스택 웹앱입니다.

- **방문자**는 소개·프로젝트·연락처를 열람하고 메시지를 보낼 수 있습니다.
- **관리자**는 로그인 후 프로젝트를 추가·삭제하고 비밀번호를 변경할 수 있습니다.

---

## 기술 스택

| 레이어 | 기술 |
|---|---|
| 프론트엔드 | Vanilla JS · Tailwind CSS (CDN) · 정적 SPA |
| 백엔드 | Python 3.11 · FastAPI · SQLAlchemy 2.0 · Pydantic v2 |
| 인증 | JWT (python-jose) · bcrypt (passlib) |
| DB | SQLite (로컬 개발) / PostgreSQL (Railway 프로덕션) |
| 배포 | Vercel (프론트) · Railway (백엔드 + PostgreSQL) |
| 테스트 | Playwright (E2E, 배포 환경 대상) |

---

## 로컬 실행

### 백엔드

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# → Swagger: http://localhost:8000/docs
```

초기 관리자 계정은 서버 첫 기동 시 자동 생성됩니다: `admin` / `admin1234`  
**운영 환경에서는 반드시 비밀번호를 변경하세요.**

환경변수 (`.env` 또는 셸):

```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./portfolio.db   # PostgreSQL이면 postgresql://...
```

### 프론트엔드

빌드 단계 없음. `web/` 폴더를 아무 정적 서버로 서빙하면 됩니다.

```bash
cd web
python -m http.server 3000
# → http://localhost:3000
```

로컬 백엔드를 바라보려면 `web/config.js`의 `API_URL`을 `http://localhost:8000`으로 변경하세요.

### E2E 테스트 (배포 환경 대상)

```bash
pip install playwright
playwright install chromium
python tests/test_live_e2e.py
```

---

## 주요 기능

### 사용자 입장

- **Home**: 프로필 소개
- **Projects**: 포트폴리오 프로젝트 갤러리 (백엔드 API 연동)
- **Contact**: 연락처 메시지 전송 (CORS POST → Railway 저장)

### 관리자 입장

- `/admin` 탭 → 로그인
- **비밀번호 변경**: 로그인 직후 기본 탭
- **프로젝트 관리**: 추가(제목·설명·기술스택·링크) / 삭제
- 로그아웃

---

## API 엔드포인트

### 공개

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/projects` | 프로젝트 목록 |
| POST | `/contact` | 연락처 메시지 전송 |

### 관리자 (JWT 필요)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/admin/login` | 로그인 → access_token 반환 |
| POST | `/admin/change-password` | 비밀번호 변경 |
| POST | `/projects` | 프로젝트 추가 |
| DELETE | `/projects/{id}` | 프로젝트 삭제 |

---

## 프로젝트 구조

```
bskim-portfolio/
├── backend/          # FastAPI 앱
│   ├── main.py       # 라우터·미들웨어·시드
│   ├── models.py     # SQLAlchemy 모델
│   ├── schemas.py    # Pydantic 스키마
│   ├── security.py   # JWT 인증 (SECRET_KEY는 환경변수)
│   ├── database.py   # DB 연결 (SQLite↔PostgreSQL 자동 전환)
│   └── requirements.txt
├── web/              # 정적 프론트엔드 (Vercel 배포 소스)
│   ├── index.html
│   ├── app.js        # 단일 SPA 로직
│   ├── config.js     # 런타임 API URL 주입
│   └── vercel.json
├── tests/
│   ├── test_live_e2e.py         # Playwright E2E (11개 시나리오)
│   ├── test_live_backend.py     # API 스모크 테스트
│   └── cleanup_test_projects.py
└── design/           # Google Stitch 설계 원본 (HTML+Tailwind)
```

---

## 디자인 시스템 (Indigo Professional)

```
Primary:   #00236f  Deep Indigo
Secondary: #505f76  Slate Gray
Surface:   #faf8ff  배경
```

Inter 폰트 · 8px 그리드 · 1200px 컨테이너 · Glassmorphism 카드

---

## 재배포

```bash
# 백엔드 (backend/ 에서)
railway up --service bskim-api

# 프론트엔드
vercel deploy --prod --yes --project bskim-portfolio --cwd web
```
