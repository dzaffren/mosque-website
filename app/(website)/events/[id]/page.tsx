import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPayload } from 'payload'
import config from '@payload-config'

// 👇 Helper: Format Date object to "5:00 PM"
const formatTime = (dateString: string) => {
  if (!dateString) return 'Time TBA'
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

async function getEvent(id: string) {
  const payload = await getPayload({ config })
  
  try {
    const result = await payload.findByID({
      collection: 'events',
      id: id,
    })
    return result
  } catch (error) {
    return null
  }
}

export default async function SingleEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const imageUrl = (event.image && typeof event.image === 'object') ? event.image.url : null
  const imageAlt = (event.image && typeof event.image === 'object') ? event.image.alt : event.title

  return (
    <article className="min-h-screen bg-slate-50 pb-20 pt-8">
      {/* --- HERO HEADER --- */}
      <div className="container mx-auto px-4 max-w-4xl mb-10">
        <Link href="/events">
          <Button variant="ghost" className="mb-8 text-slate-500 hover:text-emerald-700 p-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
          {/* Image Banner */}
          <div className="relative w-full h-[300px] md:h-[400px] bg-slate-200">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt || 'Event Image'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Calendar className="h-20 w-20 text-slate-300" />
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-sm font-bold px-3 py-1">
                {event.category || 'Event'}
              </Badge>
              {/* Date Badge */}
              <span className="flex items-center text-slate-600 font-medium text-sm">
                <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-8">
              {event.title}
            </h1>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-slate-100 py-8 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time</p>
                  {/* 👇 UPDATED: Use helper + new field name */}
                  <p className="font-semibold text-slate-900">{formatTime(event.eventTime)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="font-semibold text-slate-900">{event.location || 'Main Hall'}</p>
                </div>
              </div>

              {event.attendees && (
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity</p>
                    <p className="font-semibold text-slate-900">{event.attendees} People</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg prose-emerald text-slate-600 max-w-none">
              <h3 className="text-xl font-bold text-slate-900 mb-4">About this Event</h3>
              <p className="leading-relaxed whitespace-pre-wrap">
                {event.description || "No further details provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}