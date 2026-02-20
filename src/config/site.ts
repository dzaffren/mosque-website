/**
 * Central site configuration — customize per mosque deployment.
 */
export const siteConfig = {
  name: 'Masjid Al-Iman',
  tagline: 'A place of worship, community, and learning',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms'] as const,
  colors: {
    primary: '#059669',
    primaryDark: '#064E3B',
    accent: '#D4AF37',
    background: '#FAFAF9',
    foreground: '#1C1917',
  },
  socials: {
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
  },
  contact: {
    phone: '+60 12-345 6789',
    email: 'info@masjid-aliman.com',
    address: '123 Jalan Masjid, Kuala Lumpur, Malaysia',
  },
  donation: {
    bankName: 'Bank Islam Malaysia',
    accountName: 'Masjid Al-Iman',
    accountNumber: '1234567890',
  },
}

export type SiteConfig = typeof siteConfig
export type Locale = (typeof siteConfig.locales)[number]
