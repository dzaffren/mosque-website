import { Calendar, Clock, User, Mic2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPayload } from 'payload'
import config from '@payload-config'

async function getFridayPrayerInfo() {
  try {
    const payload = await getPayload({ config })

    const [sermonRes, rosterRes, prayerRes] = await Promise.all([
      // 1. Get latest Sermon
      payload.find({
        collection: 'friday-prayer',
        sort: '-publishedAt',
        limit: 1,
      }),
      // 2. Get Weekly Schedule (UPDATED)
      payload.find({
        collection: 'weekly-schedules', // ✅ Use Plural Slug
        sort: '-startDate',             // ✅ Get the Latest Week
        limit: 1, 
      }),
      // 3. Get accurate prayer times from API
      fetch('http://localhost:3000/api/prayer-times/monthly', { cache: 'no-store' })
    ])

    const sermon = sermonRes.docs[0] || null
    const roster = rosterRes.docs[0] || null
    const prayerData = await prayerRes.json()
    
    // --- DATE LOGIC ---
    const now = new Date()
    const todayAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const upcomingFriday = prayerData.days?.find((day: any) => {
      const dayDate = new Date(day.date) 
      return day.weekday === 'Friday' && dayDate >= todayAtMidnight
    })

    const jumuahRoster = roster?.friday?.dhuhr || {}

    return {
      title: sermon?.title || "Sermon Title Pending",
      summary: sermon?.summary || "Details for this week's khutbah will be updated shortly.",
      topics: sermon?.topics?.map((t: any) => t.topic) || ["Community", "Prayer"],
      
      date: upcomingFriday?.date || sermon?.publishedAt || todayAtMidnight.toISOString(),
      
      // ✅ UPDATED: Removed 'jumuahRoster.iqamah' since we deleted that field.
      // It now relies on the API time or defaults to 1:15 PM.
      time: upcomingFriday?.timings?.Dhuhr || "1:15 PM",      
      
      imam: jumuahRoster.imam || "To be announced",
      bilal: jumuahRoster.bilal || "To be announced"
    }
  } catch (error) {
    console.error("Error fetching Friday info:", error)
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

  // Clean the date string for formatting
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