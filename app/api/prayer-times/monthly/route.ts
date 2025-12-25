import { NextResponse } from 'next/server'
import { getMonthlyPrayerData } from '@/lib/prayer-service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const now = new Date()
  const month = searchParams.get('month') || now.getMonth() + 1
  const year = searchParams.get('year') || now.getFullYear()

  try {
    const data = await getMonthlyPrayerData(month, year)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Monthly API Error:", error)
    return NextResponse.json({ error: 'Failed to fetch', days: [] }, { status: 500 })
  }
}