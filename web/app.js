// Read backend URL from runtime config (config.js), fallback to localhost for dev.
const API_URL = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || 'http://localhost:8000';
let currentPage = 'home';
let isLoggedIn = false;
let adminName = null;
let authToken = null;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    const name = localStorage.getItem('admin_name');
    if (token) { isLoggedIn = true; adminName = name; authToken = token; }
    render();
});

function nav(page) {
    currentPage = page;
    render();
    window.scrollTo(0, 0);
}

function render() {
    updateHeader();
    renderPage();
}

function updateHeader() {
    // nav 활성화 표시
    ['home', 'projects', 'about'].forEach(p => {
        const el = document.getElementById('nav-' + p);
        if (el) el.style.color = currentPage === p ? '#00236f' : 'var(--secondary)';
        if (el) el.style.fontWeight = currentPage === p ? '600' : '500';
    });

    const authButtons = document.getElementById('authButtons');
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <div class="flex items-center gap-3">
                <button onclick="nav('admin')" class="px-4 py-1.5 rounded-lg text-sm font-medium border" style="border-color: #00236f; color: #00236f;">Dashboard</button>
                <button onclick="logout()" class="text-sm font-medium" style="color: var(--secondary);">Logout</button>
            </div>`;
    } else {
        authButtons.innerHTML = `
            <div class="flex items-center gap-3">
                <button onclick="nav('admin')" class="text-sm font-medium" style="color: var(--secondary);">Admin</button>
                <button onclick="nav('contact')" class="px-4 py-1.5 rounded-full text-sm font-bold text-white" style="background: #00236f;">Hire Me</button>
            </div>`;
    }
}

function renderPage() {
    const content = document.getElementById('content');
    const footer = document.getElementById('site-footer');

    if (currentPage === 'home') {
        content.innerHTML = pageHome();
        if (footer) footer.style.display = '';
        loadHomeFeatured();
    } else {
        if (footer) footer.style.display = '';
        if (currentPage === 'about') {
            content.innerHTML = `<div class="pt-8 pb-16 px-6 max-w-6xl mx-auto">${pageAbout()}</div>`;
        } else if (currentPage === 'projects') {
            content.innerHTML = `<div class="pt-8 pb-16 px-6 max-w-6xl mx-auto">${pageProjects()}</div>`;
            loadProjects();
        } else if (currentPage === 'contact') {
            content.innerHTML = `<div class="pt-8 pb-16 px-6 max-w-6xl mx-auto">${pageContact()}</div>`;
        } else if (currentPage === 'admin') {
            content.innerHTML = `<div class="pt-8 pb-16 px-6 max-w-6xl mx-auto">${isLoggedIn ? pageAdminDashboard() : pageAdminLogin()}</div>`;
            if (isLoggedIn) loadAdminProjects();
        }
    }
}

// ===== 페이지 콘텐츠 =====

function pageHome() {
    return `
        <!-- HERO: 연보라 전폭 배경 -->
        <section class="hero-bg w-full" style="min-height: 80vh; display: flex; align-items: center;">
            <div class="px-6 max-w-6xl mx-auto w-full py-20">
                <span class="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style="background: rgba(0,35,111,0.1); color: #00236f;">
                    풀스택 개발자 · FastAPI / Python
                </span>
                <p class="text-xl md:text-2xl font-medium mb-2" style="color: #444651;">안녕하세요,</p>
                <h1 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight" style="color: #00236f;">김범수입니다</h1>
                <p class="text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style="color: #444651;">
                    백엔드 설계부터 프론트엔드 구현까지 전 주기를 담당하는 풀스택 개발자입니다.<br>
                    FastAPI · SQLAlchemy · React 기반 서비스를 Railway · Vercel에 배포 운영합니다.
                </p>
                <div class="flex flex-wrap gap-4">
                    <button onclick="nav('projects')" class="px-8 py-3 rounded-full font-bold text-white text-base" style="background: #00236f;">
                        프로젝트 보기 →
                    </button>
                    <button onclick="nav('about')" class="px-8 py-3 rounded-full font-bold text-base border-2" style="border-color: #00236f; color: #00236f; background: transparent;">
                        소개 보기
                    </button>
                </div>
            </div>
        </section>

        <!-- STATS BAR -->
        <section class="w-full border-b" style="background: #fff; border-color: rgba(197,197,211,0.3);">
            <div class="px-6 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x" style="divide-color: rgba(197,197,211,0.3);">
                <div class="py-10 px-6 text-center">
                    <div class="stat-num">3년+</div>
                    <p class="text-sm mt-1" style="color: #505f76;">개발 경력</p>
                </div>
                <div class="py-10 px-6 text-center">
                    <div class="stat-num">10+</div>
                    <p class="text-sm mt-1" style="color: #505f76;">완성 프로젝트</p>
                </div>
                <div class="py-10 px-6 text-center">
                    <div class="stat-num">100%</div>
                    <p class="text-sm mt-1" style="color: #505f76;">배포 성공률</p>
                </div>
                <div class="py-10 px-6 text-center">
                    <div class="stat-num">24/7</div>
                    <p class="text-sm mt-1" style="color: #505f76;">서비스 운영</p>
                </div>
            </div>
        </section>

        <!-- FEATURED PROJECTS PREVIEW -->
        <section class="px-6 max-w-6xl mx-auto py-16">
            <div class="flex justify-between items-baseline mb-8">
                <div>
                    <h2 class="text-2xl font-bold">주요 프로젝트</h2>
                    <p class="text-sm mt-1" style="color: #505f76;">FastAPI, Python, 풀스택 분야의 핵심 프로젝트입니다</p>
                </div>
                <button onclick="nav('projects')" class="text-sm font-medium flex items-center gap-1" style="color: #00236f;">전체 보기 →</button>
            </div>
            <div id="homeFeatured" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center py-12" style="color: #505f76;">로딩 중...</div>
            </div>
        </section>
    `;
}

function pageAbout() {
    return `
        <section class="text-center mb-12">
            <div class="w-28 h-28 mx-auto mb-5 rounded-full flex items-center justify-center text-4xl font-extrabold text-white" style="background: linear-gradient(135deg, #00236f, #3a5fc0);">BS</div>
            <h1 class="text-3xl font-extrabold mb-1" style="color: #1a1b21;">김범수</h1>
            <p class="text-base font-semibold mb-1" style="color: #00236f;">풀스택 개발자 · FastAPI / Python</p>
            <p class="text-sm" style="color: #505f76;">📍 대한민국</p>
        </section>

        <section class="mb-6">
            <div class="p-6 rounded-2xl" style="background: #f4f3fa; border: 1px solid rgba(197,197,211,0.3);">
                <h2 class="font-bold mb-3">소개</h2>
                <p class="text-sm leading-relaxed" style="color: #444651;">
                    백엔드 설계부터 프론트엔드 구현, 클라우드 배포까지 전 주기를 직접 담당하는 풀스택 개발자입니다.
                    FastAPI와 SQLAlchemy로 REST API를 구축하고, Railway · Vercel 환경에서 서비스를 안정적으로 운영합니다.
                    테스트 주도 개발(Playwright E2E)과 보안(JWT 인증)을 중요시합니다.
                </p>
            </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="glass-card p-6 rounded-2xl">
                <h3 class="font-bold mb-4">기술 스택</h3>
                <div class="space-y-3">
                    <div>
                        <p class="text-xs font-semibold mb-2 uppercase tracking-wider" style="color: #505f76;">Backend</p>
                        <div class="flex flex-wrap gap-2">
                            ${['Python', 'FastAPI', 'SQLAlchemy', 'Pydantic', 'JWT'].map(t => `<span class="px-3 py-1 rounded-full text-xs font-medium" style="background:#e8e8f5; color:#00236f;">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div>
                        <p class="text-xs font-semibold mb-2 uppercase tracking-wider" style="color: #505f76;">Frontend</p>
                        <div class="flex flex-wrap gap-2">
                            ${['Vanilla JS', 'Tailwind CSS', 'React', 'TypeScript'].map(t => `<span class="px-3 py-1 rounded-full text-xs font-medium" style="background:#e8e8f5; color:#00236f;">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div>
                        <p class="text-xs font-semibold mb-2 uppercase tracking-wider" style="color: #505f76;">Infra / DB</p>
                        <div class="flex flex-wrap gap-2">
                            ${['Railway', 'Vercel', 'PostgreSQL', 'SQLite', 'Playwright'].map(t => `<span class="px-3 py-1 rounded-full text-xs font-medium" style="background:#e8e8f5; color:#00236f;">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="glass-card p-6 rounded-2xl" style="border-left: 4px solid #00236f;">
                    <h3 class="font-bold mb-3">연락처</h3>
                    <div class="space-y-2">
                        <a href="mailto:bskim@landsoft.co.kr" class="flex items-center gap-3 text-sm hover:text-[#00236f] transition-colors" style="color: #444651;">
                            <span>📧</span> bskim@landsoft.co.kr
                        </a>
                        <a href="https://github.com/bumsuekim" target="_blank" class="flex items-center gap-3 text-sm hover:text-[#00236f] transition-colors" style="color: #444651;">
                            <span>🐙</span> github.com/bumsuekim
                        </a>
                    </div>
                </div>

                <div class="p-6 rounded-2xl" style="background: #00236f; color: white;">
                    <h3 class="font-bold mb-3">배포 중인 서비스</h3>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-start gap-2">
                            <span class="opacity-70">▸</span>
                            <div>
                                <p class="font-semibold">포트폴리오 웹앱</p>
                                <p class="text-xs opacity-70">FastAPI + Vanilla JS · Railway + Vercel</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    `;
}

function pageProjects() {
    return `
        <section class="mb-12">
            <h1 class="text-3xl font-bold mb-4">포트폴리오 프로젝트</h1>
            <p style="color: #505f76;">다양한 웹 프로젝트를 통해 기술력을 보여드립니다.</p>
        </section>

        <div id="projectsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="text-center py-12" style="color: #505f76;">로딩 중...</div>
        </div>
    `;
}

function pageContact() {
    return `
        <section class="max-w-2xl mx-auto mb-12 text-center">
            <h1 class="text-3xl font-bold mb-4">연락하기</h1>
            <p style="color: #505f76;">의견이나 제안이 있으시면 언제든 연락해주세요.</p>
        </section>

        <div id="contactResult" class="mb-4"></div>

        <form onsubmit="handleContactSubmit(event)" class="max-w-2xl mx-auto glass-card p-6 rounded-2xl space-y-4">
            <div>
                <label class="block text-sm font-medium mb-2">이름</label>
                <input type="text" id="contactName" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">이메일</label>
                <input type="email" id="contactEmail" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">제목</label>
                <input type="text" id="contactSubject" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">메시지</label>
                <textarea id="contactMessage" rows="6" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;"></textarea>
            </div>
            <button type="submit" class="w-full py-3 rounded-lg font-bold text-white" style="background: #00236f;">보내기</button>
        </form>
    `;
}

function pageAdminLogin() {
    return `
        <section class="max-w-md mx-auto">
            <h1 class="text-3xl font-bold mb-8 text-center">관리자 로그인</h1>

            <div id="loginError" class="mb-4"></div>

            <form onsubmit="handleLogin(event)" class="glass-card p-6 rounded-2xl space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">사용자명</label>
                    <input type="text" id="username" placeholder="admin" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">비밀번호</label>
                    <input type="password" id="password" placeholder="••••••••" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                </div>
                <button type="submit" class="w-full py-3 rounded-lg font-bold text-white" style="background: #00236f;">로그인</button>
            </form>
        </section>
    `;
}

function pageAdminDashboard() {
    return `
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold">대시보드</h1>
            <button onclick="logout()" class="px-4 py-2 rounded-lg text-sm font-medium text-white" style="background: #ba1a1a;">로그아웃</button>
        </div>

        <div id="adminMessage" class="mb-4"></div>

        <div class="flex gap-4 mb-8 border-b" style="border-color: rgba(197, 197, 211, 0.2);">
            <button onclick="adminTab = 'password'; render()" class="font-medium pb-3 text-sm" style="color: ${adminTab === 'password' ? '#00236f' : '#505f76'}; border-bottom: ${adminTab === 'password' ? '2px solid #00236f' : 'none'};">비밀번호 변경</button>
            <button onclick="adminTab = 'projects'; render()" class="font-medium pb-3 text-sm" style="color: ${adminTab === 'projects' ? '#00236f' : '#505f76'}; border-bottom: ${adminTab === 'projects' ? '2px solid #00236f' : 'none'};">프로젝트 관리</button>
        </div>

        ${adminTab === 'password' ? `
            <form onsubmit="handleChangePassword(event)" class="max-w-md mx-auto glass-card p-6 rounded-2xl space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">현재 비밀번호</label>
                    <input type="password" id="currentPassword" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">새 비밀번호</label>
                    <input type="password" id="newPassword" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">새 비밀번호 확인</label>
                    <input type="password" id="confirmPassword" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                </div>
                <button type="submit" class="w-full py-3 rounded-lg font-bold text-white" style="background: #00236f;">비밀번호 변경</button>
            </form>
        ` : `
            <div class="space-y-8">
                <div class="glass-card p-6 rounded-2xl">
                    <h2 class="font-bold mb-4">새 프로젝트 추가</h2>
                    <form onsubmit="handleAddProject(event)" class="space-y-4">
                        <input type="text" id="projectTitle" placeholder="프로젝트 제목" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                        <textarea id="projectDesc" placeholder="프로젝트 설명" rows="3" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;"></textarea>
                        <input type="text" id="projectTech" placeholder="사용 기술 (쉼표로 구분)" required class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                        <input type="url" id="projectLink" placeholder="링크" class="w-full px-4 py-2 rounded-lg border" style="border-color: rgba(197, 197, 211, 0.3); background: #f4f3fa;">
                        <button type="submit" class="w-full py-2 rounded-lg font-bold text-white" style="background: #00236f;">추가</button>
                    </form>
                </div>

                <div>
                    <h2 class="font-bold mb-4">프로젝트 목록</h2>
                    <div id="adminProjectsList" class="space-y-2">
                        <p style="color: #505f76;">로딩 중...</p>
                    </div>
                </div>
            </div>
        `}
    `;
}

// ===== API 함수 =====

async function loadHomeFeatured() {
    try {
        const resp = await fetch(`${API_URL}/projects`);
        const projects = await resp.json();
        const el = document.getElementById('homeFeatured');
        if (!el) return;
        const top = projects.slice(0, 3);
        if (!top.length) { el.innerHTML = '<p style="color:#505f76;" class="col-span-3 text-center py-12">아직 등록된 프로젝트가 없습니다.</p>'; return; }
        el.innerHTML = top.map(p => `
            <div class="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onclick="nav('projects')">
                <div class="h-40" style="background: linear-gradient(135deg, #dde0f0, #c8cce8);"></div>
                <div class="p-5">
                    <h3 class="font-bold mb-1">${p.title}</h3>
                    <p class="text-sm mb-3 line-clamp-2" style="color:#444651;">${p.description}</p>
                    <div class="flex flex-wrap gap-1">
                        ${p.technologies.split(',').slice(0,3).map(t => `<span class="px-2 py-0.5 rounded-full text-xs font-medium" style="background:#e8e8f5; color:#00236f;">${t.trim()}</span>`).join('')}
                    </div>
                </div>
            </div>`).join('');
    } catch { /* 네트워크 오류 시 무시 */ }
}

async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();

        const html = projects.map(p => `
            <div class="glass-card rounded-2xl overflow-hidden">
                <div class="h-48 bg-gradient-to-br from-blue-100 to-blue-50"></div>
                <div class="p-6">
                    <h3 class="font-bold mb-2">${p.title}</h3>
                    <p class="text-sm mb-4" style="color: #444651;">${p.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${p.technologies.split(',').map(t => `<span class="px-3 py-1 bg-[#d0e1fb] text-[#54647a] rounded-full text-xs font-medium">${t.trim()}</span>`).join('')}
                    </div>
                    <a href="${p.link || '#'}" class="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white" style="background: #00236f;">자세히 보기</a>
                </div>
            </div>
        `).join('');

        // Guard: user may have navigated away before this async fetch resolved.
        const el = document.getElementById('projectsList');
        if (el) el.innerHTML = html || '<p style="color: #505f76;">프로젝트가 없습니다.</p>';
    } catch (error) {
        console.error('프로젝트 로드 오류:', error);
        const el = document.getElementById('projectsList');
        if (el) el.innerHTML = '<p style="color: #505f76;">프로젝트를 로드할 수 없습니다.</p>';
    }
}

async function loadAdminProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();

        const html = projects.map(p => `
            <div class="glass-card p-6 rounded-2xl flex justify-between items-start">
                <div>
                    <h3 class="font-bold">${p.title}</h3>
                    <p class="text-sm" style="color: #444651;">${p.description}</p>
                    <p class="text-xs mt-2" style="color: #505f76;">${p.technologies}</p>
                </div>
                <button onclick="deleteProject(${p.id})" class="px-3 py-2 rounded-lg text-sm font-medium text-white" style="background: #ba1a1a;">삭제</button>
            </div>
        `).join('');

        const el = document.getElementById('adminProjectsList');
        if (el) el.innerHTML = html || '<p style="color: #505f76;">프로젝트가 없습니다.</p>';
    } catch (error) {
        console.error('프로젝트 로드 오류:', error);
    }
}

