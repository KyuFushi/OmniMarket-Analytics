import type { SMTPClient } from './_client'
declare global {
  /**
   * Retool Email resource "retool_email"
   *
   * Usage guidance (from resource configuration):
   * Retool hosted Email Resource
   */
  const retoolEmail: SMTPClient<'retoolEmail'>
}
export {}