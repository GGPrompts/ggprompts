export type AITarget =
  | 'claude'
  | 'gpt4'
  | 'cursor'
  | 'windsurf'
  | 'codeium'
  | 'copilot'
  | 'universal';

export type ExportFormat = {
  target: AITarget;
  format: 'prompt' | 'code' | 'tokens' | 'spec';
  content: string;
  metadata: {
    componentCount: number;
    framework?: string;
    timestamp: Date;
  };
};
