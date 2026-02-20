import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@/components/RichText'

async function getDhuhrTime(lat: number, lng: number): Promise<string> {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=3`,
    { next: { revalidate: 3600 } },
  )
  const data = await res.json()
  const raw: string = data?.data?.timings?.Dhuhr || '12:30'
  return raw.replace(/\s*\(.*\)$/, '')
}

export default async function JumuahPage() {
  const t = await getTranslations('jumuah')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const settings = await payload.findGlobal({ slug: 'mosque-settings' })
  const jumuah = settings.jumuah
  const sermonPortal = (settings as any).sermonPortal as { name?: string; url?: string } | undefined
  const coords = settings.mapCoordinates as { latitude?: number; longitude?: number } | undefined
  const lat = coords?.latitude ?? 3.1390
  const lng = coords?.longitude ?? 101.6869

  const dhuhrTime = await getDhuhrTime(lat, lng)

  const today = new Date().toISOString().split('T')[0]

  // Fetch upcoming khutbahs
  const khutbahs = await payload.find({
    collection: 'khutbah-schedule',
    where: { date: { greater_than_equal: today } },
    sort: 'date',
    limit: 10,
  })

  // Fetch past khutbahs
  const pastKhutbahs = await payload.find({
    collection: 'khutbah-schedule',
    where: { date: { less_than: today } },
    sort: '-date',
    limit: 5,
  })

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{t('title')}</h1>
          <p className="text-lg text-muted">{t('subtitle')}</p>
        </div>

        {/* Prayer Time from Aladhan API */}
        <div className="bg-background rounded-2xl border border-border shadow-sm p-8 mb-12 text-center">
          <p className="text-sm text-muted uppercase tracking-wider mb-2">{t('time')}</p>
          <p className="text-5xl font-display font-bold text-primary-dark">{dhuhrTime}</p>
          <p className="mt-4 text-muted">{t('arriveEarly')}</p>
        </div>

        {/* Upcoming Khutbahs */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-accent rounded" />
            {t('khutbah')}
          </h2>
          {khutbahs.docs.length > 0 ? (
            <div className="space-y-4">
              {khutbahs.docs.map((k: any) => (
                <div key={k.id} className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="bg-primary/10 rounded-lg p-3 text-center sm:w-24 shrink-0">
                    <p className="text-xs text-muted uppercase">
                      {new Date(k.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-primary-dark">
                      {new Date(k.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{k.topic}</h3>
                    <p className="text-sm text-muted">{t('speaker')}: {k.speaker}</p>
                    {k.notes && <p className="text-sm text-muted mt-1">{k.notes}</p>}
                  </div>
                  {k.sermonPdfUrl && (
                    <a
                      href={k.sermonPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 text-primary-dark font-semibold text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t('downloadSermon')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card rounded-2xl border border-border">
              <p className="text-muted">No upcoming khutbahs scheduled. Add them in the admin panel.</p>
            </div>
          )}
        </section>

        {/* External Sermon Portal */}
        {sermonPortal?.url && sermonPortal?.name && (
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded" />
              {t('sermonPortal')}
            </h2>
            <a
              href={sermonPortal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card rounded-2xl border border-border shadow-sm p-8 text-center hover:border-primary transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-primary group-hover:text-primary-dark transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <p className="text-lg font-semibold text-foreground group-hover:text-primary-dark transition-colors">
                {t('viewOnPortal')} {sermonPortal.name}
              </p>
              <p className="text-sm text-muted mt-1">{sermonPortal.url}</p>
            </a>
          </section>
        )}

        {/* Past Khutbahs */}
        {pastKhutbahs.docs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-display font-bold text-muted mb-4">{t('previous')}</h2>
            <div className="space-y-3 opacity-75">
              {pastKhutbahs.docs.map((k: any) => (
                <div key={k.id} className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <p className="text-sm text-muted w-24 shrink-0">
                    {new Date(k.date).toLocaleDateString()}
                  </p>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{k.topic}</p>
                    <p className="text-sm text-muted">{k.speaker}</p>
                  </div>
                  {k.sermonPdfUrl && (
                    <a
                      href={k.sermonPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium transition-colors shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guidelines */}
        {jumuah?.guidelines && (
          <section>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded" />
              {t('guidelines')}
            </h2>
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 prose prose-stone max-w-none">
              <RichText data={jumuah.guidelines} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
