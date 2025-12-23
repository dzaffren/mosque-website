import Link from "next/link"
import Image from "next/image"
import { Clock, BookOpen, Calendar, MessageSquare, Heart, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DonationModal } from "@/components/donation-modal"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { NextPrayerCountdown } from "@/components/next-prayer-countdown"
import { PrayerTimesGrid } from "@/components/prayer-times-grid"

// --- DATA FETCHING (Kept the same) ---

async function getPrayerTimes() {
  try {
    const res = await fetch('http://localhost:3000/api/prayer-times/daily', {
      next: { revalidate: 60 },
    })
    
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    
    return {
      date: data.gregorian,
      hijri: data.hijri,
      prayers: data.prayers
    }
  } catch (error) {
    console.error("Prayer time fetch error:", error)
    return {
      date: new Date().toLocaleDateString(),
      hijri: "1445 AH",
      prayers: [
        { name: "Fajr", time: "05:00 AM" },
        { name: "Dhuhr", time: "12:30 PM" },
        { name: "Asr", time: "03:45 PM" },
        { name: "Maghrib", time: "06:30 PM" },
        { name: "Isha", time: "08:00 PM" },
      ]
    }
  }
}

async function gethadithOfDay() {
  try {
    // UPDATED: Path is now just /api/hadith
    const res = await fetch('http://localhost:3000/api/hadith', {
      next: { revalidate: 3600 },
    })
    
    if (!res.ok) throw new Error('Failed to fetch hadith')
    return await res.json()
    
  } catch (error) {
    console.error("hadith fetch error:", error)
    return {
      arabic: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
      translation: "Verily, with hardship comes ease.",
      reference: "Surah Ash-Sharh (94:6)",
    }
  }
}

async function getUpcomingEvents() {
  const query = `*[_type == "event"] | order(date asc)[0...3] {
    _id, title, date, time, description, image, category
  }`
  return await client.fetch(query)
}

async function getLatestNews() {
  const query = `*[_type == "news"] | order(publishedAt desc)[0...3] {
    _id, 
    title, 
    slug, // <--- Add this
    publishedAt, 
    excerpt, 
    category, 
    image
  }`
  return await client.fetch(query)
}

