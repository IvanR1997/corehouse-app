import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendAdminEmail(subject: string, text: string) {
  try {
    await transporter.sendMail({
      from: `"CoreHouse App" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      text,
    })
  } catch (err) {
    console.error('Email error:', err)
  }
}
