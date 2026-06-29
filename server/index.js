import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const logoUrl = process.env.LOGO_URL || 'https://digitalromanian.com/logo-email.svg'
const siteUrl = process.env.PUBLIC_SITE_URL || 'https://digitalromanian.com'

function emailSignature() {
  return `
    <br />
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size:14px; line-height:1.4; color:#111; border-collapse:collapse; margin-top:24px;">
      <tbody>
        <tr>
          <td style="padding:0 16px 0 0; vertical-align:middle;">
            <img src="${logoUrl}" width="100" alt="Digital Romanian" style="display:block; border:0; outline:none; text-decoration:none;" />
          </td>
          <td style="vertical-align:middle;">
            <div style="font-size:16px; font-weight:700; margin-bottom:2px;">Digital Romanian</div>
            <div style="margin-bottom:3px;">
              🌐 <a href="${siteUrl}" style="color:#111; text-decoration:none;">digitalromanian.com</a>
            </div>
            <div>
              in <a href="https://www.linkedin.com/company/digital-romanian" style="color:#111; text-decoration:none;">linkedin.com/company/digital-romanian</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  `
}

function emailLayout(content) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#111;">
      ${content}
      ${emailSignature()}
    </div>
  `
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body

    await Promise.all([
      // Admin notification
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: `Contact nou - ${name}`,
        html: `
          <h2>Contact nou</h2>

          <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Sursa:</strong> ${escapeHtml(source)}</p>

          <hr />

          <p>${escapeHtml(message)}</p>
        `,
      }),
      // Confirmation to user
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: `Am primit mesajul tău!`,
        html: emailLayout(`
          <h2>Bună, ${escapeHtml(name)}!</h2>

          <p>Îți mulțumim că ne-ai contactat. Am primit mesajul tău și îți vom răspunde în cel mai scurt timp.</p>

          <hr />

          <p>Mesajul tău:</p>
          <p>${escapeHtml(message)}</p>
        `),
      }),
    ])

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false })
  }
})

app.post('/api/booking', async (req, res) => {
  try {
    const {
      service,
      customService,
      date,
      time,
      source,
      name,
      email,
      phone,
      message,
    } = req.body

    await Promise.all([
      // Admin notification
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: `Programare noua - ${name}`,
        html: `
          <h2>Programare noua</h2>

          <p><strong>Serviciu:</strong> ${escapeHtml(service?.title)}</p>
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
      // Confirmation to user
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: `Programarea ta a fost înregistrată!`,
        html: emailLayout(`
          <h2>Bună, ${escapeHtml(name)}!</h2>

          <p>Programarea ta a fost înregistrată cu succes. Te vom contacta în curând pentru confirmare.</p>

          <hr />

          <p><strong>Serviciu:</strong> ${escapeHtml(service?.title || customService)}</p>
          <p><strong>Data:</strong> ${escapeHtml(date)}</p>
          <p><strong>Ora:</strong> ${escapeHtml(time)}</p>
        `),
      }),
    ])

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false })
  }
})

app.post('/api/ebook-download', async (req, res) => {
  try {
    const {
      name,
      email,
      ebookTitle,
      ebookCategory,
      ebookLanguage,
      source,
      accepted,
    } = req.body

    if (!name || !email || !ebookTitle || !accepted) {
      return res.status(400).json({ success: false })
    }

    await Promise.all([
      // Admin notification
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
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
      // Confirmation to user
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: `Ebook-ul tau de la Digital Romanian`,
        html: emailLayout(`
          <h2>Buna, ${escapeHtml(name)}!</h2>

          <p>Iti multumim pentru interes. Am primit cererea ta pentru ebook-ul <strong>${escapeHtml(ebookTitle)}</strong>.</p>
          <p>Daca descarcarea nu a pornit automat in browser, te poti intoarce pe pagina de resurse si poti folosi din nou butonul de download.</p>
        `),
      }),
    ])

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false })
  }
})

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, source } = req.body

    await Promise.all([
      // Admin notification
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: `Abonare newsletter`,
        html: `
          <h2>Abonare noua</h2>

          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Sursa:</strong> ${escapeHtml(source)}</p>
        `,
      }),
      // Confirmation to subscriber
      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: `Ești abonat la newsletter-ul Digital Romanian!`,
        html: emailLayout(`
          <h2>Bine ai venit!</h2>

          <p>Te-ai abonat cu succes la newsletter-ul Digital Romanian. Vei primi cele mai noi articole, resurse și oferte direct în inbox.</p>
        `),
      }),
    ])

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
