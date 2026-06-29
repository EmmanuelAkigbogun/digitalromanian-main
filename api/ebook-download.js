import { badRequest, emailLayout, escapeHtml, handlePost, sendMail } from './_mail.js'

export default async function handler(req, res) {
  await handlePost(
    req,
    res,
    async ({ name, email, ebookTitle, ebookCategory, ebookLanguage, source, accepted }) => {
      if (!name || !email || !ebookTitle || !accepted) {
        throw badRequest('missing_ebook_fields')
      }

      await Promise.all([
        sendMail({
          from: process.env.MAIL_FROM,
          to: process.env.MAIL_TO,
          replyTo: email,
          subject: `Ebook download - ${ebookTitle}`,
          html: `
            <h2>Ebook download nou</h2>

            <p><strong>Ebook:</strong> ${escapeHtml(ebookTitle)}</p>
            <p><strong>Categorie:</strong> ${escapeHtml(ebookCategory)}</p>
            <p><strong>Limba:</strong> ${escapeHtml(ebookLanguage)}</p>
            <p><strong>Sursa:</strong> ${escapeHtml(source)}</p>

            <hr />

            <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Consimtamant:</strong> ${accepted ? 'Da' : 'Nu'}</p>
          `,
        }),
        sendMail({
          from: process.env.MAIL_FROM,
          to: email,
          subject: 'Ebook-ul tau de la Digital Romanian',
          html: emailLayout(`
            <h2>Buna, ${escapeHtml(name)}!</h2>

            <p>Iti multumim pentru interes. Am primit cererea ta pentru ebook-ul <strong>${escapeHtml(ebookTitle)}</strong>.</p>
            <p>Daca descarcarea nu a pornit automat in browser, te poti intoarce pe pagina de resurse si poti folosi din nou butonul de download.</p>
          `),
        }),
      ])
    },
  )
}
