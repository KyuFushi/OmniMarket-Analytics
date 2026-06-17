export type AnthropicModel =
  | 'claude-3-haiku-20240307'
  | 'claude-haiku-4-5-20251001'
  | 'claude-opus-4-1-20250805'
  | 'claude-opus-4-20250514'
  | 'claude-opus-4-5-20251101'
  | 'claude-opus-4-6'
  | 'claude-opus-4-7'
  | 'claude-opus-4-8'
  | 'claude-sonnet-4-20250514'
  | 'claude-sonnet-4-5-20250929'
  | 'claude-sonnet-4-6'

/**
 * Parameters for Anthropic text generation requests.
 */
export interface AnthropicTextGenerateParams {
  /**
   * The prompt or instruction to send to the provider.
   */
  instruction: string
  /**
   * The model to use.
   */
  model: AnthropicModel
  /**
   * Optional system prompt override.
   */
  systemMessage?: string
  /**
   * Optional temperature override (0-1).
   */
  temperature?: number
}

/**
 * Result returned from Anthropic text generation.
 */
export interface AnthropicTextGenerationResult {
  data: {
    queryData: {
      data: string
      metadata: Record<string, unknown>
    }
  }
}