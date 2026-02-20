import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit')) || 50
    const depth = Number(searchParams.get('depth')) || 1

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const result = await payload.find({
      collection: 'gallery',
      limit,
      depth,
      sort: '-createdAt',
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('gallery API error:', err)
    return NextResponse.json({ docs: [] }, { status: 500 })
  }
}
