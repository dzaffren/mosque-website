import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// 1. Define the shape of the Event data
interface MosqueEvent {
  _id: string
  title: string
  category: string
  date: string
  time: string
  location: string
  attendees: number
  description: string
  image: any
}

// 2. Fetch data, sorted by date (ascending)
async function getEvents() {
  const query = `
    *[_type == "event"] | order(date asc) {
      _id,
      title,
      category,
      date,
      time,
      location,
      attendees,
      description,
      image
    }
  `
  return await client.fetch(query)
}

export default async function EventsPage() {
  const events: MosqueEvent[] = await getEvents()

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Upcoming Events</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Join our community gatherings, classes, and special programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              
              {/* --- IMAGE SECTION (FIXED) --- */}
              {/* We wrap everything in a fixed height div (h-48) so all cards start at the same height */}
              <div className="relative h-48 w-full bg-slate-100">
                {event.image ? (
                  <Image
                    src={urlFor(event.image).url()}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  // FALLBACK: Simple gray background with icon
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <Calendar className="h-16 w-16 text-slate-300" />
                  </div>
                )}
              </div>
              
              {/* Content Section */}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                    {event.category || 'General'}
                  </Badge>
                  {/* Date Badge */}
                  <div className="flex flex-col items-center bg-slate-100 rounded-lg p-2 min-w-[60px]">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-slate-900 leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                </div>
                {/* Min-height ensures alignment if one title is longer than another */}
                <CardTitle className="text-xl min-h-[3.5rem] flex items-center">
                  {event.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.attendees > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-600" />
                      <span>Expected: {event.attendees} people</span>
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <p className="text-sm text-slate-500 line-clamp-3 mt-4 border-t pt-4">
                    {event.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {events.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No Upcoming Events</h3>
              <p className="text-slate-500">Check back later for new programs and gatherings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}