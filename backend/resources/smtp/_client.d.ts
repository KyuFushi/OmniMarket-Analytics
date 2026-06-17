import type { SendEmailParams, SendEmailResult } from './_types'

/**
 * SMTP client for sending emails.
 * Supports both standard SMTP resources and Retool Email.
 *
 * @example
 * // Send a simple text email
 * await mySmtp.sendEmail({
 * to: 'recipient@example.com',
 * subject: 'Hello',
 * body: 'This is a test email',
 * bodyType: 'text'
 * })
 *
 * @example
 * // Send HTML email with CC and attachments
 * await mySmtp.sendEmail({
 * to: 'recipient@example.com',
 * cc: 'manager@example.com',
 * subject: 'Report',
 * body: '<h1>Monthly Report</h1><p>Please see attached.</p>',
 * bodyType: 'html',
 * attachments: [fileInput.files[0]]
 * })
 *
 * @example
 * // Send markdown email with reply-to
 * await mySmtp.sendEmail({
 * to: 'support@example.com',
 * replyTo: 'customer@example.com',
 * subject: 'Support Request',
 * body: '# Issue\n\nI need help with...',
 * bodyType: 'markdown'
 * })
 */
export interface SMTPClient<Name extends string> {
  readonly __type: Name
  /**
   * Send an email through the configured SMTP server or Retool Email.
   *
   * @param params Email parameters
   * @returns Promise with send result including message ID and status
   */
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>
}