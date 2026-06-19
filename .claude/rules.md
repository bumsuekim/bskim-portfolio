# 포트폴리오 프로젝트 규칙

## Karpathy 4원칙

### 1. 가정 명시 (Explicit Assumptions)
모든 암묵적 가정을 코드에 드러낼 것.

**나쁜 예**:
```typescript
const getUser = async (id) => db.query(`SELECT * FROM users WHERE id = ?`, [id]);
```

**좋은 예**:
```typescript
// 사용자 ID는 양수만 유효 (admin 제외)
const getUser = async (id: number) => {
  if (id <= 0) throw new Error("Invalid user ID");
  return db.query(`SELECT * FROM users WHERE id = ?`, [id]);
};
```

---

### 2. 단순함 (Simplicity First)
복잡성은 필요할 때만 추가할 것. Over-engineering 금지.

**금지**:
- 쓸 수 없는 기능 구현 (hypothetical future requirements)
- 불필요한 인터페이스/추상화 계층
- 3줄 미만 중복 (3줄 이상일 때만 헬퍼 함수 작성)

**허용**:
- 단순한 if-else 체인
- 인라인 로직
- 직접 구현 (과도한 라이브러리 사용 지양)

---

### 3. 외과적 수정 (Surgical Edits)
핵심만 건드려서 부작용을 최소화할 것.

**나쁜 예**:
```bash
# 한 줄 수정을 위해 전체 파일 포맷팅
git diff (여러 줄 변경)
```

**좋은 예**:
```bash
# 필요한 부분만 변경
git diff (1-3줄만 변경)
```

---

### 4. 검증 루프 (Verification Loop)
모든 변경마다 테스트를 실행할 것.

**필수 검증**:
- Unit Test (pytest / Vitest)
- Integration Test (API 엔드포인트)
- Visual Check (Playwright 스크린샷)
- Build Check (Vite / pip)

---

## 코딩 규칙

### 주석 및 문서화
```typescript
// ✅ GOOD: WHY가 명확한 경우
// 캐시 TTL은 5분 (세션 토큰 갱신 주기)
const CACHE_TTL = 300;

// ❌ BAD: WHAT을 설명하는 주석
// 캐시 TTL 초 단위 설정
const CACHE_TTL = 300;
```

**규칙**: 
- 다중 라인 주석/docstring 금지
- 한 줄 주석만 허용 (WHY가 명확할 때만)
- 코드가 WHAT을 충분히 설명하면 주석 불필요

---

### 에러 처리
```typescript
// ✅ GOOD: 시스템 경계에서만 검증
app.post("/projects", (req) => {
  const { title, description } = req.body;
  if (!title) throw new ValidationError("title is required");
  // 내부 함수는 유효한 입력을 가정
  return createProject(title, description);
});

// ❌ BAD: 모든 곳에 방어 코드
function getProjectById(id) {
  if (!id) throw new Error("id required");
  if (typeof id !== 'number') throw new Error("id must be number");
  // ... 과도한 검증
}
```

**규칙**:
- User Input / External API: 엄격한 검증
- Internal Functions: 프리콘디션 가정 (계약 기반 설계)

---

### 역호환성
```typescript
// ❌ NO: 역호환성 지원
-function getUser(id) { ... }
+function getUser(id) { ... } // renamed from fetchUser
+const fetchUser = getUser; // deprecated alias

// ✅ YES: 그냥 수정
-function getUser(id) { ... }
+function getUserById(id) { ... }
```

**규칙**: 역호환성 지원 금지. 필요하면 그냥 전체 수정.

---

### 추상화 수준
```typescript
// ❌ 과도한 추상화 (3줄 미만)
const createValidator = (field, rule) => (value) => !rule.test(value) ? `Invalid ${field}` : null;

// ✅ 충분한 반복일 때만 함수화 (3줄 이상)
const validateEmail = (email) => !EMAIL_REGEX.test(email) ? "Invalid email" : null;
const validateUrl = (url) => !URL_REGEX.test(url) ? "Invalid URL" : null;
const validatePhone = (phone) => !PHONE_REGEX.test(phone) ? "Invalid phone" : null;

// → 이제 헬퍼 생성
const createRegexValidator = (regex, field) => (value) => !regex.test(value) ? `Invalid ${field}` : null;
```