// ===== 이벤트 핸들러 =====

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            isLoggedIn = true;
            adminName = username;
            authToken = data.access_token;
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('admin_name', username);
            adminTab = 'password';
            currentPage = 'admin';
            render();
        } else {
            document.getElementById('loginError').innerHTML = `<div style="padding: 12px; background: rgba(186, 26, 26, 0.1); border-radius: 8px; color: #ba1a1a; font-size: 14px;">✗ ${data.detail || '로그인 실패'}</div>`;
        }
    } catch (error) {
        document.getElementById('loginError').innerHTML = `<div style="padding: 12px; background: rgba(186, 26, 26, 0.1); border-radius: 8px; color: #ba1a1a; font-size: 14px;">✗ 오류: ${error.message}</div>`;
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (newPass !== confirm) {
        showAdminMessage('새 비밀번호가 일치하지 않습니다.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ current_password: current, new_password: newPass })
        });

        const data = await response.json();
        if (response.ok) {
            showAdminMessage('✓ 비밀번호가 변경되었습니다.', 'success');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        } else {
            showAdminMessage('✗ ' + (data.detail || '비밀번호 변경 실패'), 'error');
        }
    } catch (error) {
        showAdminMessage('✗ 오류: ' + error.message, 'error');
    }
}

async function handleAddProject(e) {
    e.preventDefault();
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDesc').value;
    const technologies = document.getElementById('projectTech').value;
    const link = document.getElementById('projectLink').value;

    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, description, technologies, link, image_url: '' })
        });

        if (response.ok) {
            showAdminMessage('✓ 프로젝트가 추가되었습니다.', 'success');
            document.getElementById('projectTitle').value = '';
            document.getElementById('projectDesc').value = '';
            document.getElementById('projectTech').value = '';
            document.getElementById('projectLink').value = '';
            loadAdminProjects();
        } else {
            showAdminMessage('✗ 프로젝트 추가 실패', 'error');
        }
    } catch (error) {
        showAdminMessage('✗ 오류: ' + error.message, 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            showAdminMessage('✓ 프로젝트가 삭제되었습니다.', 'success');
            loadAdminProjects();
        }
    } catch (error) {
        showAdminMessage('✗ 오류', 'error');
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });

        if (response.ok) {
            const result = document.getElementById('contactResult');
            if (result) result.innerHTML = '<div style="padding: 12px; background: rgba(0, 35, 111, 0.1); border-radius: 8px; color: #00236f;">✓ 메시지가 전송되었습니다.</div>';
            setTimeout(() => {
                // Guard: user may have navigated away from the contact page.
                ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(id => {
                    const f = document.getElementById(id);
                    if (f) f.value = '';
                });
                const r = document.getElementById('contactResult');
                if (r) r.innerHTML = '';
            }, 2000);
        }
    } catch (error) {
        console.error('오류:', error);
    }
}

function logout() {
    isLoggedIn = false;
    adminName = null;
    authToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_name');
    currentPage = 'home';
    render();
}

let adminMessageTimer = null;
function showAdminMessage(msg, type) {
    const msgDiv = document.getElementById('adminMessage');
    if (!msgDiv) return;
    // Cancel any pending clear from a previous message so a stale timer
    // doesn't wipe this newer message early.
    if (adminMessageTimer) clearTimeout(adminMessageTimer);
    const bgColor = type === 'success' ? 'rgba(0, 35, 111, 0.1)' : 'rgba(186, 26, 26, 0.1)';
    const textColor = type === 'success' ? '#00236f' : '#ba1a1a';
    msgDiv.innerHTML = `<div style="padding: 12px; background: ${bgColor}; border-radius: 8px; color: ${textColor};">${msg}</div>`;
    adminMessageTimer = setTimeout(() => {
        const d = document.getElementById('adminMessage');
        if (d) d.innerHTML = '';
    }, 3000);
}

let adminTab = 'password';
