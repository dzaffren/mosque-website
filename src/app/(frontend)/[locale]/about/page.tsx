import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@/components/RichText'

export default async function AboutPage() {
  const t = await getTranslations('about')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const settings = await payload.findGlobal({ slug: 'mosque-settings', depth: 1 })
  const staffResult = await payload.find({
    collection: 'staff',
    sort: 'order',
    limit: 20,
  })

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{t('title')}</h1>
        </div>

        {/* History */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-accent rounded" />
            {t('history')}
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 prose prose-stone max-w-none">
            {settings.about?.history ? (
              <RichText data={settings.about.history} />
            ) : (
              <p className="text-muted italic">
                Add your mosque&apos;s history in the admin panel under Mosque Settings.
              </p>
            )}
          </div>
        </section>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-accent rounded" />
            {t('mission')}
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 prose prose-stone max-w-none">
            {settings.about?.mission ? (
              <RichText data={settings.about.mission} />
            ) : (
              <p className="text-muted italic">
                Add your mosque&apos;s mission in the admin panel under Mosque Settings.
              </p>
            )}
          </div>
        </section>

        {/* Staff */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-accent rounded" />
            {t('team')}
          </h2>
          {staffResult.docs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffResult.docs.map((member: any) => (
                <div key={member.id} className="bg-card rounded-2xl shadow-sm border border-border p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {member.photo ? (
                      <img
                        src={(member.photo as any).url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-primary">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-accent font-medium capitalize mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-muted">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted italic text-center py-8">
              Add staff members in the admin panel.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