export default async function Home() {
  const [prayerTimes, hadithOfDay, upcomingEvents, latestNews] = await Promise.all([
    getPrayerTimes(),
    gethadithOfDay(),
    getUpcomingEvents(),
    getLatestNews()
  ])
  
  return (
    <div className="min-h-screen">
      
      {/* Hero Section: Reduced py-20 to py-12 to reduce height */}
      <section className="relative bg-gradient-to-b from-emerald-900 to-emerald-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">Welcome to Our Mosque</h1>
            <p className="text-base md:text-lg text-emerald-100 max-w-xl mx-auto text-balance">
              A place of worship, community, and spiritual growth
            </p>
          </div>
        </div>
      </section>
      
      {/* PRAYER TIMES SECTION */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          {/* Main Card: Reduced max-w-5xl to max-w-4xl for a tighter look */}
          <Card className="shadow-xl max-w-4xl mx-auto bg-white rounded-[2rem] border-none overflow-hidden ring-1 ring-slate-100">
            {/* Header: Reduced top padding pt-10 to pt-8 */}
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mb-6">
                <NextPrayerCountdown 
                  prayers={prayerTimes.prayers} 
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-emerald-600" />
                {/* Reduced font size text-2xl -> text-xl */}
                <CardTitle className="text-xl font-bold text-slate-800">Today's Prayer Times</CardTitle>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <p className="text-muted-foreground text-sm font-medium">{prayerTimes.date}</p>
                <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50/50 text-xs">
                  {prayerTimes.hijri || "Islamic Date"}
                </Badge>
              </div>
            </CardHeader>

            {/* Content: Reduced horizontal padding */}
            <CardContent className="px-4 md:px-8 pb-8">
              
              <PrayerTimesGrid prayers={prayerTimes.prayers} />

              <div className="mt-8 text-center">
                <Link href="/prayer-times">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-5 text-sm font-semibold shadow-md hover:shadow-xl transition-all">
                    View Monthly Schedule
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Hadith Section */}
      <section className="py-8 bg-emerald-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-sm border-emerald-200">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-700" />
                <CardTitle className="text-lg">Hadith of the Day</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-3 pt-2">
              <p className="text-2xl font-arabic text-emerald-900 leading-relaxed">{hadithOfDay.arabic}</p>
              <p className="text-lg text-foreground italic">"{hadithOfDay.translation}"</p>
              <p className="text-xs text-muted-foreground font-semibold">{hadithOfDay.reference}</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
{/* Events Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6 text-emerald-700" />
              Upcoming Events
            </h2>
            <p className="text-sm text-muted-foreground">Join us for community events and programs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: any) => (
                <Link href={`/events/${event.slug?.current || '#'}`} key={event._id} className="block h-full group">
                  <Card className="w-full h-full shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col rounded-2xl">
                    
                    {/* IMAGE AREA */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      {event.image ? (
                        <Image
                          src={urlFor(event.image).url()}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        // NO IMAGE FALLBACK - Clean (No Dots)
                        <div className="w-full h-full relative flex items-center justify-center bg-emerald-50/50 group-hover:bg-emerald-50/80 transition-colors duration-500">
                          {/* Just the Icon centered on soft green background */}
                          <div className="flex flex-col items-center justify-center text-emerald-200 group-hover:text-emerald-300 transition-colors">
                            <Calendar className="h-12 w-12" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONTENT AREA */}
                    <CardHeader className="p-5 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 text-[10px] uppercase font-bold px-2 py-0.5">
                          {event.category || 'Event'}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-lg font-bold leading-tight line-clamp-2 min-h-[3rem] group-hover:text-emerald-700 transition-colors">
                        {event.title}
                      </CardTitle>
                      
                      <p className="text-xs text-muted-foreground font-medium mt-1">
                        {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} • {event.time}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="p-5 pt-2 flex-grow">
                      <div className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                        {event.description 
                          ? event.description 
                          : "Join us for this community gathering. Click to view full details."}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="w-full col-span-1 md:col-span-3 text-center py-12 border border-dashed rounded-xl bg-white">
                <p className="text-muted-foreground text-sm">No upcoming events scheduled.</p>
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/events">
              <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-full px-8">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
{/* Latest News Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <FileText className="h-6 w-6 text-emerald-700" />
              Latest News
            </h2>
            <p className="text-sm text-muted-foreground">Updates from our community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {latestNews.length > 0 ? (
              latestNews.map((newsItem: any) => (
                <div key={newsItem._id} className="h-full">
                  <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow flex flex-col rounded-2xl bg-white border border-slate-100 overflow-hidden">
                    
                    {/* IMAGE AREA */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      {newsItem.image ? (
                        <Image
                          src={urlFor(newsItem.image).url()}
                          alt={newsItem.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        // NO IMAGE FALLBACK - Clean (No Dots)
                        <div className="w-full h-full relative flex items-center justify-center bg-emerald-50/50">
                          {/* Just the Icon centered */}
                          <div className="flex flex-col items-center justify-center text-emerald-200">
                            <FileText className="h-12 w-12" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <CardHeader className="p-5 pb-2">
                      <div className="flex justify-between items-center mb-3">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] font-bold px-2 py-0.5">
                          {newsItem.category || 'News'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(newsItem.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <CardTitle className="text-lg font-bold leading-tight line-clamp-2 min-h-[3rem] text-slate-800">
                        {newsItem.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-5 pt-0 flex-grow flex flex-col">
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {newsItem.excerpt}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50">
<Link 
          href={`/news/${newsItem.slug?.current || ''}`} 
          className="text-emerald-700 text-xs font-bold inline-flex items-center hover:underline group"
        >
          Read more <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="w-full col-span-1 md:col-span-3 text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No news updates yet.
              </div>
            )}
          </div>

          {/* ADDED: View All News Button */}
          <div className="mt-10 text-center">
            <Link href="/news">
              <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-full px-8">
                View All News
              </Button>
            </Link>
          </div>

        </div>
      </section>
      
      {/* Quick Actions */}
      <section className="py-10 bg-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto items-stretch">
            {/* Quick action cards code kept standard, just tighter gap */}
            <Card className="bg-emerald-800 border-emerald-700 text-white text-center h-full flex flex-col rounded-xl">
              <CardContent className="pt-6 flex flex-col flex-grow">
                <Heart className="h-10 w-10 mx-auto mb-3 text-emerald-200" />
                <h3 className="text-lg font-semibold mb-1">Donate</h3>
                <p className="text-emerald-100 mb-4 text-xs flex-grow">Support our mosque</p>
                <div className="mt-auto"><DonationModal /></div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-800 border-emerald-700 text-white text-center h-full flex flex-col rounded-xl">
              <CardContent className="pt-6 flex flex-col flex-grow">
                <MessageSquare className="h-10 w-10 mx-auto mb-3 text-emerald-200" />
                <h3 className="text-lg font-semibold mb-1">Ask a Question</h3>
                <p className="text-emerald-100 mb-4 text-xs flex-grow">Get answers instantly</p>
                <div className="mt-auto"><Button variant="secondary" size="sm" className="w-full">Chat Now</Button></div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-800 border-emerald-700 text-white text-center h-full flex flex-col rounded-xl">
              <CardContent className="pt-6 flex flex-col flex-grow">
                <Calendar className="h-10 w-10 mx-auto mb-3 text-emerald-200" />
                <h3 className="text-lg font-semibold mb-1">Friday Prayer</h3>
                <p className="text-emerald-100 mb-4 text-xs flex-grow">View Khutbah schedule</p>
                <div className="mt-auto">
                   <Link href="/friday-prayer" className="w-full block">
                    <Button variant="secondary" size="sm" className="w-full">View Details</Button>
                   </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}