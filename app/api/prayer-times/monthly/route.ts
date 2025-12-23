import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Coordinates (Currently set to Subang Jaya area based on your previous code)
  const LAT = 3.1123146
  const LNG = 101.63408395
  const METHOD = 3

  const { searchParams } = new URL(request.url)
  const now = new Date()
  const month = searchParams.get('month') || now.getMonth() + 1
  const year = searchParams.get('year') || now.getFullYear()

  try {
    const res = await fetch(
      `http://api.aladhan.com/v1/calendar?latitude=${LAT}&longitude=${LNG}&method=${METHOD}&month=${month}&year=${year}`,
    )

    if (!res.ok) throw new Error('Failed to fetch calendar')

    const data = await res.json()
    
    const to12Hour = (time24: string) => {
      const cleanTime = time24.split(' ')[0] 
      const [hours, minutes] = cleanTime.split(':')
      let h = parseInt(hours, 10)
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12
      h = h ? h : 12
      return `${h}:${minutes} ${ampm}`
    }

    // Map the data to match the frontend expectation exactly
    const days = data.data.map((item: any) => ({
        date: `${item.date.gregorian.day} ${item.date.gregorian.month.en} ${item.date.gregorian.year}`, 
        weekday: item.date.gregorian.weekday.en,
      hijri: `${item.date.hijri.day} ${item.date.hijri.month.en}`,
      timings: {
        Fajr: to12Hour(item.timings.Fajr),
        Sunrise: to12Hour(item.timings.Sunrise),
        Dhuhr: to12Hour(item.timings.Dhuhr),
        Asr: to12Hour(item.timings.Asr),
        Maghrib: to12Hour(item.timings.Maghrib),
        Isha: to12Hour(item.timings.Isha),
      }
    }))

    // WRAP IN AN OBJECT WITH 'days' PROPERTY
    return NextResponse.json({ days })

  } catch (error) {
    console.error("Monthly API Error:", error)
    return NextResponse.json({ error: 'Failed to fetch monthly schedule', days: [] }, { status: 500 })
  }
}