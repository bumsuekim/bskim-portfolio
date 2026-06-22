const API_URL = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || 'http://localhost:8000';
let currentPage = 'home';
let isLoggedIn = false;
let adminName = null;
let authToken = null;
let adminTab = 'password';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    const name  = localStorage.getItem('admin_name');
    if (token) { isLoggedIn = true; adminName = name; authToken = token; }
    render();
});

function nav(page) { currentPage = page; render(); window.scrollTo(0, 0); }

function render() { updateHeader(); renderPage(); }

function updateHeader() {
    ['home','projects','about'].forEach(p => {
        const el = document.getElementById('nav-' + p);
        if (!el) return;
        el.classList.toggle('active', currentPage === p);
    });
    const ab = document.getElementById('authButtons');
    if (isLoggedIn) {
        ab.innerHTML = `
            <div class="flex items-center gap-3">
                <button onclick="nav('admin')" class="btn-outline text-sm px-4 py-1.5">Dashboard</button>
                <button onclick="logout()" class="text-sm nav-link">Logout</button>
            </div>`;
    } else {
        ab.innerHTML = `
            <div class="flex items-center gap-3">
                <button onclick="nav('admin')" class="nav-link text-sm">Admin</button>
                <button onclick="nav('contact')" class="btn-primary text-sm px-5 py-2">Hire Me</button>
            </div>`;
    }
}

function renderPage() {
    const content = document.getElementById('content');
    if (currentPage === 'home') {
        content.innerHTML = pageHome();
        loadHomeFeatured();
    } else if (currentPage === 'projects') {
        content.innerHTML = wrap(pageProjects());
        loadProjects();
    } else if (currentPage === 'about') {
        content.innerHTML = wrap(pageAbout());
    } else if (currentPage === 'contact') {
        content.innerHTML = wrap(pageContact());
    } else if (currentPage === 'admin') {
        content.innerHTML = wrap(isLoggedIn ? pageAdminDashboard() : pageAdminLogin());
        if (isLoggedIn) loadAdminProjects();
    }
}

function wrap(html) {
    return `<div class="px-6 max-w-6xl mx-auto py-12">${html}</div>`;
}

// ═══════════════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════════════
function pageHome() {
    return `
    <!-- HERO -->
    <section class="hero-bg grid-pattern w-full" style="min-height:88vh; display:flex; align-items:center;">
        <div class="px-6 max-w-6xl mx-auto w-full py-24">
            <div class="flex items-center gap-2 mb-6">
                <span class="pulse-dot w-2 h-2 rounded-full" style="background:var(--success);"></span>
                <span class="text-sm mono" style="color:var(--text-muted);">Available for AI Transformation Projects</span>
            </div>

            <div class="badge mb-6">Java 엔터프라이즈 · AI 전환 전문가</div>

            <p class="text-xl md:text-2xl font-medium mb-3" style="color:var(--text-muted);">안녕하세요,</p>
            <h1 class="font-extrabold leading-tight mb-6" style="font-size: clamp(3rem, 8vw, 5.5rem);">
                <span style="background: linear-gradient(135deg, #e2e8f0 30%, #38bdf8 70%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">김범수</span>
                <span style="color:var(--text);">입니다</span>
            </h1>

            <p class="text-lg leading-relaxed mb-10 max-w-2xl" style="color:var(--text-muted);">
                <span style="color:var(--primary);">Java/Spring</span> 기반 엔터프라이즈 개발 경험과
                <span style="color:var(--secondary);">LLM · RAG · FastAPI</span> 기반 AI 전환 역량을 모두 갖춘
                풀스택 개발자입니다.<br>
                레거시 시스템의 AI 현대화부터 신규 AI 서비스 구축까지 전 주기를 담당합니다.
            </p>

            <div class="flex flex-wrap gap-3 mb-12">
                ${['Java / Spring Boot','Python / FastAPI','LLM / RAG','SQLAlchemy','PostgreSQL','Docker','Railway · Vercel']
                    .map(t => `<span class="tag">${t}</span>`).join('')}
            </div>

            <div class="flex flex-wrap gap-4">
                <button onclick="nav('projects')" class="btn-primary text-base">프로젝트 보기 →</button>
                <button onclick="nav('about')" class="btn-outline text-base">소개 보기</button>
            </div>
        </div>
    </section>

    <!-- STATS -->
    <section style="background:var(--bg-surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
        <div class="px-6 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
            ${[
                {n:'7년+',  l:'개발 경력'},
                {n:'20+',   l:'엔터프라이즈 프로젝트'},
                {n:'5+',    l:'AI 전환 프로젝트'},
                {n:'99%',   l:'배포 성공률'},
            ].map(s => `
            <div class="py-10 px-4 text-center" style="border-right:1px solid var(--border);">
                <div class="stat-num">${s.n}</div>
                <p class="text-sm mt-1" style="color:var(--text-muted);">${s.l}</p>
            </div>`).join('')}
        </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section class="px-6 max-w-6xl mx-auto py-20">
        <div class="flex justify-between items-end mb-10">
            <div>
                <p class="mono text-xs mb-2" style="color:var(--primary);">// SELECTED WORK</p>
                <h2 class="text-3xl font-bold">주요 프로젝트</h2>
                <p class="text-sm mt-2" style="color:var(--text-muted);">Java 엔터프라이즈 · AI 전환 · 풀스택 대표 사례</p>
            </div>
            <button onclick="nav('projects')" class="text-sm flex items-center gap-1 hover:text-sky-400 transition-colors" style="color:var(--primary);">전체 보기 →</button>
        </div>
        <div id="homeFeatured" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${[1,2,3].map(() => `<div class="card p-6 animate-pulse"><div class="h-4 rounded mb-3" style="background:var(--border)"></div><div class="h-3 rounded" style="background:var(--border)"></div></div>`).join('')}
        </div>
    </section>`;
}

