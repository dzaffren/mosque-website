import { client } from '@/sanity/lib/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

async function getSchedule() {
  const query = `*[_type == "weeklySchedule"][0]`
  return await client.fetch(query)
}

export default async function SchedulePage() {
  const schedule = await getSchedule()
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl"> {/* Increased width for more columns */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Weekly Roster</h1>
          <p className="text-slate-600">Full Imam and Bilal assignments for each prayer.</p>
        </div>

        <Card className="shadow-lg border-t-4 border-t-emerald-600 overflow-x-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Weekly Schedule</CardTitle>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!schedule ? (
              <div className="text-center py-8 text-muted-foreground">No schedule published.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100">
                    <TableHead className="font-bold">Day</TableHead>
                    {prayers.map(p => (
                      <TableHead key={p} className="text-center font-bold capitalize border-l">{p}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
<TableBody>
  {days.map((day) => {
    const dayData = schedule[day.toLowerCase()]
    const isFriday = day === 'Friday'
    
    return (
      <TableRow key={day} className={`hover:bg-slate-50/50 ${isFriday ? "bg-emerald-50/30" : ""}`}>
        <TableCell className="font-bold text-slate-900">
          {day}
        </TableCell>
        
        {prayers.map((prayer) => {
          // Logic: If it's Friday and the prayer is Dhuhr, we label it Jumuah
          const isJumuahSlot = isFriday && prayer === 'dhuhr'
          
          return (
            <TableCell key={prayer} className="border-l text-center py-4">
              <div className="flex flex-col text-[11px] leading-tight">
                <span className="text-emerald-700 font-bold mb-1 uppercase tracking-tighter">
                  {isJumuahSlot ? "Khatib / Imam" : "Imam"}
                </span>
                <span className="text-slate-900 font-medium mb-2">
                  {dayData?.[prayer]?.imam || '-'}
                </span>
                
                <span className="text-blue-700 font-bold mb-1 uppercase tracking-tighter border-t pt-1">
                  Bilal
                </span>
                <span className="text-slate-900 font-medium">
                  {dayData?.[prayer]?.bilal || '-'}
                </span>
              </div>
            </TableCell>
          )
        })}
      </TableRow>
    )
  })}
</TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}