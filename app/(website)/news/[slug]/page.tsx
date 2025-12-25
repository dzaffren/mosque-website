import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
// 👇 1. Payload Imports
import { getPayload } from 'payload'
import config from '@payload-config'
import React, { Fragment } from 'react'

// --- HELPER: LEXICAL SERIALIZER (Renders Payload Rich Text) ---
// This converts the JSON from the database into HTML for your page
// REPLACE YOUR EXISTING SerializeLexical FUNCTION WITH THIS:

const SerializeLexical = ({ nodes }: { nodes: any[] }) => {
  if (!nodes || !Array.isArray(nodes)) return null

  return (
    <>
      {nodes.map((node, i) => {
        if (!node) return null

        // 1. Handle Text & formatting (Bold, Italic, etc.)
        if (node.type === 'text') {
          let text = <>{node.text}</>
          if (node.format & 1) text = <strong>{text}</strong>
          if (node.format & 2) text = <em className="italic">{text}</em>
          if (node.format & 8) text = <u>{text}</u>
          // Handle code format if needed (format & 16)
          return <Fragment key={i}>{text}</Fragment>
        }

        const serializedChildren = node.children ? <SerializeLexical nodes={node.children} /> : null

        // 2. Handle Block Types
        switch (node.type) {
          // ✅ FIX: Headings are now type 'heading' with a 'tag' property
          case 'heading':
            switch (node.tag) {
              case 'h1': return <h1 key={i} className="text-4xl font-bold mb-4 mt-8 text-slate-900">{serializedChildren}</h1>
              case 'h2': return <h2 key={i} className="text-3xl font-bold mb-3 mt-8 text-slate-900">{serializedChildren}</h2>
              case 'h3': return <h3 key={i} className="text-2xl font-bold mb-3 mt-6 text-slate-800">{serializedChildren}</h3>
              case 'h4': return <h4 key={i} className="text-xl font-bold mb-2 mt-4 text-slate-800">{serializedChildren}</h4>
              default: return <h2 key={i} className="text-3xl font-bold mb-3 mt-8">{serializedChildren}</h2>
            }
          
          // ✅ FIX: Lists are type 'list' with 'listType' property
          case 'list':
            if (node.listType === 'number') {
              return <ol key={i} className="list-decimal pl-6 mb-4 space-y-1">{serializedChildren}</ol>
            } else {
              return <ul key={i} className="list-disc pl-6 mb-4 space-y-1">{serializedChildren}</ul>
            }
            
          case 'listitem': 
            return <li key={i}>{serializedChildren}</li>

          case 'quote':
            return <blockquote key={i} className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 my-4">{serializedChildren}</blockquote>

          case 'link': 
            return (
              <a key={i} href={node.fields?.url} target={node.fields?.newTab ? '_blank' : '_self'} className="text-emerald-700 underline hover:text-emerald-500">
                {serializedChildren}
              </a>
            )

          case 'paragraph':
            // Prevent empty paragraphs from taking up space
            if (node.children.length === 0 || (node.children.length === 1 && node.children[0].text === '')) {
              return <br key={i} />
            }
            return <p key={i} className="mb-4 text-slate-700 leading-relaxed">{serializedChildren}</p>
            
          default: 
            return <Fragment key={i}>{serializedChildren}</Fragment>
        }
      })}
    </>
  )
}

// --- DATA FETCHING ---
async function getArticle(slug: string) {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })

  return result.docs[0] || null
}

export default async function SingleNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  // Helper to safely get Image URL
    const imageUrl = (article.image && typeof article.image === 'object') ? article.image.url : null
    const imageAlt = (article.image && typeof article.image === 'object') ? article.image.alt : article.title

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
{new Date(article.publishedAt || Date.now()).toLocaleDateString()}
</span>
        </div>
      </div>

      {/* --- MAIN IMAGE --- */}
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || 'News Image'}
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
          {/* Excerpt/Summary Box */}
          {article.excerpt && (
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 border-l-4 border-emerald-500 pl-4 bg-emerald-50/50 py-4 pr-4 rounded-r-lg">
              {article.excerpt}
            </p>
          )}

          <div className="space-y-6">
             {/* 2. RENDER THE PAYLOAD CONTENT */}
             {article.content && article.content.root && article.content.root.children ? (
               <SerializeLexical nodes={article.content.root.children} />
             ) : (
               <p className="italic text-slate-400">No additional content available.</p>
             )}
          </div>
        </div>
      </div>
    </article>
  )
}