async function loadHomeFeatured() {
    try {
        const resp = await fetch(`${API_URL}/projects`);
        const projects = await resp.json();
        const el = document.getElementById('homeFeatured');
        if (!el) return;
        const top = projects.slice(0, 3);
        if (!top.length) {
            el.innerHTML = `<p class="col-span-3 text-center py-12" style="color:var(--text-muted);">아직 등록된 프로젝트가 없습니다.</p>`;
            return;
        }
        el.innerHTML = top.map(p => projectCard(p, true)).join('');
    } catch { /* 무시 */ }
}

// ═══════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════
function pageProjects() {
    return `
        <div class="mb-10">
            <p class="mono text-xs mb-2" style="color:var(--primary);">// ALL PROJECTS</p>
            <h1 class="text-3xl font-bold mb-2">프로젝트</h1>
            <p style="color:var(--text-muted);">Java 엔터프라이즈부터 AI 전환까지 — 실전 프로젝트 포트폴리오</p>
        </div>
        <div id="projectsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${[1,2,3,4,5,6].map(() => `<div class="card p-6 animate-pulse"><div class="h-4 rounded mb-3" style="background:var(--border)"></div><div class="h-3 rounded" style="background:var(--border)"></div></div>`).join('')}
        </div>`;
}

function projectCard(p, compact = false) {
    const tags = p.technologies.split(',').slice(0, compact ? 3 : 5);
    return `
    <div class="card p-6 flex flex-col gap-4" style="cursor:default;">
        <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-base leading-snug" style="color:var(--text);">${p.title}</h3>
            ${p.link ? `<a href="${p.link}" target="_blank" style="color:var(--primary); flex-shrink:0;" title="링크">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>` : ''}
        </div>
        <p class="text-sm leading-relaxed flex-1" style="color:var(--text-muted);">${p.description}</p>
        <div class="flex flex-wrap gap-1.5">
            ${tags.map(t => `<span class="tag">${t.trim()}</span>`).join('')}
        </div>
    </div>`;
}

