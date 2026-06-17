import type { AnthropicResourceClient } from './_client'
declare global {
  /**
   * AI provider resource "Anthropic"
   * Resource type: anthropic
   *
   * Usage guidance (from resource configuration):
   * AI resource provisioned by Retool to enable organization-wide access to Anthropic using a Retool-managed API key.
   */
  const anthropic: AnthropicResourceClient<'anthropic'>
}
export {}