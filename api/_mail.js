import nodemailer from 'nodemailer'

const requiredMailEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO']

let transporter

function getTransporter() {
  const missing = requiredMailEnv.filter((key) => !process.env[key])

  if (missing.length) {
    throw new Error(`Missing mail environment variables: ${missing.join(', ')}`)
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  return transporter
}

export function escapeHtml(value = '') {
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
              <a href="${siteUrl}" style="color:#111; text-decoration:none;">digitalromanian.com</a>
            </div>
            <div>
              <a href="https://www.linkedin.com/company/digital-romanian" style="color:#111; text-decoration:none;">linkedin.com/company/digital-romanian</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  `
}

export function emailLayout(content) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#111;">
      ${content}
      ${emailSignature()}
    </div>
  `
}

function setHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function sendJson(res, statusCode, payload) {
  setHeaders(res)
  res.statusCode = statusCode
  res.end(JSON.stringify(payload))
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string') {
    return req.body ? JSON.parse(req.body) : {}
  }

  const chunks = []

  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

export function badRequest(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

export async function sendMail(options) {
  return getTransporter().sendMail(options)
}

export async function handlePost(req, res, handler) {
  setHeaders(res)

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, error: 'method_not_allowed' })
    return
  }

  try {
    const body = await readJsonBody(req)
    await handler(body)
    sendJson(res, 200, { success: true })
  } catch (error) {
    const statusCode = error.statusCode || 500
    console.error(error)
    sendJson(res, statusCode, {
      success: false,
      error: statusCode === 500 ? 'mail_failed' : error.message,
    })
  }
}
