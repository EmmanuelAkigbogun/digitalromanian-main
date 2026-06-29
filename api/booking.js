import { badRequest, emailLayout, escapeHtml, handlePost, sendMail } from './_mail.js'

export default async function handler(req, res) {
  await handlePost(
    req,
    res,
    async ({ service, customService, date, time, source, name, email, phone, message }) => {
      const serviceTitle = service?.title || customService

      if (!name || !email || !date || !time || !serviceTitle) {
        throw badRequest('missing_booking_fields')
      }

      await Promise.all([
        sendMail({
          from: process.env.MAIL_FROM,
          to: process.env.MAIL_TO,
          replyTo: email,
          subject: `Programare noua - ${name}`,
          html: `
            <h2>Programare noua</h2>

            <p><strong>Serviciu:</strong> ${escapeHtml(serviceTitle)}</p>
            <p><strong>Serviciu custom:</strong> ${escapeHtml(customService)}</p>
            <p><strong>Data:</strong> ${escapeHtml(date)}</p>
            <p><strong>Ora:</strong> ${escapeHtml(time)}</p>
            <p><strong>Sursa:</strong> ${escapeHtml(source)}</p>

            <hr />

            <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>

            <hr />

            <p>${escapeHtml(message)}</p>
          `,
        }),
        sendMail({
          from: process.env.MAIL_FROM,
          to: email,
          subject: 'Programarea ta a fost inregistrata!',
          html: emailLayout(`
            <h2>Buna, ${escapeHtml(name)}!</h2>

            <p>Programarea ta a fost inregistrata cu succes. Revenim in curand pentru confirmare.</p>

            <hr />

            <p><strong>Serviciu:</strong> ${escapeHtml(serviceTitle)}</p>
            <p><strong>Data:</strong> ${escapeHtml(date)}</p>
            <p><strong>Ora:</strong> ${escapeHtml(time)}</p>
          `),
        }),
      ])
    },
  )
}