async function loadProjects() {
    try {
        const resp = await fetch(`${API_URL}/projects`);
        const projects = await resp.json();
        const el = document.getElementById('projectsList');
        if (!el) return;
        el.innerHTML = projects.length
            ? projects.map(p => projectCard(p)).join('')
            : `<p class="col-span-3 text-center py-12" style="color:var(--text-muted);">프로젝트가 없습니다.</p>`;
    } catch {
        const el = document.getElementById('projectsList');
        if (el) el.innerHTML = `<p style="color:var(--text-muted);">로드 실패</p>`;
    }
}

// ═══════════════════════════════════════════════════════
//  ABOUT
// ═══════════════════════════════════════════════════════
function pageAbout() {
    const skills = [
        { cat: 'Language',  items: ['Java 8~21', 'Python 3.11', 'TypeScript', 'SQL'] },
        { cat: 'Backend',   items: ['Spring Boot', 'FastAPI', 'SQLAlchemy', 'Pydantic', 'JWT'] },
        { cat: 'AI / ML',   items: ['LangChain', 'RAG Pipeline', 'OpenAI API', 'HuggingFace', 'Prompt Engineering'] },
        { cat: 'Frontend',  items: ['Vanilla JS', 'React', 'Tailwind CSS'] },
        { cat: 'Infra / DB',items: ['Railway', 'Vercel', 'PostgreSQL', 'SQLite', 'Docker', 'GitHub Actions'] },
        { cat: 'Testing',   items: ['Playwright E2E', 'JUnit', 'pytest'] },
    ];
    const career = [
        { company: 'Landsoft', role: 'Senior Developer · AI 전환 리드', period: '2020 — 현재', highlight: true },
        { company: 'SI 프로젝트 (공공/금융)', role: 'Java 엔터프라이즈 개발', period: '2018 — 2020', highlight: false },
        { company: '전자정부 프레임워크 기반 프로젝트', role: 'Full-stack Developer', period: '2016 — 2018', highlight: false },
    ];
    return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- LEFT: 프로필 -->
        <div class="flex flex-col gap-6">
            <div class="card p-8 text-center">
                <div class="w-24 h-24 mx-auto mb-5 rounded-2xl flex items-center justify-center text-3xl font-extrabold"
                     style="background:linear-gradient(135deg,#0ea5e9,#6366f1); color:white;">BS</div>
                <h1 class="text-2xl font-extrabold mb-1">김범수</h1>
                <p class="text-sm font-semibold mb-3" style="color:var(--primary);">Java 엔터프라이즈 · AI 전환 개발자</p>
                <div class="flex items-center justify-center gap-2 text-xs" style="color:var(--text-muted);">
                    <span class="pulse-dot w-2 h-2 rounded-full" style="background:var(--success);"></span>
                    Available for Projects
                </div>
            </div>

            <div class="card p-6">
                <h3 class="text-sm font-bold mb-4 mono" style="color:var(--primary);">// CONTACT</h3>
                <div class="space-y-3">
                    <a href="mailto:bskim@landsoft.co.kr" class="flex items-center gap-3 text-sm transition-colors hover:text-sky-400" style="color:var(--text-muted);">
                        <span style="color:var(--primary);">✉</span> bskim@landsoft.co.kr
                    </a>
                    <a href="https://github.com/bumsuekim" target="_blank" class="flex items-center gap-3 text-sm transition-colors hover:text-sky-400" style="color:var(--text-muted);">
                        <span style="color:var(--primary);">⌥</span> github.com/bumsuekim
                    </a>
                </div>
            </div>

            <div class="card p-6" style="background:linear-gradient(135deg,rgba(14,165,233,0.1),rgba(99,102,241,0.1));">
                <h3 class="text-sm font-bold mb-3 mono" style="color:var(--primary);">// SPECIALITY</h3>
                <ul class="space-y-2 text-sm" style="color:var(--text-muted);">
                    <li class="flex items-start gap-2"><span style="color:var(--success);">▸</span> Java 레거시 → Python/AI 전환</li>
                    <li class="flex items-start gap-2"><span style="color:var(--success);">▸</span> LLM 기반 RAG 시스템 구축</li>
                    <li class="flex items-start gap-2"><span style="color:var(--success);">▸</span> 전자정부/공공 SI 개발</li>
                    <li class="flex items-start gap-2"><span style="color:var(--success);">▸</span> FastAPI + PostgreSQL 서비스 배포</li>
                </ul>
            </div>
        </div>

        <!-- RIGHT: 경력 + 기술 -->
        <div class="md:col-span-2 flex flex-col gap-6">

            <div class="card p-6">
                <h3 class="text-sm font-bold mb-5 mono" style="color:var(--primary);">// CAREER</h3>
                <div class="space-y-5">
                    ${career.map(c => `
                    <div class="flex gap-4">
                        <div class="flex flex-col items-center pt-1">
                            <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${c.highlight ? 'var(--primary)' : 'var(--border)'};"></div>
                            <div class="w-px flex-1 mt-1" style="background:var(--border); min-height:24px;"></div>
                        </div>
                        <div class="pb-4">
                            <p class="font-bold text-sm ${c.highlight ? '' : ''}" style="color:${c.highlight ? 'var(--primary)' : 'var(--text)'};">${c.company}</p>
                            <p class="text-sm" style="color:var(--text-muted);">${c.role}</p>
                            <p class="text-xs mt-0.5 mono" style="color:var(--text-muted);">${c.period}</p>
                        </div>
                    </div>`).join('')}
                </div>
            </div>

            <div class="card p-6">
                <h3 class="text-sm font-bold mb-5 mono" style="color:var(--primary);">// TECH STACK</h3>
                <div class="space-y-4">
                    ${skills.map(s => `
                    <div>
                        <p class="text-xs font-semibold mb-2 uppercase tracking-wider" style="color:var(--text-muted);">${s.cat}</p>
                        <div class="flex flex-wrap gap-2">
                            ${s.items.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>`).join('')}
                </div>
            </div>

        </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════
//  CONTACT
// ═══════════════════════════════════════════════════════
function pageContact() {
    return `
    <div class="max-w-2xl mx-auto">
        <p class="mono text-xs mb-2" style="color:var(--primary);">// CONTACT</p>
        <h1 class="text-3xl font-bold mb-2">연락하기</h1>
        <p class="mb-8" style="color:var(--text-muted);">프로젝트 의뢰, AI 전환 컨설팅, 협업 제안은 언제든 환영합니다.</p>

        <div id="contactResult" class="mb-4"></div>

        <form onsubmit="handleContactSubmit(event)" class="card p-8 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">이름</label>
                    <input type="text" id="contactName" required placeholder="홍길동" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">이메일</label>
                    <input type="email" id="contactEmail" required placeholder="you@example.com" class="input-field">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">제목</label>
                <input type="text" id="contactSubject" required placeholder="AI 전환 프로젝트 문의" class="input-field">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">메시지</label>
                <textarea id="contactMessage" rows="5" required placeholder="프로젝트 내용을 자유롭게 작성해 주세요." class="input-field" style="resize:vertical;"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full text-center text-base py-3">보내기</button>
        </form>
    </div>`;
}

// ═══════════════════════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════════════════════
function pageAdminLogin() {
    return `
    <div class="max-w-md mx-auto">
        <p class="mono text-xs mb-2" style="color:var(--primary);">// ADMIN</p>
        <h1 class="text-2xl font-bold mb-8">관리자 로그인</h1>
        <div id="loginError" class="mb-4"></div>
        <form onsubmit="handleLogin(event)" class="card p-8 space-y-5">
            <div>
                <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">사용자명</label>
                <input type="text" id="username" placeholder="admin" required class="input-field">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">비밀번호</label>
                <input type="password" id="password" placeholder="••••••••" required class="input-field">
            </div>
            <button type="submit" class="btn-primary w-full text-center py-3">로그인</button>
        </form>
    </div>`;
}

function pageAdminDashboard() {
    return `
    <div class="flex justify-between items-center mb-8">
        <div>
            <p class="mono text-xs mb-1" style="color:var(--primary);">// DASHBOARD</p>
            <h1 class="text-2xl font-bold">관리자</h1>
        </div>
        <button onclick="logout()" class="text-sm px-4 py-2 rounded-lg font-medium" style="background:rgba(186,26,26,0.15); color:#f87171; border:1px solid rgba(186,26,26,0.3);">로그아웃</button>
    </div>

    <div id="adminMessage" class="mb-4"></div>

    <div class="flex gap-4 mb-8" style="border-bottom:1px solid var(--border);">
        <button onclick="adminTab='password'; render()" class="pb-3 text-sm font-medium transition-colors"
            style="color:${adminTab==='password'?'var(--primary)':'var(--text-muted)'}; border-bottom:${adminTab==='password'?'2px solid var(--primary)':'2px solid transparent'};">
            비밀번호 변경
        </button>
        <button onclick="adminTab='projects'; render()" class="pb-3 text-sm font-medium transition-colors"
            style="color:${adminTab==='projects'?'var(--primary)':'var(--text-muted)'}; border-bottom:${adminTab==='projects'?'2px solid var(--primary)':'2px solid transparent'};">
            프로젝트 관리
        </button>
    </div>

    ${adminTab === 'password' ? `
    <form onsubmit="handleChangePassword(event)" class="max-w-md card p-8 space-y-5">
        <div>
            <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">현재 비밀번호</label>
            <input type="password" id="currentPassword" required class="input-field">
        </div>
        <div>
            <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">새 비밀번호</label>
            <input type="password" id="newPassword" required class="input-field">
        </div>
        <div>
            <label class="block text-sm font-medium mb-2" style="color:var(--text-muted);">새 비밀번호 확인</label>
            <input type="password" id="confirmPassword" required class="input-field">
        </div>
        <button type="submit" class="btn-primary w-full text-center py-3">변경</button>
    </form>` : `
    <div class="space-y-8">
        <div class="card p-6">
            <h2 class="font-bold mb-5 text-sm mono" style="color:var(--primary);">// ADD PROJECT</h2>
            <form onsubmit="handleAddProject(event)" class="space-y-4">
                <input type="text" id="projectTitle" placeholder="프로젝트 제목" required class="input-field">
                <textarea id="projectDesc" placeholder="설명" rows="3" required class="input-field" style="resize:vertical;"></textarea>
                <input type="text" id="projectTech" placeholder="기술스택 (쉼표로 구분)" required class="input-field">
                <input type="url" id="projectLink" placeholder="링크 (선택)" class="input-field">
                <button type="submit" class="btn-primary px-6 py-2 text-sm">추가</button>
            </form>
        </div>
        <div>
            <h2 class="font-bold mb-4 text-sm mono" style="color:var(--primary);">// PROJECT LIST</h2>
            <div id="adminProjectsList" class="space-y-3">
                <p style="color:var(--text-muted);">로딩 중...</p>
            </div>
        </div>
    </div>`}`;
}

// ═══════════════════════════════════════════════════════
//  API 핸들러
// ═══════════════════════════════════════════════════════
async function loadAdminProjects() {
    try {
        const resp = await fetch(`${API_URL}/projects`);
        const projects = await resp.json();
        const el = document.getElementById('adminProjectsList');
        if (!el) return;
        el.innerHTML = projects.map(p => `
            <div class="card p-5 flex justify-between items-start gap-4">
                <div class="flex-1">
                    <h3 class="font-bold text-sm mb-1">${p.title}</h3>
                    <p class="text-xs mb-2" style="color:var(--text-muted);">${p.description}</p>
                    <p class="text-xs mono" style="color:var(--primary);">${p.technologies}</p>
                </div>
                <button onclick="deleteProject(${p.id})" class="text-xs px-3 py-1.5 rounded-lg flex-shrink-0"
                    style="background:rgba(186,26,26,0.15); color:#f87171; border:1px solid rgba(186,26,26,0.3);">삭제</button>
            </div>`).join('') || `<p style="color:var(--text-muted);">프로젝트가 없습니다.</p>`;
    } catch { /* 무시 */ }
}

async function handleLogin(e) {
    e.preventDefault();
    try {
        const resp = await fetch(`${API_URL}/admin/login`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ username: document.getElementById('username').value, password: document.getElementById('password').value })
        });
        const data = await resp.json();
        if (resp.ok) {
            isLoggedIn = true; adminName = document.getElementById('username').value;
            authToken = data.access_token;
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('admin_name', adminName);
            adminTab = 'password'; currentPage = 'admin'; render();
        } else {
            document.getElementById('loginError').innerHTML = alert_html('✗ ' + (data.detail || '로그인 실패'), 'error');
        }
    } catch (err) {
        document.getElementById('loginError').innerHTML = alert_html('✗ ' + err.message, 'error');
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    const np = document.getElementById('newPassword').value;
    if (np !== document.getElementById('confirmPassword').value) { showAdminMessage('새 비밀번호가 일치하지 않습니다.', 'error'); return; }
    try {
        const resp = await fetch(`${API_URL}/admin/change-password`, {
            method: 'POST', headers: {'Content-Type':'application/json','Authorization':'Bearer '+authToken},
            body: JSON.stringify({ current_password: document.getElementById('currentPassword').value, new_password: np })
        });
        const data = await resp.json();
        resp.ok ? showAdminMessage('✓ 비밀번호가 변경되었습니다.', 'success') : showAdminMessage('✗ ' + (data.detail || '실패'), 'error');
    } catch (err) { showAdminMessage('✗ ' + err.message, 'error'); }
}

