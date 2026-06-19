# 포트폴리오 설계 개요

## 폴더 구조

```
design/
├── indigo_professional_portfolio/
│   └── DESIGN.md                    # 디자인 시스템 문서 (색상, 타입, 레이아웃)
├── about/
│   ├── code.html                    # HTML 프로토타입
│   └── screen.png                   # 스크린샷 참조
├── _1/                              # Home 페이지
│   ├── code.html
│   └── screen.png
├── _2/                              # About 페이지 (타임라인, 경력)
│   ├── code.html
│   └── screen.png
├── _3/                              # Projects 페이지 (그리드, 카드)
│   ├── code.html
│   └── screen.png
├── _4/                              # Contact 페이지 (폼, 링크)
│   ├── code.html
│   └── screen.png
└── _5/                              # Admin Dashboard (CMS)
    ├── code.html
    └── screen.png
```

---

## 페이지별 상세 설명

### 1️⃣ `about/` — About 페이지

**경로**: `/about`

**주요 컴포넌트**:
- **Profile Section**: 프로필 사진(원형), 이름, 직급, 위치
- **Summary Card**: 소개 텍스트 (Glassmorphism 스타일)
- **Bento Grid** (3개 카드):
  1. **Career Timeline** — Google/Naver 경력 (타임라인 UI)
  2. **Contact Info** — 이메일, LinkedIn 링크
  3. **Awards & Certs** — 수상, 자격증 (다크 카드)

**Tailwind 클래스 활용**:
- Glassmorphic cards: `glass-card p-lg rounded-2xl`
- Timeline component: `.w-2 h-2 rounded-full` (점), `.w-0.5 h-full bg-outline-variant/50` (선)
- Icons: Material Symbols Outlined (24px)

**반응형**:
- Mobile: 1컬럼 스택
- Desktop: Grid로 카드 배치

---

### 2️⃣ `_1/` — Home 페이지

**경로**: `/` (또는 `/home`)

**주요 컴포넌트**:
- **Navigation Bar**: 고정 상단, 블러 백드롭
- **Hero Section**: 대형 타이틀, 부제, CTA 버튼
- **Skill Badges**: React, TypeScript, Next.js, Tailwind CSS (칩 형태)
- **CTA Buttons**: 프로젝트 보기 (Primary), 이력서 다운로드 (Secondary)
- **Gradient Blobs**: 배경 장식 요소 (절제된 애니메이션)
- **Stats Bento Grid** (3개):
  - 20+ 프로젝트 성공
  - 150% 사용자 증가
  - 40% 코드 효율 개선
- **Featured Image Section**: 큰 이미지 + 오버레이 텍스트

**디자인 특징**:
- 최소한의 여백 활용
- Hover 효과: 이미지 줌, 카드 스케일
- 부드러운 그라데이션 배경

---

### 3️⃣ `_2/` — Projects 페이지

**경로**: `/projects`

**주요 컴포넌트**:
- **Hero Title**: 섹션 소개
- **Project Cards Grid** (카드 기반):
  - 이미지 (상단)
  - 프로젝트 제목 / 설명
  - 기술 스택 (칩 태그)
  - View/GitHub 링크 버튼
  - Hover 효과: 그림자 강조, 스케일 애니메이션

**레이아웃**:
- Desktop: 3컬럼
- Tablet: 2컬럼
- Mobile: 1컬럼

**색상 사용**:
- 카드: white background (surface-container-lowest)
- 테두리: 1px solid outline-variant/20
- 아이콘: primary 색상

---

### 4️⃣ `_4/` — Contact 페이지

**경로**: `/contact`

**주요 컴포넌트**:
- **Contact Form**:
  - Name (text input)
  - Email (email input)
  - Subject (text input)
  - Message (textarea)
  - Submit button (Primary)
- **Form Validation**: 클라이언트 + 서버 검증
- **Success Message**: 전송 후 피드백

**스타일**:
- Input: bg-surface-container, focus:border-primary
- Labels: font-label-sm
- Button: bg-primary, hover:scale-105

---

### 5️⃣ `_5/` — Admin Dashboard

**경로**: `/admin` (로그인 필요)

**주요 컴포넌트**:
- **Login Form** (초기 화면):
  - 이메일 / 비밀번호 입력
  - 로그인 버튼
