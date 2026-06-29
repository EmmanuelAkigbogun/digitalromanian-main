import { badRequest, emailLayout, escapeHtml, handlePost, sendMail } from './_mail.js'
import { upsertNewsletterSubscriber } from './_automationStorage.js'

export default async function handler(req, res) {
  await handlePost(req, res, async ({ email, source, accepted, lang }) => {
    if (!email || !accepted) {
      throw badRequest('missing_newsletter_email')
    }

    await upsertNewsletterSubscriber({ email, source, lang })

    await Promise.all([
      sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        replyTo: email,
        subject: 'Abonare newsletter',
        html: `
          <h2>Abonare noua</h2>

          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Sursa:</strong> ${escapeHtml(source)}</p>
        `,
      }),
      sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Esti abonat la newsletter-ul Digital Romanian!',
        html: emailLayout(`
          <h2>Bine ai venit!</h2>

          <p>Te-ai abonat cu succes la newsletter-ul Digital Romanian. Vei primi cele mai noi articole si resurse direct in inbox.</p>
        `),
      }),
    ])
  })
}
