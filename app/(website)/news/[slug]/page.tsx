import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
// 1. IMPORT THE RENDERER
import { PortableText } from '@portabletext/react'

async function getArticle(slug: string) {
  const query = `
    *[_type == "news" && slug.current == $slug][0] {
      title,
      category,
      publishedAt,
      author,
      image,
      excerpt,
      content 
    }
  `
  return await client.fetch(query, { slug })
}

export default async function SingleNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-white pb-20 pt-8">
      {/* --- HERO HEADER --- */}
      <div className="container mx-auto px-4 max-w-4xl text-center mb-10">
        <Link href="/news">
          <Button variant="ghost" className="mb-8 text-slate-500 hover:text-emerald-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </Link>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1">
            {article.category || 'News'}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          {article.title}
        </h1>


<div className="flex items-center justify-center gap-6 text-slate-600 font-medium border-t border-slate-100 pt-6">
  {/* PASTE THE DATE SPAN HERE */}

  {article.author && (
    <div className="flex items-center gap-2 text-sm">
       <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
         <User className="h-3 w-3 text-slate-400" />
       </div>
       By {article.author}
    </div>
  )}
  <span className="flex items-center text-sm">
    <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
    {new Date(article.publishedAt).toLocaleDateString()}
  </span>
</div>
      </div>

      {/* --- MAIN IMAGE --- */}
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
          {article.image ? (
            <Image
              src={urlFor(article.image).url()}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <FileText className="h-20 w-20 text-slate-300" />
            </div>
          )}
        </div>
      </div>

      {/* --- ARTICLE CONTENT --- */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg prose-emerald mx-auto text-slate-700 leading-relaxed">
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 border-l-4 border-emerald-500 pl-4 bg-emerald-50/50 py-4 pr-4 rounded-r-lg">
            {article.excerpt}
          </p>

          <div className="space-y-6">
             {/* 2. RENDER THE CONTENT FROM SANITY HERE */}
             {article.content ? (
               <PortableText value={article.content} />
             ) : (
               <p className="italic text-slate-400">No additional content available.</p>
             )}
          </div>
        </div>
      </div>
    </article>
  )
}