async function handleAddProject(e) {
    e.preventDefault();
    try {
        const resp = await fetch(`${API_URL}/projects`, {
            method: 'POST', headers: {'Content-Type':'application/json','Authorization':'Bearer '+authToken},
            body: JSON.stringify({
                title: document.getElementById('projectTitle').value,
                description: document.getElementById('projectDesc').value,
                technologies: document.getElementById('projectTech').value,
                link: document.getElementById('projectLink').value,
                image_url: ''
            })
        });
        if (resp.ok) {
            showAdminMessage('✓ 추가되었습니다.', 'success');
            ['projectTitle','projectDesc','projectTech','projectLink'].forEach(id => { const f=document.getElementById(id); if(f) f.value=''; });
            loadAdminProjects();
        } else { showAdminMessage('✗ 추가 실패', 'error'); }
    } catch (err) { showAdminMessage('✗ ' + err.message, 'error'); }
}

async function deleteProject(id) {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
        const resp = await fetch(`${API_URL}/projects/${id}`, { method:'DELETE', headers:{'Authorization':'Bearer '+authToken} });
        if (resp.ok) { showAdminMessage('✓ 삭제되었습니다.', 'success'); loadAdminProjects(); }
    } catch { /* 무시 */ }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    try {
        const resp = await fetch(`${API_URL}/contact`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            })
        });
        if (resp.ok) {
            const r = document.getElementById('contactResult');
            if (r) r.innerHTML = alert_html('✓ 메시지가 전송되었습니다.', 'success');
            setTimeout(() => {
                ['contactName','contactEmail','contactSubject','contactMessage'].forEach(id => { const f=document.getElementById(id); if(f) f.value=''; });
                const r2 = document.getElementById('contactResult');
                if (r2) r2.innerHTML = '';
            }, 2000);
        }
    } catch (err) { console.error(err); }
}

function logout() {
    isLoggedIn = false; adminName = null; authToken = null;
    localStorage.removeItem('auth_token'); localStorage.removeItem('admin_name');
    currentPage = 'home'; render();
}

let adminMessageTimer = null;
function showAdminMessage(msg, type) {
    const el = document.getElementById('adminMessage');
    if (!el) return;
    if (adminMessageTimer) clearTimeout(adminMessageTimer);
    el.innerHTML = alert_html(msg, type);
    adminMessageTimer = setTimeout(() => { const d=document.getElementById('adminMessage'); if(d) d.innerHTML=''; }, 3000);
}

function alert_html(msg, type) {
    const ok = type === 'success';
    return `<div style="padding:12px 16px; border-radius:10px; font-size:14px;
        background:${ok?'rgba(52,211,153,0.1)':'rgba(186,26,26,0.1)'};
        border:1px solid ${ok?'rgba(52,211,153,0.3)':'rgba(186,26,26,0.3)'};
        color:${ok?'var(--success)':'#f87171'};">${msg}</div>`;
}
