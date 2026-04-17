import { MessageEntity } from './message.entity';

export interface MessageBatchConfig {
  readonly countLimit: number;
  readonly timeLimit: number;
}

export class MessageBatch {
  constructor(
    private readonly cfg: MessageBatchConfig,
    private messages: MessageEntity[] = [],
    private startedAt: null | Date = null, // time of the first message in a batch
  ) {}

  /**
   * @returns this batch for further method chaining
   */
  add(message: MessageEntity): MessageBatch {
    if (this.isFull()) {
      throw new Error(`[${message.chatId}] Message batch is full`);
    }

    this.messages.push(message);
    this.startedAt ??= new Date();

    return this;
  }

  /**
   * @returns is batch ready for processing
   */
  isReady(currentTime: Date = new Date()): boolean {
    return this.isFull() || this.isExpired(currentTime);
  }

  /**
   * @returns copy of messages
   */
  getMessages(): MessageEntity[] {
    return [...this.messages];
  }

  private isFull(): boolean {
    return this.messages.length >= this.cfg.countLimit;
  }

  private isExpired(currentTime: Date = new Date()): boolean {
    if (!this.startedAt) return false;

    const diffMs = currentTime.getTime() - this.startedAt.getTime();
    const limitMs = this.cfg.timeLimit * 1000;

    return diffMs >= limitMs;
  }
}
