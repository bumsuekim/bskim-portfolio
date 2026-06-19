import { useState, useEffect } from 'react'

interface Project {
  id: number
  title: string
  description: string
  image_url: string
  technologies: string
  link: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      // Fallback 데이터
      setProjects([
        {
          id: 1,
          title: 'E-commerce Redesign',
          description: '온라인 쇼핑 플랫폼의 사용자 경험 개선',
          image_url: 'https://images.unsplash.com/photo-1460925895917-adf4e294ecca?w=400&h=300&fit=crop',
          technologies: 'React, TypeScript, Tailwind CSS',
          link: '#'
        },
        {
          id: 2,
          title: 'SaaS Dashboard',
          description: '실시간 분석 대시보드 개발',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          technologies: 'React, FastAPI, PostgreSQL',
          link: '#'
        },
        {
          id: 3,
          title: 'Mobile App',
          description: '크로스 플랫폼 모바일 애플리케이션',
          image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
          technologies: 'React Native, Firebase',
          link: '#'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-24 pb-2xl px-gutter max-w-container-max mx-auto">
      <section className="mb-2xl">
        <h1 className="font-headline-md-mobile text-headline-md-mobile md:font-headline-md md:text-headline-md text-on-background mb-md">
          포트폴리오 프로젝트
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          다양한 웹 프로젝트를 통해 기술력과 경험을 보여드립니다.
        </p>
      </section>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="font-body-md text-body-md text-secondary">로딩 중...</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md" id="projects">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-lg">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-sm">{project.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">{project.description}</p>
                <div className="flex flex-wrap gap-xs mb-md">
                  {project.technologies.split(',').map((tech, i) => (
                    <span key={i} className="inline-block px-md py-xs bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                <a href={project.link} className="inline-block bg-primary text-on-primary px-md py-xs rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity">
                  자세히 보기
                </a>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
