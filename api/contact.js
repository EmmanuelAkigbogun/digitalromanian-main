import { badRequest, emailLayout, escapeHtml, handlePost, sendMail } from './_mail.js'

export default async function handler(req, res) {
  await handlePost(req, res, async ({ name, email, phone, message, service, source }) => {
    if (!name || !email || !message) {
      throw badRequest('missing_contact_fields')
    }

    await Promise.all([
      sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        replyTo: email,
        subject: `Contact nou - ${name}`,
        html: `
          <h2>Contact nou</h2>

          <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Serviciu:</strong> ${escapeHtml(service)}</p>
          <p><strong>Sursa:</strong> ${escapeHtml(source)}</p>

          <hr />

          <p>${escapeHtml(message)}</p>
        `,
      }),
      sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Am primit mesajul tau!',
        html: emailLayout(`
          <h2>Buna, ${escapeHtml(name)}!</h2>

          <p>Iti multumim ca ne-ai contactat. Am primit mesajul tau si iti vom raspunde in cel mai scurt timp.</p>

          <hr />

          <p>Mesajul tau:</p>
          <p>${escapeHtml(message)}</p>
        `),
      }),
    ])
  })
}
