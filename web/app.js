// Read backend URL from runtime config (config.js), fallback to localhost for dev.
const API_URL = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || 'http://localhost:8000';
let currentPage = 'home';
let isLoggedIn = false;
let adminName = null;
let authToken = null;

// 초기 로드
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    const name = localStorage.getItem('admin_name');
    if (token) {
        isLoggedIn = true;
        adminName = name;
        authToken = token;
    }
    render();
});

function render() {
    updateHeader();
    renderPage();
}

function updateHeader() {
    const authButtons = document.getElementById('authButtons');
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="hidden md:block text-sm" style="color: var(--secondary);">${adminName}</span>
                <button onclick="currentPage = 'admin'; render()" class="hidden md:block px-4 py-2 rounded-lg text-sm font-medium" style="background: #00236f; color: white;">Dashboard</button>
                <button onclick="logout()" class="hidden md:block text-sm transition-colors" style="color: var(--secondary);">Logout</button>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="currentPage = 'admin'; render()" class="hidden md:block px-4 py-2 rounded-lg text-sm font-medium" style="background: #00236f; color: white;">Admin</button>
        `;
    }
}

function renderPage() {
    const content = document.getElementById('content');

    if (currentPage === 'home') {
        content.innerHTML = pageHome();
    } else if (currentPage === 'about') {
        content.innerHTML = pageAbout();
    } else if (currentPage === 'projects') {
        content.innerHTML = pageProjects();
        loadProjects();
    } else if (currentPage === 'contact') {
        content.innerHTML = pageContact();
    } else if (currentPage === 'admin') {
        if (!isLoggedIn) {
            content.innerHTML = pageAdminLogin();
        } else {
            content.innerHTML = pageAdminDashboard();
            loadAdminProjects();
        }
    }
}

// ===== 페이지 콘텐츠 =====

function pageHome() {
    return `
        <section class="mb-16">
            <div class="flex flex-col gap-4">
                <div class="inline-flex items-center gap-2 text-[#00236f] text-sm font-medium">
                    <span class="w-8 h-px" style="background: #00236f;"></span>
                    Senior Frontend Developer
                </div>
                <h1 class="text-4xl md:text-6xl font-bold" style="color: #1a1b21;">포트폴리오</h1>
                <p class="text-2xl font-semibold" style="color: #505f76;">사용자 경험을 혁신하는 개발자</p>
                <div class="flex flex-wrap gap-2 mt-4">
                    <span class="px-4 py-2 bg-[#d0e1fb] text-[#54647a] rounded-full text-sm font-medium">React</span>
                    <span class="px-4 py-2 bg-[#d0e1fb] text-[#54647a] rounded-full text-sm font-medium">TypeScript</span>
                    <span class="px-4 py-2 bg-[#d0e1fb] text-[#54647a] rounded-full text-sm font-medium">FastAPI</span>
                    <span class="px-4 py-2 bg-[#d0e1fb] text-[#54647a] rounded-full text-sm font-medium">Tailwind CSS</span>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onclick="currentPage = 'projects'; render()" class="px-8 py-3 rounded-xl font-bold text-white" style="background: #00236f;">
                        프로젝트 보기
                    </button>
                    <button class="px-8 py-3 rounded-xl font-bold border-2" style="border-color: #00236f; color: #00236f;">
                        이력서 다운로드
                    </button>
                </div>
            </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <div class="glass-card p-8 rounded-2xl">
                <div class="text-4xl font-bold" style="color: #00236f;">20+</div>
                <p class="text-sm" style="color: #505f76;">프로젝트 성공</p>
            </div>
            <div class="glass-card p-8 rounded-2xl">
                <div class="text-4xl font-bold" style="color: #4b1c00;">150%</div>
                <p class="text-sm" style="color: #505f76;">사용자 증가</p>
            </div>
            <div class="glass-card p-8 rounded-2xl">
                <div class="text-4xl font-bold" style="color: #505f76;">40%</div>
                <p class="text-sm" style="color: #505f76;">코드 효율 개선</p>
            </div>
        </section>
    `;
}

function pageAbout() {
    return `
        <section class="text-center mb-12">
            <div class="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white shadow-md" style="background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128'); background-size: cover;"></div>
            <h1 class="text-2xl font-bold mb-2">포트폴리오</h1>
            <p class="text-lg font-medium" style="color: #00236f;">Senior Software Engineer</p>
            <p style="color: #505f76;">📍 서울, 대한민국</p>
        </section>

        <section class="mb-8 px-2">
            <div class="glass-card p-6 rounded-xl" style="background: #f4f3fa; border: 1px solid rgba(197, 197, 211, 0.3);">
                <h2 class="font-bold mb-3 flex items-center gap-2">✨ 소개</h2>
                <p class="text-sm leading-relaxed" style="color: #444651;">
                    10년 차 개발자로서 복잡한 문제를 해결하고 확장 가능한 아키텍처를 설계하는 것에 열정을 가지고 있습니다. 비즈니스 가치를 창출하고 팀의 생산성을 극대화하는 솔루션을 제공합니다.
                </p>
            </div>
        </section>

        <section class="grid grid-cols-1 gap-4">
            <div class="glass-card p-6 rounded-2xl">
                <h3 class="font-bold mb-4 flex items-center gap-2">💼 주요 경력</h3>
                <div class="space-y-4">
                    <div class="flex gap-4">
                        <div class="flex flex-col items-center">
                            <div class="w-2 h-2 rounded-full" style="background: #00236f; margin-top: 6px;"></div>
                            <div class="w-0.5 h-12" style="background: rgba(197, 197, 211, 0.5);"></div>
                        </div>
                        <div>
                            <p class="text-sm font-bold" style="color: #00236f;">Google Korea</p>
                            <p class="text-sm" style="color: #444651;">Lead Frontend Engineer</p>
                            <p class="text-xs" style="color: #505f76;">2020 - Present</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="flex flex-col items-center">
                            <div class="w-2 h-2 rounded-full" style="background: #c5c5d3; margin-top: 6px;"></div>
                        </div>
                        <div>
                            <p class="text-sm font-bold">Naver</p>
                            <p class="text-sm" style="color: #444651;">Senior Developer</p>
                            <p class="text-xs" style="color: #505f76;">2016 - 2020</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="glass-card p-6 rounded-2xl" style="border-left: 4px solid #00236f;">
                <h3 class="font-bold mb-4 flex items-center gap-2">✉️ 연락처</h3>
                <div class="space-y-2">
                    <a href="mailto:dev@example.com" class="flex items-center gap-3 p-2 rounded transition-colors" style="color: #444651;">
                        <span>📧</span> dev@example.com
                    </a>
                    <a href="#" class="flex items-center gap-3 p-2 rounded transition-colors" style="color: #444651;">
                        <span>🔗</span> LinkedIn
                    </a>
                </div>
            </div>

            <div class="p-6 rounded-2xl" style="background: #1e3a8a; color: #90a8ff;">
                <h3 class="font-bold mb-4 flex items-center gap-2">🏆 자격 및 수상</h3>
                <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                        <span>✓</span>
                        <div>
                            <p class="font-bold">올해의 개발자상</p>
                            <p class="text-xs opacity-80">2023</p>
                        </div>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>✓</span>
                        <div>
                            <p class="font-bold">AWS Certified Solutions Architect</p>
                            <p class="text-xs opacity-80">Professional Level</p>
                        </div>
                    </li>
                </ul>
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
