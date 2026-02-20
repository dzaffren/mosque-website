'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

interface DayTimings {
  date: string
  day: number
  timings: {
    Fajr: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
  }
}

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const
const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const

function stripTimezone(time: string): string {
  return time.replace(/\s*\(.*\)/, '').trim()
}

export function MonthlyPrayerCalendar({
  lat,
  lng,
}: {
  lat: number
  lng: number
}) {
  const t = useTranslations('prayer')
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [days, setDays] = useState<DayTimings[]>([])
  const [loading, setLoading] = useState(true)

  const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`

  useEffect(() => {
    async function fetchMonth() {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=3&month=${month}&year=${year}`
        )
        const data = await res.json()
        const entries: DayTimings[] = data.data.map(
          (d: { date: { gregorian: { date: string; weekday: { en: string } } }; timings: Record<string, string> }) => ({
            date: d.date.gregorian.date,
            day: new Date(
              Number(d.date.gregorian.date.split('-')[2]),
              Number(d.date.gregorian.date.split('-')[1]) - 1,
              Number(d.date.gregorian.date.split('-')[0])
            ).getDay(),
            timings: {
              Fajr: stripTimezone(d.timings.Fajr),
              Dhuhr: stripTimezone(d.timings.Dhuhr),
              Asr: stripTimezone(d.timings.Asr),
              Maghrib: stripTimezone(d.timings.Maghrib),
              Isha: stripTimezone(d.timings.Isha),
            },
          })
        )
        setDays(entries)
      } catch {
        setDays([])
      } finally {
        setLoading(false)
      }
    }
    fetchMonth()
  }, [lat, lng, month, year])

  function goPrev() {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function goNext() {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between p-6 pb-4">
        <button
          onClick={goPrev}
          className="p-2 rounded-lg hover:bg-muted/20 text-muted hover:text-foreground transition-colors"
          aria-label={t('prevMonth')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {t(`months.${month}`)} {year}
        </h2>
        <button
          onClick={goNext}
          className="p-2 rounded-lg hover:bg-muted/20 text-muted hover:text-foreground transition-colors"
          aria-label={t('nextMonth')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-muted">{t('loading' as never) ?? 'Loading...'}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/5">
                <th className="px-4 py-3 text-left font-medium text-muted">{t('date')}</th>
                <th className="px-4 py-3 text-left font-medium text-muted">{t('day')}</th>
                {PRAYER_KEYS.map((key) => (
                  <th key={key} className="px-4 py-3 text-center font-medium text-muted">
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d) => {
                const isToday = d.date === todayStr
                return (
                  <tr
                    key={d.date}
                    className={`border-b border-border last:border-0 transition-colors ${
                      isToday
                        ? 'bg-accent/20 font-semibold text-primary-dark'
                        : 'hover:bg-muted/5'
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {d.date.split('-')[0]}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {t(`days.${d.day}`)}
                    </td>
                    {PRAYERS.map((prayer) => (
                      <td key={prayer} className="px-4 py-3 text-center tabular-nums">
                        {d.timings[prayer]}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
