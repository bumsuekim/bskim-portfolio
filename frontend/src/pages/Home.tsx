export default function Home() {
  return (
    <main className="pt-24 pb-2xl px-gutter max-w-container-max mx-auto overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative mb-2xl">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col gap-md text-left">
          <div className="inline-flex items-center gap-xs text-primary font-label-sm text-label-sm tracking-wider uppercase">
            <span className="w-8 h-[1px] bg-primary"></span>
            Senior Frontend Developer
          </div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background">
            포트폴리오
          </h1>
          <p className="font-headline-md-mobile text-headline-md-mobile md:font-headline-md md:text-headline-md text-secondary leading-tight max-w-2xl">
            사용자 경험을 혁신하는 개발자
          </p>
          <div className="flex flex-wrap gap-sm mt-md">
            <span className="flex items-center gap-xs px-md py-xs bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm border border-outline-variant/20">
              React
            </span>
            <span className="flex items-center gap-xs px-md py-xs bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm border border-outline-variant/20">
              TypeScript
            </span>
            <span className="flex items-center gap-xs px-md py-xs bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm border border-outline-variant/20">
              FastAPI
            </span>
            <span className="flex items-center gap-xs px-md py-xs bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm border border-outline-variant/20">
              Tailwind CSS
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-md mt-xl">
            <a href="#projects" className="bg-primary text-on-primary px-xl py-md rounded-xl font-title-lg text-title-lg shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-sm">
              프로젝트 보기
            </a>
            <button className="border-2 border-primary text-primary px-xl py-md rounded-xl font-title-lg text-title-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-sm">
              이력서 다운로드
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-2xl">
        <div className="glass-card p-xl rounded-2xl flex flex-col gap-sm border border-outline-variant/30 hover:border-primary/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            🚀
          </div>
          <div className="mt-md">
            <h3 className="font-display-lg-mobile text-display-lg-mobile text-primary">20+</h3>
            <p className="font-body-md text-body-md text-secondary">프로젝트 성공</p>
          </div>
        </div>

        <div className="glass-card p-xl rounded-2xl flex flex-col gap-sm border border-outline-variant/30 hover:border-primary/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
            👥
          </div>
          <div className="mt-md">
            <h3 className="font-display-lg-mobile text-display-lg-mobile text-tertiary">150%</h3>
            <p className="font-body-md text-body-md text-secondary">사용자 증가</p>
          </div>
        </div>

        <div className="glass-card p-xl rounded-2xl flex flex-col gap-sm border border-outline-variant/30 hover:border-primary/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
            ⚡
          </div>
          <div className="mt-md">
            <h3 className="font-display-lg-mobile text-display-lg-mobile text-secondary">40%</h3>
            <p className="font-body-md text-body-md text-secondary">코드 효율 개선</p>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="rounded-3xl overflow-hidden shadow-2xl mb-2xl relative h-80 md:h-96 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=500&fit=crop"
          alt="Developer workspace"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-lg left-lg z-20 text-white max-w-lg">
          <p className="font-title-lg text-title-lg font-bold mb-xs">Crafting High-Performance Digital Solutions</p>
          <p className="font-body-md text-body-md opacity-90">지속 가능한 코드와 아름다운 인터페이스를 지향합니다.</p>
        </div>
      </section>
    </main>
  )
}
