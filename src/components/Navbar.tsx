'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/prayer-times', key: 'prayerTimes' },
  { href: '/about', key: 'about' },
  { href: '/events', key: 'events' },
  { href: '/jumuah', key: 'jumuah' },
  { href: '/gallery', key: 'gallery' },
  { href: '/donation', key: 'donation' },
  { href: '/contact', key: 'contact' },
] as const

interface NavbarProps {
  mosqueName?: string
  logo?: Media | null
}

export function Navbar({ mosqueName = 'Masjid Al-Iman', logo }: NavbarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary-dark text-white shadow-lg">
      {/* Geometric accent bar */}
      <div className="h-1 bg-gradient-to-r from-accent via-primary-light to-accent" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Mosque name */}
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            {logo?.url ? (
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={logo.url}
                  alt={mosqueName}
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
            ) : (
              <MosqueIcon />
            )}
            <span className="hidden sm:inline">{mosqueName}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 ${
                  pathname === href ? 'bg-white/20' : ''
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </div>

          {/* Language switcher + mobile toggle */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} />
            <button
              className="lg:hidden p-2 rounded-md hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            {navLinks.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 ${
                  pathname === href ? 'bg-white/20' : ''
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {t(key)}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  return (
    <div className="flex items-center gap-1 text-sm">
      <Link
        href={pathname}
        locale="en"
        className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="ms"
        className={`px-2 py-1 rounded ${locale === 'ms' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
      >
        MS
      </Link>
    </div>
  )
}

function MosqueIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C12 3 8 7 8 10V20H16V10C16 7 12 3 12 3Z" />
      <path d="M4 20V14C4 12 6 10 6 10" />
      <path d="M20 20V14C20 12 18 10 18 10" />
      <line x1="2" y1="20" x2="22" y2="20" />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
