import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminEmail(subject: string, text: string) {
  try {
    await resend.emails.send({
      from: 'CoreHouse <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject,
      text,
    })
  } catch (err) {
    console.error('Email error:', err)
  }
}
