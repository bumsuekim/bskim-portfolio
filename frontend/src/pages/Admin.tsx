import { useState } from 'react'

interface AdminProps {
  onLoginSuccess: (name: string) => void
  isLoggedIn?: boolean
  onLogout?: () => void
  adminName?: string | null
}

export default function Admin({ onLoginSuccess, isLoggedIn = false, onLogout, adminName }: AdminProps) {
  const [tab, setTab] = useState<'login' | 'change-password' | 'projects'>('login')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', link: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        })
      })

      const data = await response.json()
      if (response.ok && data.token) {
        localStorage.setItem('auth_token', data.token)
        onLoginSuccess(loginForm.username)
        setTab('projects')
        setLoginForm({ username: '', password: '' })
        fetchProjects()
      } else {
        setMessage(data.detail || '로그인 실패')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('로그인 오류')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessage('✓ 비밀번호가 변경되었습니다.')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(data.detail || '비밀번호 변경 실패')
      }
    } catch (error) {
      console.error('Password change error:', error)
      setMessage('오류가 발생했습니다.')
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Fetch projects error:', error)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          title: projectForm.title,
          description: projectForm.description,
          image_url: 'https://via.placeholder.com/400x300',
          technologies: projectForm.technologies,
          link: projectForm.link
        })
      })

      if (response.ok) {
        setMessage('✓ 프로젝트가 추가되었습니다.')
        setProjectForm({ title: '', description: '', technologies: '', link: '' })
        fetchProjects()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('프로젝트 추가 실패')
      }
    } catch (error) {
      console.error('Add project error:', error)
      setMessage('오류가 발생했습니다.')
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        setMessage('✓ 프로젝트가 삭제되었습니다.')
        fetchProjects()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('프로젝트 삭제 실패')
      }
    } catch (error) {
      console.error('Delete project error:', error)
      setMessage('오류가 발생했습니다.')
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="pt-24 pb-2xl px-gutter max-w-container-max mx-auto">
        <section className="max-w-md mx-auto">
          <h1 className="font-headline-md-mobile text-headline-md-mobile text-on-background mb-lg text-center">
            관리자 로그인
          </h1>

          {message && (
            <div className="mb-md p-md bg-error/10 border border-error/20 rounded-lg text-error font-body-md text-body-md">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="glass-card p-lg rounded-2xl shadow-sm space-y-md">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                사용자명
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                비밀번호
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary px-md py-md rounded-lg font-title-lg text-title-lg hover:opacity-90 active:scale-95 transition-all"
            >
              로그인
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="pt-24 pb-2xl px-gutter max-w-container-max mx-auto">
      <div className="flex justify-between items-center mb-lg">
        <h1 className="font-headline-md-mobile text-headline-md-mobile text-on-background">
          대시보드
        </h1>
        <button
          onClick={onLogout}
          className="bg-error text-on-error px-md py-xs rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
        >
          로그아웃
        </button>
      </div>

      {message && (
        <div className={`mb-md p-md border rounded-lg font-body-md text-body-md ${
          message.startsWith('✓')
            ? 'bg-primary/10 border-primary/20 text-primary'
            : 'bg-error/10 border-error/20 text-error'
        }`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-md mb-lg border-b border-outline-variant/20">
        <button
          onClick={() => setTab('change-password')}
          className={`font-label-sm text-label-sm pb-md transition-colors ${
            tab === 'change-password'
              ? 'text-primary border-b-2 border-primary'
              : 'text-secondary hover:text-primary'
          }`}
        >
          비밀번호 변경
        </button>
        <button
          onClick={() => { setTab('projects'); fetchProjects(); }}
          className={`font-label-sm text-label-sm pb-md transition-colors ${
            tab === 'projects'
              ? 'text-primary border-b-2 border-primary'
              : 'text-secondary hover:text-primary'
          }`}
        >
          프로젝트 관리
        </button>
      </div>

      {/* Change Password Tab */}
      {tab === 'change-password' && (
        <div className="max-w-md mx-auto glass-card p-lg rounded-2xl shadow-sm space-y-md">
          <form onSubmit={handleChangePassword} className="space-y-md">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                새 비밀번호
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary px-md py-md rounded-lg font-title-lg text-title-lg hover:opacity-90 active:scale-95 transition-all"
            >
              비밀번호 변경
            </button>
          </form>
        </div>
      )}

      {/* Projects Tab */}
      {tab === 'projects' && (
        <div className="space-y-lg">
          {/* Add Project Form */}
          <div className="glass-card p-lg rounded-2xl shadow-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-md">새 프로젝트 추가</h2>
            <form onSubmit={handleAddProject} className="space-y-md">
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="프로젝트 제목"
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                required
              />
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="프로젝트 설명"
                rows={3}
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                required
              ></textarea>
              <input
                type="text"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                placeholder="사용 기술 (쉼표로 구분)"
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                required
              />
              <input
                type="url"
                value={projectForm.link}
                onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                placeholder="링크"
                className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-full bg-primary text-on-primary px-md py-md rounded-lg font-title-lg text-title-lg hover:opacity-90 active:scale-95 transition-all"
              >
                추가
              </button>
            </form>
          </div>

          {/* Projects List */}
          <div className="space-y-md">
            <h2 className="font-title-lg text-title-lg text-on-surface">프로젝트 목록</h2>
            {projects.length === 0 ? (
              <p className="font-body-md text-body-md text-secondary">프로젝트가 없습니다.</p>
            ) : (
              projects.map(project => (
                <div key={project.id} className="glass-card p-lg rounded-2xl shadow-sm flex justify-between items-start">
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface">{project.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{project.description}</p>
                    <p className="text-sm text-secondary mt-sm">{project.technologies}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="bg-error text-on-error px-md py-xs rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  )
}
