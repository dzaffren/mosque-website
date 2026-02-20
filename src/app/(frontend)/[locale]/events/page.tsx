import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function EventsPage() {
  const t = await getTranslations('events')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const now = new Date().toISOString()

  const upcoming = await payload.find({
    collection: 'events',
    where: { date: { greater_than_equal: now } },
    sort: 'date',
    limit: 20,
  })

  const past = await payload.find({
    collection: 'events',
    where: { date: { less_than: now } },
    sort: '-date',
    limit: 10,
  })

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{t('title')}</h1>
          <p className="text-lg text-muted">{t('subtitle')}</p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t('upcoming')}</h2>
          {upcoming.docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.docs.map((event: any) => (
                <EventCard key={event.id} event={event} t={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <p className="text-muted">{t('noEvents')}</p>
            </div>
          )}
        </section>

        {/* Past Events */}
        {past.docs.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t('past')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {past.docs.map((event: any) => (
                <EventCard key={event.id} event={event} t={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function EventCard({ event, t }: { event: any; t: any }) {
  const date = new Date(event.date)
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      {event.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={(event.image as any).url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {event.featured && (
          <span className="inline-block bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded mb-2">
            {t('featured')}
          </span>
        )}
        <h3 className="text-lg font-bold text-foreground mb-2">{event.title}</h3>
        <div className="space-y-1 text-sm text-muted">
          <p>📅 {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          {event.location && <p>📍 {event.location}</p>}
        </div>
      </div>
    </div>
  )
}
