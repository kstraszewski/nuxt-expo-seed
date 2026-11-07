---
name: seed-resend
description: 'Change transactional emails, verification/reset templates or Resend delivery configuration.'
license: MIT
---

# Resend

1. Email delivery belongs in packages/email. Use the configured EMAIL_FROM on a verified Resend domain and keep RESEND_API_KEY server-side.

2. Preserve both plain-text and HTML variants. Escape user-provided values in HTML. Verification/reset URLs come from Better Auth and must not be logged.

3. Do not send test emails to real users without an explicit delivery request. For automatic checks, mock the delivery boundary or use a designated test recipient.

4. Surface provider failures to the auth workflow without exposing API keys or sensitive email content. Keep templates generic until a project supplies branding.

## Official references

- https://resend.com/docs
- https://resend.com/docs/dashboard/domains/introduction
