import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    // TayyibPay sends callback as form-urlencoded
    const body = await req.text()
    const params = new URLSearchParams(body)

    const billCode = params.get('billcode') || ''
    const statusId = params.get('status_id') || ''

    if (!billCode) {
      return new NextResponse('OK', { status: 200 })
    }

    const newStatus = statusId === '1' ? 'paid' : 'failed'

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Find donation by billCode and update status
    const result = await payload.find({
      collection: 'donations',
      where: { billCode: { equals: billCode } },
      limit: 1,
    })

    if (result.docs.length > 0) {
      await payload.update({
        collection: 'donations',
        id: result.docs[0].id,
        data: { status: newStatus },
      })
    } else {
      // Check if this billCode belongs to a pledge (monthly re-bill)
      const pledgeResult = await payload.find({
        collection: 'pledges',
        where: { lastBillCode: { equals: billCode } },
        limit: 1,
      })

      if (pledgeResult.docs.length > 0) {
        const pledge = pledgeResult.docs[0]
        // Record the payment as a donation entry for history
        await payload.create({
          collection: 'donations',
          data: {
            name: pledge.name,
            email: pledge.email,
            phone: pledge.phone,
            amount: pledge.monthlyAmount,
            billCode,
            status: newStatus,
          },
        })
        // If payment failed, mark pledge as paused
        if (newStatus === 'failed') {
          await payload.update({
            collection: 'pledges',
            id: pledge.id,
            data: { status: 'paused' },
          })
        }
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('payment-callback error:', err)
    return new NextResponse('OK', { status: 200 }) // Always return 200 to TayyibPay
  }
}