---

## 디자인 시스템 준수

### Tailwind 클래스 규칙
모든 색상/간격/타이포는 `design/indigo_professional_portfolio/DESIGN.md`를 따를 것.

```typescript
// ✅ GOOD: 디자인 시스템 변수 사용
<button className="bg-primary text-on-primary px-md py-xs rounded-lg">
  Click me
</button>

// ❌ BAD: 임의 값 사용
<button className="bg-blue-500 px-4 py-2 rounded-8px">
  Click me
</button>
```

**허용하는 임의 값**:
- 애니메이션/트랜지션 (정의되지 않은 경우만)
- 조건부 클래스 (opacity, display 같은 수정자)

---

### 색상 팔레트
```typescript
// Primary (심각한 액션)
bg-primary, text-primary, border-primary

// Secondary (메타 정보)
text-secondary, text-on-surface-variant

// Status (Success, Warning, Error)
- Error: text-error, bg-error-container
- (Success/Warning은 아직 정의되지 않음)
```

---

### 타이포그래피
```typescript
// Display (메인 타이틀)
<h1 className="font-display-lg text-display-lg"> ... </h1>
<h1 className="font-display-lg-mobile text-display-lg-mobile"> ... </h1> {/* 모바일 */}

// Headline (섹션 제목)
<h2 className="font-headline-md text-headline-md"> ... </h2>

// Title (카드 제목)
<h3 className="font-title-lg text-title-lg"> ... </h3>

// Body (본문)
<p className="font-body-md text-body-md"> ... </p>

// Label (태그, 버튼)
<span className="font-label-sm text-label-sm"> ... </span>
```

---

### 반응형 설계
```html
<!-- 모바일: 4컬럼, 좌우 마진 20px -->
<!-- 태블릿: 8컬럼, 좌우 마진 40px -->
<!-- 데스크톱: 12컬럼, 좌우 마진 64px -->

<div class="px-gutter max-w-container-max mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
    <!-- 컨텐츠 -->
  </div>
</div>
```

---

## 테스트 규칙

### TDD: 테스트 먼저 작성
```python
# 1️⃣ 테스트 작성
def test_get_projects():
    response = client.get("/api/projects")
    assert response.status_code == 200
    assert len(response.json()) >= 0

# 2️⃣ 구현
@app.get("/api/projects")
def get_projects():
    return [...]
```

### 화면 점검: Playwright
```typescript
// 페이지 로드 후 스크린샷
test("About 페이지 렌더링", async ({ page }) => {
  await page.goto("/about");
  await page.screenshot({ path: "screenshots/about.png" });
  
  // 디자인 일치 검증
  expect(await page.locator("h1")).toContainText("경력");
});
```

---

## 데이터베이스 규칙

### SQLAlchemy 모델 정의
```python
# ✅ GOOD: 명확한 타입
class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

# ❌ BAD: 암묵적 타입
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    title = Column(String)
```

### Alembic 마이그레이션
```bash
# 1️⃣ 모델 수정
# → models.py 변경

# 2️⃣ 마이그레이션 자동 생성
alembic revision --autogenerate -m "add project_description"

# 3️⃣ 적용
alembic upgrade head
```

---

## Git 커밋 메시지

```
<type>(<scope>): <subject>

<body>

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Type**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
**Scope**: `frontend`, `backend`, `db`, `design`
**Subject**: 소문자, 마침표 없음 (명령조)

**예**:
```
feat(frontend): add about page hero section

- 경력 타임라인 컴포넌트 추가
- Glassmorphism 카드 디자인 적용
- 반응형 레이아웃 테스트 완료

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

**마지막 업데이트**: 2026-06-19
