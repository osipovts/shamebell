import { MessageBatch, MessageBatchConfig } from './message-batch';
import { MessageEntity } from './message.entity';

export type ChatId = string;
export type MessageBatchMap = Map<ChatId, MessageBatch>;

export class MessageBatchRegistry {
  constructor(
    private readonly cfg: Readonly<MessageBatchConfig>,
    private readonly batches: MessageBatchMap = new Map(),
  ) {}

  /**
   * Adds message to batch. Creates batch if it not exists.
   * @returns the batch
   */
  addMessage(message: MessageEntity): MessageBatch {
    return this.getOrCreateBatch(message.chatId).add(message);
  }

  /**
   * Collects ready for processing batches and deletes them from the registry
   * @returns collected batches
   */
  takeAwayReadyBatches(): MessageBatchMap {
    const readyBatches: MessageBatchMap = new Map();

    for (const [chatId, batch] of this.batches) {
      if (batch.isReady()) {
        readyBatches.set(chatId, batch);
        this.batches.delete(chatId);
      }
    }

    return readyBatches;
  }

  private getOrCreateBatch(chatId: ChatId): MessageBatch {
    if (!this.batches.has(chatId)) {
      this.batches.set(chatId, this.createBatch());
    }

    return this.batches.get(chatId)!;
  }

  private createBatch(): MessageBatch {
    return new MessageBatch(this.cfg);
  }
}
