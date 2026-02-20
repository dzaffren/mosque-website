import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import nodemailer from 'nodemailer'

async function sendEmailNotification({
  type,
  name,
  email,
  subject,
  message,
  rating,
}: {
  type: string
  name: string
  email?: string
  subject?: string
  message: string
  rating?: number
}) {
  const toEmail = process.env.CONTACT_EMAIL_TO
  if (!toEmail || !process.env.SMTP_HOST) return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const typeLabel = type === 'feedback' ? 'Feedback' : 'Inquiry'
  const ratingLine = rating ? `\nRating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)` : ''
  const subjectLine = subject ? `\nSubject: ${subject}` : ''
  const emailLine = email ? `\nEmail: ${email}` : ''

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `[Mosque Website] New ${typeLabel} from ${name}`,
    text: `New ${typeLabel} received\n\nName: ${name}${emailLine}${subjectLine}${ratingLine}\n\nMessage:\n${message}`,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, name, email, subject, message, rating } = body

    if (!type || !name || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (type === 'inquiry' && (!email || !subject)) {
      return NextResponse.json({ error: 'Email and subject are required for inquiries' }, { status: 400 })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    await payload.create({
      collection: 'contact-messages',
      data: {
        type,
        name,
        email: email || undefined,
        subject: subject || undefined,
        message,
        rating: rating || undefined,
      },
    })

    // Fire and forget — email failure doesn't fail the request
    sendEmailNotification({ type, name, email, subject, message, rating }).catch((err) => {
      console.error('Email notification failed:', err)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('contact route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
