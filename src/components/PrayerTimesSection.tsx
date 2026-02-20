'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useCallback } from 'react'
import { Link } from '@/i18n/navigation'

interface PrayerTime {
  key: string
  name: string
  time: string
  timestamp: number
}

interface AladhanTimings {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
const ALADHAN_MAP: Record<string, keyof AladhanTimings> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
}

function parseTimeToTimestamp(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const now = new Date()
  now.setHours(hours, minutes, 0, 0)
  return now.getTime()
}

export function PrayerTimesSection({
  lat,
  lng,
}: {
  lat: number
  lng: number
}) {
  const t = useTranslations()
  const [prayers, setPrayers] = useState<PrayerTime[]>([])
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(-1)
  const [nextPrayerIndex, setNextPrayerIndex] = useState(-1)
  const [countdown, setCountdown] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch prayer times from Aladhan API
  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=3`
        )
        const data = await res.json()
        const apiTimings: AladhanTimings = data.data.timings

        const prayerList: PrayerTime[] = PRAYER_KEYS.map((key) => ({
          key,
          name: t(`prayer.${key}`),
          time: apiTimings[ALADHAN_MAP[key]],
          timestamp: parseTimeToTimestamp(apiTimings[ALADHAN_MAP[key]]),
        }))
        setPrayers(prayerList)
      } catch {
        setPrayers(
          PRAYER_KEYS.map((key) => ({
            key,
            name: t(`prayer.${key}`),
            time: '--:--',
            timestamp: 0,
          }))
        )
      } finally {
        setLoading(false)
      }
    }
    fetchPrayerTimes()
  }, [lat, lng, t])

  // Update countdown and current/next prayer every second
  const updateState = useCallback(() => {
    if (prayers.length === 0) return

    const now = Date.now()
    let currentIdx = -1
    let nextIdx = -1

    for (let i = prayers.length - 1; i >= 0; i--) {
      if (now >= prayers[i].timestamp) {
        currentIdx = i
        nextIdx = i + 1 < prayers.length ? i + 1 : -1
        break
      }
    }
    if (currentIdx === -1) nextIdx = 0

    setCurrentPrayerIndex(currentIdx)
    setNextPrayerIndex(nextIdx)

    // Countdown
    if (nextIdx >= 0 && nextIdx < prayers.length) {
      const diff = prayers[nextIdx].timestamp - now
      if (diff > 0) {
        const hours = Math.floor(diff / 3600000)
        const minutes = Math.floor((diff % 3600000) / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        setCountdown(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        )
      } else {
        setCountdown('00:00:00')
      }
    } else {
      setCountdown('')
    }
  }, [prayers])

  useEffect(() => {
    updateState()
    const interval = setInterval(updateState, 1000)
    return () => clearInterval(interval)
  }, [updateState])

  const nextPrayerName =
    nextPrayerIndex >= 0 && nextPrayerIndex < prayers.length
      ? prayers[nextPrayerIndex].name
      : null

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-center mb-2 text-foreground">
          {t('home.prayerTimesToday')}
        </h2>

        {/* Next prayer countdown */}
        {!loading && nextPrayerName && countdown && (
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-wider mb-1 text-muted">
              {t('home.nextPrayer')}: {nextPrayerName}
            </p>
            <p className="text-5xl md:text-6xl font-display font-bold tabular-nums text-primary">
              {countdown}
            </p>
          </div>
        )}

        {!loading && !nextPrayerName && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted">
              All prayers completed for today
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted">{t('common.loading')}</p>
          </div>
        )}

        {/* Prayer time cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {prayers.map(({ key, name, time }, idx) => {
            const isCurrent = idx === currentPrayerIndex
            const isNext = idx === nextPrayerIndex
            return (
              <div
                key={key}
                className={`rounded-xl p-4 text-center transition-all duration-500 ${
                  isCurrent
                    ? 'bg-accent text-primary-dark shadow-lg shadow-accent/30 scale-105 ring-2 ring-accent'
                    : isNext
                      ? 'bg-card ring-2 ring-primary/40 text-foreground shadow-md'
                      : 'bg-card text-foreground shadow-sm border border-border'
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                    isCurrent ? 'text-primary-dark/70' : 'text-muted'
                  }`}
                >
                  {name}
                </p>
                <p className={`text-xl font-bold ${isCurrent ? 'text-primary-dark' : 'text-foreground'}`}>
                  {time}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest text-primary-dark/60">
                    Now
                  </span>
                )}
                {isNext && (
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest text-primary/70">
                    Next
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/prayer-times"
            className="text-primary hover:text-primary-dark font-medium"
          >
            {t('home.viewAll')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
