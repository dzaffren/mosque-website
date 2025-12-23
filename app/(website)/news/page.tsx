import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from 'lucide-react'
import Image from "next/image"
import Link from "next/link" // <--- Import Link

// 1. Define the shape of the data
interface NewsArticle {
  _id: string
  title: string
  slug: { current: string } // <--- Added slug
  category: string
  author: string
  publishedAt: string
  excerpt: string
  image: any
}

// 2. Fetch data (Added 'slug' to query)
async function getNews() {
  const query = `
    *[_type == "news"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      author,
      publishedAt,
      excerpt,
      image
    }
  `
  return await client.fetch(query)
}

export default async function NewsPage() {
  const newsArticles: NewsArticle[] = await getNews()

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Community News</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Updates, announcements, and stories from our mosque community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            // 3. Wrap everything in a Link using the slug
<Link 
              href={article.slug?.current ? `/news/${article.slug.current}` : '#'} 
              key={article._id} 
              className="block h-full group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                
                {/* Image Section with Fallback */}
                <div className="relative h-48 w-full bg-slate-200">
                  {article.image ? (
                    <Image
                      src={urlFor(article.image).url()}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100">
                      <FileText className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge variant="outline" className="capitalize">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between w-full">
                    <span className="text-xs text-slate-500 font-medium">
                      By {article.author}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Article →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {newsArticles.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No news articles found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}