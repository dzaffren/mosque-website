import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
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

async function getEvents() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'events',
    sort: 'date', // Ascending (soonest first)
    where: {
      date: { greater_than_equal: new Date().toISOString() } 
    }
  })

  return result.docs
}

export default async function EventsPage() {
  const events = await getEvents()

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
          {events.length > 0 ? (
            events.map((event: any) => (
              <Link href={`/events/${event.id}`} key={event.id} className="block h-full group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                  
                  {/* --- IMAGE SECTION --- */}
                  <div className="relative h-48 w-full bg-slate-100">
                    {event.image && typeof event.image !== 'string' && event.image.url ? (
                      <Image
                        src={event.image.url}
                        alt={event.image.alt || event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 group-hover:bg-slate-200 transition-colors">
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
                    
                    <CardTitle className="text-xl min-h-[3.5rem] flex items-center group-hover:text-emerald-700 transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        {/* 👇 UPDATED: Use helper + new field name */}
                        <span>{formatTime(event.eventTime)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.attendees && (
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
              </Link>
            ))
          ) : (
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