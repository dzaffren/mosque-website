import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@/components/RichText'
import { DonationForm } from '@/components/DonationForm'
import Image from 'next/image'

export default async function DonationPage() {
  const t = await getTranslations('donation')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const settings = await payload.findGlobal({ slug: 'mosque-settings' })
  const donation = settings.donation as any

  const qrImageUrl = donation?.qrImage?.url
    ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}${donation.qrImage.url}`
    : null

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{t('title')}</h1>
          <p className="text-lg text-muted">{t('subtitle')}</p>
        </div>

        {/* Quran verse */}
        <div className="bg-primary-dark text-white rounded-2xl p-8 mb-12 text-center">
          <p className="text-lg italic mb-2 text-white/80">
            &ldquo;Who is it that would loan Allah a goodly loan so He may multiply it for him many times over?&rdquo;
          </p>
          <p className="text-sm text-accent">— Al-Baqarah 2:245</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* TayyibPay Payment Form */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded" />
              {t('onlinePay')}
            </h2>
            <DonationForm
              labels={{
                onlinePay: t('onlinePay'),
                selectAmount: t('selectAmount'),
                customAmount: t('customAmount'),
                donorName: t('donorName'),
                email: t('email'),
                phone: t('phone'),
                payNow: t('payNow'),
                processing: t('processing'),
                oneTime: t('oneTime'),
                monthly: t('monthly'),
                monthlyNote: t('monthlyNote'),
              }}
            />
            {/* TayyibPay trust badge */}
            <p className="text-xs text-muted text-center mt-4">
              Secured by{' '}
              <a href="https://toyyibpay.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                TayyibPay
              </a>
              {' '}· FPX · Credit/Debit Card · e-Wallet
            </p>
          </div>

          {/* QR Code or Bank Transfer */}
          <div className="space-y-6">
            {/* QR Code */}
            {qrImageUrl && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center">
                <h2 className="text-xl font-display font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                  <span className="w-6 h-1 bg-accent rounded" />
                  {t('scanQR')}
                </h2>
                <p className="text-sm text-muted mb-4">{t('orScanQR')}</p>
                <div className="flex justify-center">
                  <Image
                    src={qrImageUrl}
                    alt="DuitNow QR Code"
                    width={220}
                    height={220}
                    className="rounded-xl border border-border"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-1 bg-accent rounded" />
                {t('bankTransfer')}
              </h2>
              <div className="space-y-3">
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-muted mb-1">{t('bankName')}</p>
                  <p className="font-bold text-foreground">{donation?.bankName || 'Not configured'}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-muted mb-1">{t('accountName')}</p>
                  <p className="font-bold text-foreground">{donation?.accountName || 'Not configured'}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-muted mb-1">{t('accountNumber')}</p>
                  <p className="font-bold text-foreground font-mono">{donation?.accountNumber || 'Not configured'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {donation?.description && (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 mb-8 prose prose-stone max-w-none">
            <RichText data={donation.description} />
          </div>
        )}

        {/* Thank you */}
        <div className="text-center mt-8 text-lg text-muted">
          <p>🤲 {t('jazakAllah')}</p>
        </div>
      </div>
    </div>
  )
}
