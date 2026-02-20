import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

const TOYYIBPAY_BASE_URL = process.env.TOYYIBPAY_BASE_URL || 'https://toyyibpay.com'
const SECRET_KEY = process.env.TOYYIBPAY_SECRET_KEY || ''
const CATEGORY_CODE = process.env.TOYYIBPAY_CATEGORY_CODE || ''

async function createTayyibPayBill({
  name, email, phone, amount, description, returnUrl, callbackUrl,
}: {
  name: string; email: string; phone: string; amount: number
  description: string; returnUrl: string; callbackUrl: string
}): Promise<{ billCode: string; billUrl: string }> {
  const amountInSen = Math.round(amount * 100)
  const formData = new URLSearchParams({
    userSecretKey: SECRET_KEY,
    categoryCode: CATEGORY_CODE,
    billName: 'Mosque Donation',
    billDescription: description,
    billPriceSetting: '1',
    billPayorInfo: '1',
    billAmount: String(amountInSen),
    billReturnUrl: returnUrl,
    billCallbackUrl: callbackUrl,
    billExternalReferenceNo: '',
    billTo: name,
    billEmail: email,
    billPhone: phone,
    billSplitPayment: '0',
    billSplitPaymentArgs: '',
    billPaymentChannel: '0',
    billContentEmail: `Thank you for your donation of RM${amount} to our mosque. Jazak'Allah Khayr.`,
    billChargeToCustomer: '0',
  })

  const res = await fetch(`${TOYYIBPAY_BASE_URL}/index.php/api/createBill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  })
  const data = await res.json()
  if (!data?.[0]?.BillCode) throw new Error('TayyibPay bill creation failed')
  const billCode = data[0].BillCode
  return { billCode, billUrl: `${TOYYIBPAY_BASE_URL}/${billCode}` }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, amount, frequency } = await req.json()
    const isMonthly = frequency === 'monthly'

    if (!name || !email || !phone || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (Number(amount) < 1) {
      return NextResponse.json({ error: 'Minimum donation is RM1' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const returnUrl = `${origin}/en/donation/thank-you${isMonthly ? '?pledge=1' : ''}`
    const callbackUrl = `${origin}/api/payment-callback`

    const description = isMonthly
      ? `Monthly pledge from ${name} (RM${amount}/month)`
      : `Donation from ${name}`

    const { billCode, billUrl } = await createTayyibPayBill({
      name, email, phone, amount: Number(amount), description, returnUrl, callbackUrl,
    })

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    if (isMonthly) {
      // Save as an active pledge; next bill due in 1 month
      const nextBillDate = new Date()
      nextBillDate.setMonth(nextBillDate.getMonth() + 1)
      await payload.create({
        collection: 'pledges',
        data: {
          name, email, phone,
          monthlyAmount: Number(amount),
          status: 'active',
          nextBillDate: nextBillDate.toISOString(),
          lastBillCode: billCode,
        },
      })
    } else {
      await payload.create({
        collection: 'donations',
        data: { name, email, phone, amount: Number(amount), billCode, status: 'pending' },
      })
    }

    return NextResponse.json({ billUrl })
  } catch (err) {
    console.error('create-payment error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
