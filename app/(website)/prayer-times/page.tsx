import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, AlertCircle } from "lucide-react"

async function getMonthlySchedule() {
  try {
    const res = await fetch('http://localhost:3000/api/prayer-times/monthly', {
      next: { revalidate: 3600 },
    })
    
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    
    // Safety check: Ensure the response has the 'days' array
    if (!data || !data.days) {
      console.error("API response missing 'days' array:", data)
      return null
    }
    
    return data
  } catch (error) {
    console.error("Monthly schedule fetch error:", error)
    return null
  }
}

export default async function PrayerTimesPage() {
  const schedule = await getMonthlySchedule()
  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Prayer Schedule</h1>
          <p className="text-emerald-600 font-medium mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> 
            {currentMonthName}
          </p>
        </div>

        {/* CARD */}
        <Card className="shadow-sm border border-slate-200 bg-white overflow-hidden">
          <CardContent className="p-0">
            {/* Logic Change: Check for schedule AND schedule.days */}
            {schedule && Array.isArray(schedule.days) ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-emerald-900 hover:bg-emerald-900 border-none">
                    <TableHead className="w-[130px] font-bold text-white py-4 pl-6">Date</TableHead>
                    <TableHead className="font-bold text-emerald-100 py-4">Hijri</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Fajr</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Sunrise</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Dhuhr</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Asr</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Maghrib</TableHead>
                    <TableHead className="font-bold text-white text-center py-4 pr-6">Isha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.days.map((day: any, index: number) => {
                    // Safety check for date string
                    const dayDate = day.date?.toString() || ""
                    const isToday = dayDate.startsWith(new Date().getDate().toString() + ' ')
                    const isEven = index % 2 === 0;

                    return (
                      <TableRow 
                        key={day.date || index} 
                        className={`
                          border-b border-slate-100
                          ${isToday ? "bg-emerald-50 hover:bg-emerald-50 border-l-4 border-l-emerald-600" : ""}
                          ${!isToday && isEven ? "bg-white" : ""}
                          ${!isToday && !isEven ? "bg-slate-50/50" : ""}
                        `}
                      >
                        <TableCell className="font-medium whitespace-nowrap pl-6 py-4">
                          <span className={isToday ? "text-emerald-900 font-bold" : "text-slate-900"}>
                            {dayDate.split(' ').slice(0, 2).join(' ')}
                          </span>
                          <span className="text-xs text-slate-400 block font-normal">{day.weekday}</span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">{day.hijri}</TableCell>
                        <TableCell className="text-center font-medium text-slate-700">{day.timings?.Fajr || '--:--'}</TableCell>
                        <TableCell className="text-center text-xs text-slate-400">{day.timings?.Sunrise || '--:--'}</TableCell>
                        <TableCell className="text-center font-medium text-slate-700">{day.timings?.Dhuhr || '--:--'}</TableCell>
                        <TableCell className="text-center font-medium text-slate-700">{day.timings?.Asr || '--:--'}</TableCell>
                        <TableCell className="text-center font-medium text-slate-700">{day.timings?.Maghrib || '--:--'}</TableCell>
                        <TableCell className="text-center font-medium text-slate-700 pr-6">{day.timings?.Isha || '--:--'}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              // Enhanced Error State
              <div className="p-20 text-center flex flex-col items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Schedule Unavailable</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  We couldn't retrieve the monthly prayer times. Please check your internet connection or try again later.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}