import { NextResponse } from 'next/server'
import { getDailyHadith } from '@/lib/hadith-service'

export async function GET() {
  const data = await getDailyHadith()
  return NextResponse.json(data)
}