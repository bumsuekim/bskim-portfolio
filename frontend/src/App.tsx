import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

type Page = 'home' | 'about' | 'projects' | 'contact' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminName, setAdminName] = useState<string | null>(null)

  useEffect(() => {
    // 로그인 상태 확인 (localStorage)
    const token = localStorage.getItem('auth_token')
    const name = localStorage.getItem('admin_name')
    if (token) {
      setIsLoggedIn(true)
      setAdminName(name)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('admin_name')
    setIsLoggedIn(false)
    setAdminName(null)
    setCurrentPage('home')
  }

  const handleLoginSuccess = (name: string) => {
    setIsLoggedIn(true)
    setAdminName(name)
    localStorage.setItem('admin_name', name)
  }

  const renderPage = () => {
    if (currentPage === 'admin' && !isLoggedIn) {
      return <Admin onLoginSuccess={handleLoginSuccess} />
    }

    switch (currentPage) {
      case 'home':
        return <Home />
      case 'about':
        return <About />
      case 'projects':
        return <Projects />
      case 'contact':
        return <Contact />
      case 'admin':
        return <Admin onLoginSuccess={handleLoginSuccess} isLoggedIn={isLoggedIn} onLogout={handleLogout} adminName={adminName} />
      default:
        return <Home />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} adminName={adminName} onLogout={handleLogout} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App
