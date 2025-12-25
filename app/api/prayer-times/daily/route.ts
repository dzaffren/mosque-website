import { getDailyPrayerData } from '@/lib/prayer-service'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await getDailyPrayerData()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}