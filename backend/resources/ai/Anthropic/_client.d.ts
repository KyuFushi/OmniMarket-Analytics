import type { AnthropicTextGenerateParams, AnthropicTextGenerationResult } from './_types'

/**
 * Sandpack client for Anthropic provider resources.
 * * @example
 * const result = await myAnthropic.text.generate({
 * instruction: 'Summarize this incident report',
 * model: 'claude-sonnet-4-20250514',
 * })
 * const text = result.data.queryData.data
 * * @example
 * const result = await myAnthropic.text.generate({
 * instruction: 'Explain quantum computing',
 * model: 'claude-sonnet-4-20250514',
 * systemMessage: 'Be concise.',
 * temperature: 0.2,
 * })
 * const text = result.data.queryData.data
 */
export interface AnthropicResourceClient<Name extends string> {
  readonly __type: Name
  text: {
    generate(params: AnthropicTextGenerateParams): Promise<AnthropicTextGenerationResult>
    /**
     * Provides real-time token streaming so the caller can render tokens as the model
     * produces them, instead of waiting for the full completion like `.generate(...)`.
     * Return the result directly from the backend function - that is the only valid
     * use. Do not iterate, await, or transform it; use `.generate(...)` if the
     * function needs to inspect, transform, or aggregate the response.
     * * Run an exploratory call first to confirm the event shape your model and
     * configuration produce.
     * * @example
     * export default async function streamReply() {
     * return myAnthropic.text.generateStreamRaw({ instruction: 'Stream a haiku', model: 'claude-sonnet-4-20250514' })
     * }
     */
    generateStreamRaw(params: AnthropicTextGenerateParams): Promise<AsyncIterable<Uint8Array>>
  }
}