'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Tab = 'feedback' | 'inquiry'

export function ContactForm() {
  const t = useTranslations('contact')
  const [tab, setTab] = useState<Tab>('feedback')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function resetForm() {
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    setRating(0)
    setError('')
  }

  function switchTab(next: Tab) {
    setTab(next)
    setSuccess(false)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: tab,
          name,
          email: tab === 'inquiry' ? email : undefined,
          subject: tab === 'inquiry' ? subject : undefined,
          message,
          rating: tab === 'feedback' && rating > 0 ? rating : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('error'))
        return
      }
      setSuccess(true)
      resetForm()
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition'

  return (
    <div>
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-background rounded-xl p-1 mb-6">
        {(['feedback', 'inquiry'] as Tab[]).map((t_) => (
          <button
            key={t_}
            type="button"
            onClick={() => switchTab(t_)}
            className={`py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              tab === t_
                ? 'bg-primary-dark text-white shadow'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {t(t_)}
          </button>
        ))}
      </div>

      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-foreground">{t('success')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name — common */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t('name')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Inquiry-only fields */}
          {tab === 'inquiry' && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('subject')}</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* Message — common */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t('message')}</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Star rating — feedback only */}
          {tab === 'feedback' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('rating')}</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-colors leading-none"
                    aria-label={`${star} stars`}
                  >
                    <span className={(hoverRating || rating) >= star ? 'text-accent' : 'text-border'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? '...' : tab === 'feedback' ? t('submitFeedback') : t('submitInquiry')}
          </button>
        </form>
      )}
    </div>
  )
}
