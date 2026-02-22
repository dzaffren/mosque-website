import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { MonthlyPrayerCalendar } from '@/components/MonthlyPrayerCalendar'

export default async function PrayerTimesPage() {
  const t = await getTranslations('prayer')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch mosque settings for coordinates
  const settings = await payload.findGlobal({ slug: 'mosque-settings', depth: 1 })
  const lat = settings.mapCoordinates?.lat ?? 3.139
  const lng = settings.mapCoordinates?.lng ?? 101.6869

  // Fetch this week's imam/bilal roster
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)

  const roster = await payload.find({
    collection: 'prayer-roster',
    where: {
      date: {
        greater_than_equal: startOfWeek.toISOString().split('T')[0],
        less_than_equal: endOfWeek.toISOString().split('T')[0],
      },
    },
    sort: 'date',
    limit: 7,
  })

  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
  const dayNames = ['0', '1', '2', '3', '4', '5', '6'] as const

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{t('title')}</h1>
          <p className="text-lg text-muted">{t('subtitle')}</p>
        </div>

        {/* Monthly Prayer Calendar */}
        <div className="mb-12">
          <MonthlyPrayerCalendar lat={lat} lng={lng} />
        </div>

        {/* Weekly Imam & Bilal Roster */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <h2 className="text-2xl font-display font-bold p-6 pb-4 text-foreground">
            {t('roster')}
          </h2>
          <div className="overflow-x-auto">
            {roster.docs.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/5">
                    <th className="px-4 py-3 text-left font-medium text-muted">{t('day')}</th>
                    {prayers.map((prayer) => (
                      <th key={prayer} className="px-4 py-3 text-center font-medium text-muted">
                        {t(prayer)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roster.docs.map((entry) => {
                    const date = new Date(entry.date as string)
                    const dayIdx = date.getDay()
                    const today = new Date()
                    const isToday =
                      date.getFullYear() === today.getFullYear() &&
                      date.getMonth() === today.getMonth() &&
                      date.getDate() === today.getDate()
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b border-border last:border-0 ${
                          isToday ? 'bg-primary/10 font-semibold' : ''
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {t(`days.${dayNames[dayIdx]}`)}
                          {isToday && (
                            <span className="ml-2 inline-block bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold">
                              {t('today')}
                            </span>
                          )}
                        </td>
                        {prayers.map((prayer) => {
                          const prayerData = (entry as unknown as Record<string, { imam?: string; bilal?: string }>)[prayer]
                          return (
                            <td key={prayer} className="px-4 py-3 text-center">
                              {prayerData?.imam || prayerData?.bilal ? (
                                <div className="space-y-0.5">
                                  {prayerData.imam && (
                                    <p className="text-foreground text-xs">
                                      <span className="text-muted">{t('imam')}:</span> {prayerData.imam}
                                    </p>
                                  )}
                                  {prayerData.bilal && (
                                    <p className="text-foreground text-xs">
                                      <span className="text-muted">{t('bilal')}:</span> {prayerData.bilal}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-muted">
                {t('noRoster')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
