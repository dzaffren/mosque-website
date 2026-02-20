import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

const TOYYIBPAY_BASE_URL = process.env.TOYYIBPAY_BASE_URL || 'https://toyyibpay.com'
const SECRET_KEY = process.env.TOYYIBPAY_SECRET_KEY || ''
const CATEGORY_CODE = process.env.TOYYIBPAY_CATEGORY_CODE || ''
const CRON_SECRET = process.env.CRON_SECRET || ''

async function createBill(name: string, email: string, phone: string, amount: number, siteUrl: string) {
  const amountInSen = Math.round(amount * 100)
  const formData = new URLSearchParams({
    userSecretKey: SECRET_KEY,
    categoryCode: CATEGORY_CODE,
    billName: 'Monthly Mosque Pledge',
    billDescription: `Monthly pledge from ${name} (RM${amount}/month)`,
    billPriceSetting: '1',
    billPayorInfo: '1',
    billAmount: String(amountInSen),
    billReturnUrl: `${siteUrl}/en/donation/thank-you?pledge=1`,
    billCallbackUrl: `${siteUrl}/api/payment-callback`,
    billExternalReferenceNo: '',
    billTo: name,
    billEmail: email,
    billPhone: phone,
    billSplitPayment: '0',
    billSplitPaymentArgs: '',
    billPaymentChannel: '0',
    billContentEmail: `As-salamu alaykum ${name},\n\nThis is your monthly mosque pledge bill of RM${amount}. Please click the link to complete your payment. Jazak'Allah Khayr for your continued support.`,
    billChargeToCustomer: '0',
  })

  const res = await fetch(`${TOYYIBPAY_BASE_URL}/index.php/api/createBill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  })
  const data = await res.json()
  if (!data?.[0]?.BillCode) throw new Error(`TayyibPay error for ${email}`)
  return data[0].BillCode as string
}

async function handler(req: NextRequest) {
  // Validate cron secret
  const authHeader = req.headers.get('authorization')
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Find all active pledges with nextBillDate <= today
  const duePledges = await payload.find({
    collection: 'pledges',
    where: {
      and: [
        { status: { equals: 'active' } },
        { nextBillDate: { less_than_equal: today.toISOString() } },
      ],
    },
    limit: 100,
  })

  const results = { processed: 0, failed: 0, errors: [] as string[] }

  for (const pledge of duePledges.docs) {
    try {
      const billCode = await createBill(
        pledge.name,
        pledge.email,
        pledge.phone,
        pledge.monthlyAmount,
        siteUrl,
      )

      // Advance nextBillDate by 1 month
      const nextDate = new Date(pledge.nextBillDate as string)
      nextDate.setMonth(nextDate.getMonth() + 1)

      await payload.update({
        collection: 'pledges',
        id: pledge.id,
        data: {
          lastBillCode: billCode,
          nextBillDate: nextDate.toISOString(),
        },
      })

      results.processed++
    } catch (err: any) {
      results.failed++
      results.errors.push(`${pledge.email}: ${err.message}`)
    }
  }

  return NextResponse.json({
    message: `Processed ${results.processed} pledge(s), ${results.failed} failed.`,
    ...results,
  })
}

// Vercel Cron sends GET; manual triggers can use POST
export const GET = handler
export const POST = handler
