import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('모든 필드를 입력하세요.')
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError('메시지 전송에 실패했습니다.')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError('오류가 발생했습니다.')
    }
  }

  return (
    <main className="pt-24 pb-2xl px-gutter max-w-container-max mx-auto">
      <section className="mb-2xl max-w-2xl mx-auto">
        <h1 className="font-headline-md-mobile text-headline-md-mobile md:font-headline-md md:text-headline-md text-on-background mb-md text-center">
          연락하기
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center">
          의견이나 제안이 있으시면 언제든 연락해주세요.
        </p>
      </section>

      {submitted && (
        <div className="mb-md p-md bg-primary/10 border border-primary/20 rounded-lg text-primary font-body-md text-body-md">
          ✓ 메시지가 전송되었습니다.
        </div>
      )}

      {error && (
        <div className="mb-md p-md bg-error/10 border border-error/20 rounded-lg text-error font-body-md text-body-md">
          ✗ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto glass-card p-lg rounded-2xl shadow-sm">
        <div className="space-y-md">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
              제목
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
              메시지
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-md py-xs bg-surface-container border border-outline-variant/20 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
              placeholder="메시지를 입력하세요"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-on-primary px-md py-md rounded-lg font-title-lg text-title-lg hover:opacity-90 active:scale-95 transition-all"
          >
            보내기
          </button>
        </div>
      </form>
    </main>
  )
}
