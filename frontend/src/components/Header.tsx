interface HeaderProps {
  currentPage: string
  onNavigate: (page: any) => void
  isLoggedIn: boolean
  adminName: string | null
  onLogout: () => void
}

export default function Header({ currentPage, onNavigate, isLoggedIn, adminName, onLogout }: HeaderProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className="font-title-lg text-title-lg font-bold text-primary cursor-pointer"
        >
          Portfolio
        </button>
        <div className="hidden md:flex gap-md items-center">
          <button
            onClick={() => onNavigate('home')}
            className={`font-label-sm text-label-sm transition-colors ${
              currentPage === 'home'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`font-label-sm text-label-sm transition-colors ${
              currentPage === 'about'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-secondary hover:text-primary'
            }`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('projects')}
            className={`font-label-sm text-label-sm transition-colors ${
              currentPage === 'projects'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`font-label-sm text-label-sm transition-colors ${
              currentPage === 'contact'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Contact
          </button>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center gap-md">
            <span className="hidden md:block font-label-sm text-label-sm text-secondary">{adminName}</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hidden md:block bg-primary text-on-primary px-md py-xs rounded-lg font-label-sm transition-transform active:scale-95"
            >
              Dashboard
            </button>
            <button
              onClick={onLogout}
              className="hidden md:block text-secondary hover:text-primary font-label-sm text-label-sm transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('admin')}
            className="hidden md:block bg-primary text-on-primary px-md py-xs rounded-lg font-label-sm transition-transform active:scale-95"
          >
            Admin
          </button>
        )}
      </div>
    </nav>
  )
}
