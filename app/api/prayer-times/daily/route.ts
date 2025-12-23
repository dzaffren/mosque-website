import { NextResponse } from 'next/server'

export async function GET() {
  // 1. CONFIGURATION: Kota Kinabalu Coordinates
  const LAT = 3.1123146
  const LNG = 101.63408395
  const METHOD = 3

  try {
    const today = new Date()
    // Aladhan expects DD-MM-YYYY
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
    
    // UPDATED: Using /timings endpoint with latitude & longitude
    const res = await fetch(
      `http://api.aladhan.com/v1/timings/${dateStr}?latitude=${LAT}&longitude=${LNG}&method=${METHOD}`,
    )

    if (!res.ok) throw new Error('Failed to fetch from external API')
    
    const data = await res.json()
    const timings = data.data.timings
    const date = data.data.date

    // Helper to convert "13:00" to "01:00 PM"
    const to12Hour = (time24: string) => {
      const [hours, minutes] = time24.split(':')
      let h = parseInt(hours, 10)
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12
      h = h ? h : 12 
      return `${h}:${minutes} ${ampm}`
    }

    return NextResponse.json({
      gregorian: `${date.gregorian.weekday.en}, ${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`,
      hijri: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`,
      prayers: [
        { name: "Fajr", time: to12Hour(timings.Fajr) },
        { name: "Sunrise", time: to12Hour(timings.Sunrise) },
        { name: "Dhuhr", time: to12Hour(timings.Dhuhr) },
        { name: "Asr", time: to12Hour(timings.Asr) },
        { name: "Maghrib", time: to12Hour(timings.Maghrib) },
        { name: "Isha", time: to12Hour(timings.Isha) },
      ]
    })

  } catch (error) {
    console.error("Prayer API Error:", error)
    return NextResponse.json({ error: 'Failed to fetch prayer times' }, { status: 500 })
  }
}