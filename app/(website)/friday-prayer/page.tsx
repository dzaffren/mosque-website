import { Calendar, Clock, User, Mic2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { client } from '@/sanity/lib/client'

async function getFridayPrayerInfo() {
  try {
    const sanityQuery = `{
      "sermon": *[_type == "fridayPrayer"] | order(publishedAt desc)[0],
      "roster": *[_type == "weeklySchedule"][0]
    }`
    
    const [sanityData, prayerRes] = await Promise.all([
      client.fetch(sanityQuery),
      fetch('http://localhost:3000/api/prayer-times/monthly', { cache: 'no-store' })
    ])

    const prayerData = await prayerRes.json()
    
    // 1. Get today's date at midnight for accurate comparison
    const now = new Date()
    const todayAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // 2. Find the upcoming Friday from the Prayer API
    const upcomingFriday = prayerData.days?.find((day: any) => {
      const dayDate = new Date(day.date) 
      return day.weekday === 'Friday' && dayDate >= todayAtMidnight
    })

    // 3. Target the Dhuhr slot in the Weekly Roster
    const jumuahRoster = sanityData.roster?.friday?.dhuhr || {}

    // 4. Return with hardcoded fallbacks for the Sermon fields
    return {
      // Sermon Fallbacks
      title: sanityData.sermon?.title || "Sermon Title Pending",
      summary: sanityData.sermon?.summary || "Details for this week's khutbah will be updated shortly. Please check back soon.",
      topics: sanityData.sermon?.topics || ["Community", "Prayer"],
      
      // Schedule Fallbacks
      // Priority: 1. API Date -> 2. Sermon Date -> 3. Today (calculated)
      date: upcomingFriday?.date || sanityData.sermon?.publishedAt || todayAtMidnight.toISOString(),
      
      // Priority: 1. API Time -> 2. Roster Time -> 3. Default 1:15 PM
      time: upcomingFriday?.timings?.Dhuhr || jumuahRoster.time || "1:15 PM",
      
      // Personnel Fallbacks
      imam: jumuahRoster.imam || "To be announced",
      bilal: jumuahRoster.bilal || "To be announced"
    }
  } catch (error) {
    console.error("Error fetching Friday info:", error)
    // Absolute safety return to prevent the page from crashing
    return {
      title: "Schedule Unavailable",
      summary: "We are currently experiencing technical difficulties loading the schedule.",
      topics: [],
      date: new Date().toISOString(),
      time: "1:15 PM",
      imam: "TBA",
      bilal: "TBA"
    }
  }
}

export default async function FridayPrayerPage() {
  const fridayInfo = await getFridayPrayerInfo()

  if (!fridayInfo) return <div>Error loading schedule.</div>

  // Clean the date string for formatting (e.g., "26 December 2025")
  const formattedDate = new Date(fridayInfo.date).toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  })

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">Friday Prayer (Jumuah)</h1>
          <p className="text-muted-foreground text-lg">Weekly congregation and sermon</p>
        </div>

        {/* HERO CARD: Automated Date and Time from API */}
        <Card className="mb-6 shadow-lg bg-emerald-700 text-white border-none">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-emerald-200" />
                <div>
                  <p className="text-emerald-100 text-sm">Upcoming Friday</p>
                  <p className="text-xl font-semibold" suppressHydrationWarning>
                    {formattedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-emerald-200" />
                <div>
                  <p className="text-emerald-100 text-sm">Prayer Time (Dhuhr)</p>
                  <p className="text-xl font-semibold">{fridayInfo.time}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SERMON CARD: Detailed Info */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-emerald-600">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">This Week's Sermon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">{fridayInfo.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {fridayInfo.topics?.map((topic: string) => (
                  <Badge key={topic} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-slate-500 uppercase text-xs tracking-wider">Summary</h4>
              <p className="leading-relaxed text-slate-700">{fridayInfo.summary}</p>
            </div>

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Khatib / Imam</p>
                  <p className="font-bold text-slate-900">{fridayInfo.imam}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Mic2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Bilal</p>
                  <p className="font-bold text-slate-900">{fridayInfo.bilal}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Guidelines */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Friday Prayer Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Before You Arrive:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Perform ghusl (full ablution) and wear your best clean clothes</li>
                  <li>Apply perfume or fragrance (for men)</li>
                  <li>Arrive early to secure a spot and perform sunnah prayers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">During the Khutbah:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Listen attentively to the sermon</li>
                  <li>Refrain from talking or using mobile devices</li>
                  <li>Avoid unnecessary movement</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Parking & Facilities:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Parking is available in the main lot and overflow areas</li>
                  <li>Separate prayer areas for men and women</li>
                  <li>Wudu (ablution) facilities available on-site</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

