'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

interface GalleryImage {
  id: string
  caption?: string
  category?: string
  image: { url: string; alt?: string }
}

export default function GalleryPage() {
  const t = useTranslations('gallery')
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/gallery?limit=50&depth=1')
      .then((res) => res.json())
      .then((data) => setImages(data.docs || []))
      .catch(() => {})
  }, [])

  const categories = ['all', 'general', 'events', 'ramadan', 'eid', 'community', 'mosque']
  const filtered = filter === 'all' ? images : images.filter((img) => img.category === filter)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{t('title')}</h1>
          <p className="text-lg text-muted">{t('subtitle')}</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border text-muted hover:bg-primary/10'
              }`}
            >
              {cat === 'all' ? t('all') : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setLightbox(item.image.url)}
              >
                <img
                  src={item.image.url}
                  alt={item.caption || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <p className="text-muted">{t('noImages')}</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-accent"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
