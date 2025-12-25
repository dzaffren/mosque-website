import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, FileText, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// 👇 1. Payload Imports
import { getPayload } from 'payload'
import config from '@payload-config'

// 2. Fetch News from Payload
async function getNews() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'news',
    sort: '-publishedAt', // Newest first
  })

  return result.docs
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Community News</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Stay updated with the latest announcements, articles, and updates from our mosque.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item: any) => (
              <Card key={item.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                
                {/* Image Section */}
                <div className="relative h-56 w-full bg-slate-100">
                  {item.image && typeof item.image !== 'string' && item.image.url ? (
                    <Image
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    // Fallback Icon
                    <div className="flex h-full w-full items-center justify-center bg-slate-100">
                      <FileText className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                      {item.category || 'General'}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 hover:text-emerald-700 transition-colors">
                    <Link href={`/news/${item.slug || ''}`}>
                      {item.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col pt-0">
                  {/* Author Line */}
                  <div className="mb-4 text-xs text-slate-500 flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{item.author || 'Admin'}</span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {item.excerpt || "Click below to read the full details of this announcement."}
                  </p>

                  {/* Read More Button */}
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <Link href={`/news/${item.slug || ''}`}>
                      <Button variant="ghost" className="p-0 text-emerald-700 hover:text-emerald-800 hover:bg-transparent font-semibold h-auto flex items-center gap-1 group">
                        Read Full Article 
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No News Yet</h3>
              <p className="text-slate-500">Check back later for community updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}