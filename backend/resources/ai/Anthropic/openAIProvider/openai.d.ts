import type { OpenAIResourceClient } from './_client'
declare global {
  /**
   * AI provider resource "OpenAI"
   * Resource type: openAIProvider
   *
   * Usage guidance (from resource configuration):
   * AI resource provisioned by Retool to enable organization-wide access to OpenAI using a Retool-managed API key.
   */
  const openai: OpenAIResourceClient<'openai'>
}
export {}