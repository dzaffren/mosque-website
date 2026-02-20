import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ pledge?: string }>
}) {
  const t = await getTranslations('donation')
  const params = await searchParams
  const isPledge = params.pledge === '1'

  return (
    <div className="py-24">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">
          {isPledge ? t('thankYouMonthly') : t('thankYou')}
        </h1>
        <p className="text-lg text-muted mb-8">
          {isPledge ? t('monthlyNote') : t('thankYouSubtitle')}
        </p>
        <p className="text-xl mb-8">🤲 {t('jazakAllah')}</p>
        <Link
          href="/"
          className="inline-block bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
        >
          {t('returnHome')}
        </Link>
      </div>
    </div>
  )
}
