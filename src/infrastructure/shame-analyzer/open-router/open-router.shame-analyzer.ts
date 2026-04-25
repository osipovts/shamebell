import { inject } from 'inversify';
import { OpenRouterConfigPort } from '../../../application/ports/infrastructure/configs/open-router-config.port';
import { ShameAnalyzerPort } from '../../../application/ports/infrastructure/shame-analyzer.port';
import { INJECT } from '../../../composition-root/container/container.const';
import { MessageEntity } from '../../../domain/messages/message.entity';
import { LoggerPort } from '../../../application/ports/infrastructure/logger.port';
import { OpenRouterClient } from './open-router.client';
import { SYSTEM_PROMPT } from './system-prompt.const';

export class OpenRouterShameAnalyzer implements ShameAnalyzerPort {
  private systemPrompt: string = SYSTEM_PROMPT;
  private readonly client: OpenRouterClient;

  constructor(
    @inject(INJECT.LOGGER) private readonly logger: LoggerPort,
    @inject(INJECT.CONFIG.OPEN_ROUTER) { url, apiKey, model }: OpenRouterConfigPort,
  ) {
    this.logger.setContext(OpenRouterShameAnalyzer.name);
    this.client = new OpenRouterClient(url, apiKey, model);
  }

  /**
   *
   * @param messages messages to analyze
   * @returns messages ashamed by LLM, or empty array if error occurs
   */
  async analyze(messages: MessageEntity[]): Promise<MessageEntity[]> {
    if (messages.length === 0) return [];

    const { systemPrompt } = this;
    const userPrompt = OpenRouterShameAnalyzer.buildUserPrompt(messages);
    const prompt = systemPrompt + userPrompt;

    try {
      this.logger.debug(`Sending ${messages.length} message(s) to analysis...`);
      const { results } = await this.client.doJsonRequest<{ results: boolean[] }>(prompt);
      return this.getResults(messages, results).filter((m) => m.isAshamed === true);
    } catch (e: unknown) {
      this.logger.error(e);
    }

    return [];
  }

  private static buildUserPrompt(messages: MessageEntity[]): string {
    return JSON.stringify({ messages: messages.map((msg) => msg.text) });
  }

  private getResults(messages: MessageEntity[], flags: boolean[]): MessageEntity[] {
    try {
      if (flags.length !== messages.length) {
        this.logger.warn(
          `Unexpected length response. Expected ${messages.length}, got ${flags.length}`,
        );

        return [];
      }

      const messagesCopy = [...messages];

      flags.forEach((isAshamed, index) => {
        if (isAshamed === true) {
          messagesCopy[index].markAsAshamed();
        }
      });

      return messagesCopy;
    } catch (e: unknown) {
      this.logger.error(e);
    }

    return [];
  }
}
