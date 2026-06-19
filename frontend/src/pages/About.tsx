export default function About() {
  return (
    <main className="pt-24 pb-2xl px-gutter max-w-container-max mx-auto">
      {/* Profile Section */}
      <section className="flex flex-col items-center text-center mb-xl">
        <div className="relative w-32 h-32 mb-md">
          <div className="absolute inset-0 bg-primary-container/20 rounded-full animate-pulse"></div>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-surface shadow-md"
          />
        </div>
        <h1 className="font-headline-md-mobile text-headline-md-mobile text-on-surface mb-xs">포트폴리오</h1>
        <p className="font-title-lg text-title-lg text-primary font-medium mb-xs">Senior Software Engineer</p>
        <div className="flex items-center gap-xs text-secondary">
          <span>📍</span>
          <span className="font-body-md text-body-md">서울, 대한민국</span>
        </div>
      </section>

      {/* Summary Section */}
      <section className="mb-xl px-sm">
        <div className="p-lg rounded-xl bg-surface-container-low border border-outline-variant/30">
          <h2 className="font-title-lg text-title-lg text-on-surface mb-sm flex items-center gap-sm">
            <span>✨</span>
            소개
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            10년 차 개발자로서 복잡한 문제를 해결하고 확장 가능한 아키텍처를 설계하는 것에 열정을 가지고 있습니다. 단순히 코드를 작성하는 것을 넘어, 비즈니스 가치를 창출하고 팀의 생산성을 극대화하는 솔루션을 제공합니다.
          </p>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 gap-md">
        {/* Career Card */}
        <div className="glass-card p-lg rounded-2xl shadow-sm">
          <div className="flex items-center gap-sm mb-md">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
              <span>💼</span>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface">주요 경력</h3>
          </div>
          <div className="space-y-md">
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="w-0.5 h-16 bg-outline-variant/50"></div>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-primary font-bold">Google Korea</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Lead Frontend Engineer</p>
                <p className="text-[12px] text-secondary">2020 - Present</p>
              </div>
            </div>
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-outline-variant mt-2"></div>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface font-bold">Naver</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Senior Developer</p>
                <p className="text-[12px] text-secondary">2016 - 2020</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="glass-card p-lg rounded-2xl shadow-sm border-l-4 border-l-primary">
          <div className="flex items-center gap-sm mb-md">
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
              <span>✉️</span>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface">연락처</h3>
          </div>
          <div className="grid grid-cols-1 gap-sm">
            <a href="mailto:dev@example.com" className="flex items-center gap-md p-sm rounded-lg hover:bg-surface-container-high transition-colors">
              <span>📧</span>
              <span className="font-body-md text-body-md text-on-surface-variant">dev@example.com</span>
            </a>
            <a href="#" className="flex items-center gap-md p-sm rounded-lg hover:bg-surface-container-high transition-colors">
              <span>🔗</span>
              <span className="font-body-md text-body-md text-on-surface-variant">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Awards Card */}
        <div className="bg-primary-container text-on-primary-container p-lg rounded-2xl shadow-md">
          <div className="flex items-center gap-sm mb-md">
            <div className="w-10 h-10 rounded-lg bg-surface/20 flex items-center justify-center">
              <span>🏆</span>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-primary-container">자격 및 수상</h3>
          </div>
          <ul className="space-y-sm">
            <li className="flex items-start gap-sm">
              <span className="mt-1">✓</span>
              <div>
                <p className="font-label-sm text-label-sm font-bold">올해의 개발자상</p>
                <p className="text-[12px] opacity-80">2023</p>
              </div>
            </li>
            <li className="flex items-start gap-sm">
              <span className="mt-1">✓</span>
              <div>
                <p className="font-label-sm text-label-sm font-bold">AWS Certified Solutions Architect</p>
                <p className="text-[12px] opacity-80">Professional Level</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
