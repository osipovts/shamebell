import { injectable, inject } from 'inversify';
import { INJECT } from '../../composition-root/container/container.const';
import {
  MessageBatchMap,
  MessageBatchRegistry,
} from '../../domain/messages/message-batch-registry';
import { ShameAnalyzerPort } from '../ports/shame-analyzer.port';
import { EventBusPort } from '../ports/event-bus.port';
import { MessageBatch } from '../../domain/messages/message-batch';
import { LoggerPort } from '../ports/logger.port';
import { ShameEvent } from '../events/shame.event';
import { MessageEntity } from '../../domain/messages/message.entity';
import { UseCasePort } from '../ports/use-case.port';

@injectable()
export class AnalyzeMessagesUseCase implements UseCasePort {
  constructor(
    @inject(MessageBatchRegistry) private readonly registry: MessageBatchRegistry,
    @inject(INJECT.LOGGER) private readonly logger: LoggerPort,
    @inject(INJECT.SHAME_ANALYZER) private readonly analyzer: ShameAnalyzerPort,
    @inject(INJECT.EVENT_BUS) private readonly eventBus: EventBusPort,
  ) {
    this.logger.setContext(AnalyzeMessagesUseCase.name);
  }

  async execute(): Promise<void> {
    const readyBatches = this.registry.takeAwayReadyBatches();

    await Promise.allSettled(readyBatches.values().map((batch) => this.processBatch(batch)));
  }

  private async processBatch(batch: MessageBatch): Promise<void> {
    const messages = batch.getMessages();

    try {
      const ashamedMessages = await this.analyzer.analyze(messages);
      ashamedMessages.forEach((m) => this.publishShameEvent(m));
    } catch (e: unknown) {
      this.logger.error(e);
    }
  }

  private publishShameEvent(messageEntity: MessageEntity): void {
    this.eventBus.publish(new ShameEvent(messageEntity));
  }
}
