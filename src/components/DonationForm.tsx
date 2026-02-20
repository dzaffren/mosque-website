'use client'

import { useState } from 'react'

interface DonationFormProps {
  labels: {
    onlinePay: string
    selectAmount: string
    customAmount: string
    donorName: string
    email: string
    phone: string
    payNow: string
    processing: string
    oneTime: string
    monthly: string
    monthlyNote: string
  }
}

const PRESET_AMOUNTS = [10, 20, 50, 100]

export function DonationForm({ labels }: DonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50)
  const [customAmount, setCustomAmount] = useState('')
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!effectiveAmount || effectiveAmount < 1) {
      setError('Please enter a valid donation amount (minimum RM1).')
      return
    }
    if (!name || !email || !phone) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, amount: effectiveAmount, frequency }),
      })
      const data = await res.json()
      if (!res.ok || !data.billUrl) {
        setError(data.error || 'Payment initiation failed. Please try again.')
        return
      }
      window.location.href = data.billUrl
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Frequency toggle */}
      <div className="grid grid-cols-2 gap-2 bg-background rounded-xl p-1">
        <button
          type="button"
          onClick={() => setFrequency('once')}
          className={`py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            frequency === 'once'
              ? 'bg-primary-dark text-white shadow'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {labels.oneTime}
        </button>
        <button
          type="button"
          onClick={() => setFrequency('monthly')}
          className={`py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            frequency === 'monthly'
              ? 'bg-primary-dark text-white shadow'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {labels.monthly}
        </button>
      </div>
      {frequency === 'monthly' && (
        <p className="text-xs text-muted bg-accent/10 rounded-lg px-4 py-3 leading-relaxed">
          💡 {labels.monthlyNote}
        </p>
      )}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">{labels.selectAmount}</p>
        <div className="grid grid-cols-4 gap-3 mb-3">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => { setSelectedAmount(amt); setCustomAmount('') }}
              className={`py-3 rounded-lg font-bold text-sm border-2 transition-colors ${
                selectedAmount === amt && !customAmount
                  ? 'bg-primary-dark text-white border-primary-dark'
                  : 'bg-background text-foreground border-border hover:border-primary'
              }`}
            >
              RM{amt}
            </button>
          ))}
        </div>
        <input
          type="number"
          min="1"
          step="1"
          placeholder={labels.customAmount}
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">{labels.donorName}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">{labels.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">{labels.phone}</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0123456789"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/80 disabled:opacity-60 text-primary-dark font-bold py-4 rounded-xl text-lg transition-colors"
      >
        {loading ? labels.processing : `${labels.payNow}${effectiveAmount ? ` — RM${effectiveAmount}${frequency === 'monthly' ? '/mo' : ''}` : ''}`}
      </button>
    </form>
  )
}
