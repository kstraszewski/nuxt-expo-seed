import { createHash } from 'node:crypto'
import { Resend } from 'resend'

export interface MailerOptions {
  apiKey: string
  from: string
  appName?: string
}

export interface AuthEmail {
  to: string
  name: string
  url: string
  token: string
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]!,
  )
}

export function createMailer(options: MailerOptions) {
  if (!options.apiKey || !options.from)
    throw new Error('RESEND_API_KEY and EMAIL_FROM are required to send email.')
  const resend = new Resend(options.apiKey)
  const appName = options.appName ?? 'Seed'

  async function send(kind: 'verification' | 'password-reset', message: AuthEmail) {
    const url = new URL(message.url)
    if (!['http:', 'https:'].includes(url.protocol))
      throw new Error('Auth email links must use HTTP or HTTPS.')
    const subject =
      kind === 'verification'
        ? `Confirm your email for ${appName}`
        : `Reset your ${appName} password`
    const action = kind === 'verification' ? 'Confirm email' : 'Reset password'
    const introduction =
      kind === 'verification'
        ? 'Confirm your email address to finish creating your account.'
        : 'Use this link to choose a new password. If you did not request it, you can ignore this email.'
    // Tokens never appear in logs or the idempotency key itself.
    const tokenHash = createHash('sha256').update(message.token).digest('hex')
    const { data, error } = await resend.emails.send(
      {
        from: options.from,
        to: [message.to],
        subject,
        text: `Hi ${message.name},\n\n${introduction}\n\n${action}: ${url.href}\n`,
        html: `<p>Hi ${escapeHtml(message.name)},</p><p>${escapeHtml(introduction)}</p><p><a href="${escapeHtml(url.href)}">${action}</a></p>`,
      },
      { idempotencyKey: `auth/${kind}/${tokenHash}` },
    )
    if (error || !data) throw new Error(`Email delivery failed${error ? ` (${error.name})` : ''}.`)
    return data.id
  }

  return {
    sendVerification: (message: AuthEmail) => send('verification', message),
    sendPasswordReset: (message: AuthEmail) => send('password-reset', message),
  }
}
