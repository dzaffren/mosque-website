import { getMonthlyPrayerData } from '@/lib/prayer-service'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils" // Standard shadcn helper for classes

export default async function PrayerTimesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ month?: string; year?: string }> 
}) {
  const params = await searchParams
  const now = new Date()
  
  // Format today's date to match your "day.date" string (e.g., "25 December 2025")
  const todayString = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const month = params.month || (now.getMonth() + 1).toString()
  const year = params.year || now.getFullYear().toString()

  const { days } = await getMonthlyPrayerData(month, year)

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-5xl mx-auto shadow-xl border-none ring-1 ring-slate-100 rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-emerald-900 text-white p-8">
          <CardTitle className="text-3xl font-bold text-center">Monthly Prayer Schedule</CardTitle>
          <p className="text-center text-emerald-100 opacity-90 mt-2">
            {new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-800">Date</TableHead>
                <TableHead className="font-bold text-slate-800">Fajr</TableHead>
                <TableHead className="font-bold text-slate-800">Dhuhr</TableHead>
                <TableHead className="font-bold text-slate-800">Asr</TableHead>
                <TableHead className="font-bold text-slate-800">Maghrib</TableHead>
                <TableHead className="font-bold text-slate-800">Isha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((day: any, index: number) => {
                // Check if this row is today
                const isToday = day.date === todayString;

                return (
                  <TableRow 
                    key={index} 
                    className={cn(
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/30",
                      isToday && "bg-emerald-50 ring-2 ring-inset ring-emerald-500/20" // 👈 Highlight class
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className={cn(
                        "text-sm",
                        isToday ? "text-emerald-700 font-bold" : "text-slate-900"
                      )}>
                        {day.date}
                        {isToday && <span className="ml-2 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">TODAY</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{day.weekday}</div>
                    </TableCell>
                    <TableCell className={isToday ? "font-bold text-emerald-700" : ""}>{day.timings.Fajr}</TableCell>
                    <TableCell className={isToday ? "font-bold text-emerald-700" : ""}>{day.timings.Dhuhr}</TableCell>
                    <TableCell className={isToday ? "font-bold text-emerald-700" : ""}>{day.timings.Asr}</TableCell>
                    <TableCell className={isToday ? "font-bold text-emerald-700" : ""}>{day.timings.Maghrib}</TableCell>
                    <TableCell className={isToday ? "font-bold text-emerald-700" : ""}>{day.timings.Isha}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}