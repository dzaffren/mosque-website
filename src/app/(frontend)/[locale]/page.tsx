import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PrayerTimesSection } from '@/components/PrayerTimesSection'

export default async function HomePage() {
  const t = await getTranslations()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch mosque settings for coordinates
  const settings = await payload.findGlobal({ slug: 'mosque-settings', depth: 1 })
  const lat = settings.mapCoordinates?.lat ?? 3.139
  const lng = settings.mapCoordinates?.lng ?? 101.6869

  // Fetch latest announcements
  const announcements = await payload.find({
    collection: 'announcements',
    sort: '-date',
    limit: 3,
  })

  // Fetch upcoming events
  const events = await payload.find({
    collection: 'events',
    where: { date: { greater_than_equal: new Date().toISOString() } },
    sort: 'date',
    limit: 3,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-dark text-white overflow-hidden">
        <IslamicPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            {t('home.welcome')}
          </h1>
          <p className="text-5xl md:text-7xl font-display font-bold text-accent mb-6">
            {settings.name || 'Masjid Al-Iman'}
          </p>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/donation"
              className="bg-accent text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors"
            >
              {t('nav.donation')} 💝
            </Link>
            {settings.whatsappGroupUrl && (
              <a
                href={settings.whatsappGroupUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <WhatsAppHeroIcon />
                {t('home.joinWhatsapp')}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Prayer Times Today — live from Aladhan API */}
      <PrayerTimesSection lat={lat} lng={lng} />

      {/* Latest Announcements */}
      {announcements.docs.length > 0 && (
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-foreground">
              {t('home.latestAnnouncements')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.docs.map((ann: any) => (
                <div key={ann.id} className="bg-background rounded-xl shadow-sm border border-border p-6">
                  {ann.priority === 'urgent' && (
                    <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded mb-2">
                      Urgent
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-2">{ann.title}</h3>
                  <p className="text-sm text-muted">
                    {new Date(ann.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.docs.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-foreground">
              {t('home.upcomingEvents')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.docs.map((event: any) => (
                <div key={event.id} className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
                  {event.featured && (
                    <span className="inline-block bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded mb-2">
                      {t('events.featured')}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-2">{event.title}</h3>
                  <p className="text-sm text-muted">
                    {new Date(event.date).toLocaleDateString()} · {event.location || ''}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/events" className="text-primary hover:text-primary-dark font-medium">
                {t('home.viewAll')} →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function IslamicPattern() {
  return (
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M30 20L40 30L30 40L20 30Z" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  )
}

function WhatsAppHeroIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