- **Dashboard** (인증 후):
  - Sidebar 네비게이션 (Projects, Posts, Settings)
  - Main Content Area:
    - 프로젝트 관리 테이블 (CRUD)
    - 포스트 에디터
    - 설정 폼

**기능**:
- CRUD 작업 (프로젝트, 포스트)
- Rich Text Editor (선택)
- 이미지 업로드

---

## 디자인 시스템 참조

**Color Palette**:
```
Primary:    #00236f (Deep Indigo)
Secondary:  #505f76 (Slate Gray)
Surface:    #faf8ff (Background)
On-Surface: #1a1b21 (Text)
Error:      #ba1a1a (Alert)
```

**Typography** (Inter):
```
Display Large:   48px / 700 weight (desktop)
Display Mobile:  32px / 700 weight (mobile)
Headline MD:     30px / 600 weight
Title Large:     20px / 600 weight
Body MD:         16px / 400 weight (1.6 line-height)
Label SM:        14px / 500 weight
```

**Spacing** (8px grid):
```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  40px
2xl: 64px
```

**Border Radius**:
```
default: 0.25rem (4px)
lg:      0.5rem (8px)
xl:      0.75rem (12px)
full:    9999px (pill shape)
```

---

## 개발 가이드

### HTML → React 변환 체크리스트

1. **Tailwind 클래스 유지**
   - 모든 `class="..."` 을 `className="..."` 로 변환
   - 색상 변수명 그대로 사용 (`bg-primary`, `text-secondary`)

2. **컴포넌트화**
   ```typescript
   // 재사용 가능한 부분을 컴포넌트로 분리
   <Card className="glass-card p-lg rounded-2xl">
   <Button variant="primary">Click</Button>
   <Badge>React</Badge>
   ```

3. **상호작용 추가**
   - useState로 상태 관리
   - onClick 이벤트 핸들러
   - Transitions (Framer Motion 선택, 아니면 CSS만)

4. **이미지 최적화**
   - `<img>` → `<Image>` (Next.js) 또는 `<img loading="lazy">`
   - Responsive images (`srcSet`)

5. **Form 검증** (Contact 페이지)
   ```typescript
   const [errors, setErrors] = useState({});
   const handleSubmit = (e) => {
     e.preventDefault();
     // 검증 로직
     if (!email.includes('@')) setErrors({email: 'Invalid'});
   };
   ```

### 색상 일관성 유지

**금지 사항**:
```typescript
// ❌ 하드코딩된 색상
<div className="bg-[#00236f]">
<div style={{color: '#505f76'}}>

// ✅ 디자인 시스템 색상 사용
<div className="bg-primary">
<div className="text-secondary">
```

### 반응형 설계 체크리스트

```html
<!-- 모든 섹션에 적용 -->
<div class="px-gutter max-w-container-max mx-auto">
  <!-- 컨테이너 제한 + 중앙 정렬 + 패딩 -->
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
    <!-- 모바일 1컬럼, 태블릿 2컬럼, 데스크톱 3컬럼 -->
  </div>
</div>
```

---

## 개발 순서 (권장)

1. **프로젝트 초기화**
   ```bash
   npm create vite@latest portfolio -- --template react-ts
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Tailwind 설정** (design/DESIGN.md 참조)
   ```typescript
   // tailwind.config.ts
   colors: {
     primary: '#00236f',
     secondary: '#505f76',
     // ... 나머지 색상
   }
   ```

3. **Layout 컴포넌트** (공통)
   - `<Header>` (고정 네비게이션)
   - `<Footer>` (하단)
   - `<Container>` (1200px 최대 너비)

4. **페이지 순서**
   - Home (_1) → About (_2) → Projects (_3) → Contact (_4)
   - Admin (_5) 마지막 (인증 로직 필요)

5. **스크린샷 검증** (각 페이지마다)
   ```bash
   playwright screenshot "pages/**/*.spec.ts" --update
   ```

---

## 참고 자료

- **전체 설계**: `design/indigo_professional_portfolio/DESIGN.md`
- **색상 시스템**: 위 문서 내 "Colors" 섹션
- **타이포그래피**: 위 문서 내 "Typography" 섹션
- **레이아웃**: 위 문서 내 "Layout & Spacing" 섹션
- **컴포넌트**: 위 문서 내 "Components" 섹션

---

**마지막 업데이트**: 2026-06-19 | **작성**: Claude
