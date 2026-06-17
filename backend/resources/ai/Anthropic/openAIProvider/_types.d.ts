export type OpenAIModel =
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-5'
  | 'gpt-5-mini'
  | 'gpt-5-nano'
  | 'gpt-5.1'
  | 'gpt-5.2'
  | 'gpt-5.3-codex'
  | 'gpt-5.4'
  | 'gpt-5.5'
  | 'gpt-image-1'
  | 'gpt-image-1-mini'
  | 'gpt-image-1.5'
  | 'gpt-image-2'
  | 'o1'
  | 'o3'
  | 'o3-mini'
  | 'o4-mini'
  | 'text-embedding-3-large'
  | 'text-embedding-3-small'
  | 'text-embedding-ada-002'

/**
 * Parameters for OpenAI text generation requests.
 */
export interface OpenAITextGenerateParams {
  /**
   * The prompt or instruction to send to the provider.
   */
  instruction: string
  /**
   * The model to use.
   */
  model: OpenAIModel
  /**
   * Optional system prompt override.
   */
  systemMessage?: string
  /**
   * Optional temperature override (0-2).
   */
  temperature?: number
}

/**
 * Result returned from OpenAI text generation.
 */
export interface OpenAITextGenerationResult {
  data: {
    queryData: {
      data: string
      metadata: Record<string, unknown>
    }
  }
}