import type { OpenAITextGenerateParams, OpenAITextGenerationResult } from './_types'

/**
 * Sandpack client for OpenAI provider resources.
 *
 * @example
 * const result = await myOpenAI.text.generate({
 * instruction: 'Write a haiku about observability',
 * model: 'gpt-4o-mini',
 * })
 * const text = result.data.queryData.data
 *
 * @example
 * const result = await myOpenAI.text.generate({
 * instruction: 'Explain quantum computing',
 * model: 'gpt-4o-mini',
 * systemMessage: 'Be concise.',
 * temperature: 0.7,
 * })
 * const text = result.data.queryData.data
 */
export interface OpenAIResourceClient<Name extends string> {
  readonly __type: Name
  text: {
    generate(params: OpenAITextGenerateParams): Promise<OpenAITextGenerationResult>
    /**
     * Provides real-time token streaming so the caller can render tokens as the model
     * produces them, instead of waiting for the full completion like `.generate(...)`.
     * Return the result directly from the backend function - that is the only valid
     * use. Do not iterate, await, or transform it; use `.generate(...)` if the
     * function needs to inspect, transform, or aggregate the response.
     *
     * Run an exploratory call first to confirm the event shape your model and
     * configuration produce.
     *
     * @example
     * export default async function streamReply() {
     * return myOpenAI.text.generateStreamRaw({ instruction: 'Stream a haiku', model: 'gpt-4o-mini' })
     * }
     */
    generateStreamRaw(params: OpenAITextGenerateParams): Promise<AsyncIterable<Uint8Array>>
  }
}