import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SetLocale } from '@/components/SetLocale'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: {
      default: 'Masjid Al-Iman',
      template: '%s | Masjid Al-Iman',
    },
    description: t('home.heroSubtitle'),
    openGraph: {
      title: 'Masjid Al-Iman',
      description: t('home.heroSubtitle'),
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : 'en_US',
    },
    icons: { icon: '/favicon.ico' },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const settings = await payload.findGlobal({ slug: 'mosque-settings' })
  const whatsappGroupUrl = (settings.whatsappGroupUrl as string | undefined) || ''

  return (
    <NextIntlClientProvider messages={messages}>
      <SetLocale locale={locale} />
      <Navbar />
      <main className="min-h-[calc(100vh-160px)]">{children}</main>
      <Footer whatsappGroupUrl={whatsappGroupUrl} />
    </NextIntlClientProvider>
  )
}
