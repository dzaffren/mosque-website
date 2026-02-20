import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ContactForm } from '@/components/ContactForm'

export default async function ContactPage() {
  const t = await getTranslations('contact')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const settings = await payload.findGlobal({ slug: 'mosque-settings' })
  const whatsappUrl = settings.whatsappGroupUrl as string | undefined

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{t('title')}</h1>
          <p className="text-lg text-muted">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
            <ContactForm />
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-lg">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{t('address')}</h3>
                  <p className="text-muted text-sm">{settings.address || 'Address not set'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-lg">📞</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{t('phone')}</h3>
                  <p className="text-muted text-sm">{settings.phone || 'Phone not set'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-lg">✉️</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email</h3>
                  <p className="text-muted text-sm">{settings.email || 'Email not set'}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <h3 className="font-bold text-foreground p-6 pb-0">{t('findUs')}</h3>
              <div className="aspect-video p-6 pt-4">
                <iframe
                  src={`https://www.google.com/maps?q=${settings.mapCoordinates?.lat || 3.139},${settings.mapCoordinates?.lng || 101.6869}&output=embed`}
                  width="100%"
                  height="100%"
                  className="rounded-lg border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mosque Location"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Group */}
        {whatsappUrl && (
          <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
              <WhatsAppIcon />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">{t('whatsappGroup')}</h2>
            <p className="text-muted mb-6 max-w-md mx-auto">{t('whatsappDesc')}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              <WhatsAppIcon />
              {t('joinWhatsapp')}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

