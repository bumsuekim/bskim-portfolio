export default function Footer() {
  return (
    <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-md px-gutter max-w-container-max mx-auto">
        <span className="font-title-lg text-title-lg font-black text-on-surface">Portfolio</span>
        <div className="flex gap-lg">
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">
            LinkedIn
          </a>
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">
            GitHub
          </a>
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">
            Twitter
          </a>
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">
            Email
          </a>
        </div>
        <p className="font-label-sm text-label-sm text-secondary opacity-80 mt-md md:mt-0">
          © 2024 Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
