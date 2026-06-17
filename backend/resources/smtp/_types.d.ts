/**
 * File attachment for email.
 * Compatible with Retool File Input component output.
 */
export interface EmailAttachment {
  /** File name with extension */
  name: string
  /** MIME type (e.g., 'application/pdf', 'image/png') */
  type: string
  /** Base64 encoded file content */
  base64Data: string
  /** File size in bytes */
  sizeBytes: number
}

/**
 * Parameters for sending an email.
 */
export interface SendEmailParams {
  /** Recipient email address(es). Can be string or array. */
  to: string | string[]

  /** Email subject line */
  subject: string

  /** Email body content */
  body: string

  /** Format of the body content */
  bodyType: 'text' | 'html' | 'markdown'

  /**
   * Sender email address.
   * * For SMTP: You can specify any address allowed by your SMTP server
   * * For Retool Email: This is automatically set based on your configuration
   */
  from?: string

  /** CC recipient email address(es) */
  cc?: string | string[]

  /** BCC recipient email address(es) */
  bcc?: string | string[]

  /** Reply-to email address */
  replyTo?: string

  /** In-Reply-To header for threading */
  inReplyTo?: string

  /** File attachments (from File Input component or manually constructed) */
  attachments?: EmailAttachment[]

  /**
   * Whether to suppress the Retool signature in emails.
   * * Only applicable for Retool Email resource.
   * * Default: false
   */
  suppressRetoolSignature?: boolean

  /**
   * Whether to use the Retool AI agent signature instead of the standard signature.
   * * Only applicable for Retool Email resource when suppressRetoolSignature is false.
   * * Default: false
   */
  useRetoolAgentSignature?: boolean
}

/**
 * Result from sending an email.
 */
export interface SendEmailResult {
  /** Result data from the email server */
  data: {
    /** Message accepted status */
    accepted: string[]
    /** Message rejected status */
    rejected: string[]
    /** Number of messages enqueued */
    envelopeTime: number
    /** Time to generate message */
    messageTime: number
    /** Size of the message */
    messageSize: number
    /** Server response */
    response: string
  }
}