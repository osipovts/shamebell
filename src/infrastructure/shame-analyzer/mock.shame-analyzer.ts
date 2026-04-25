import { injectable } from 'inversify';
import { MessageEntity } from '../../domain/messages/message.entity';
import { ShameAnalyzerPort } from '../../application/ports/infrastructure/shame-analyzer.port';
import { randomInt } from 'node:crypto';

@injectable()
export class MockShameAnalyzer implements ShameAnalyzerPort {
  async analyze(messages: MessageEntity[]): Promise<MessageEntity[]> {
    const ashamedMessages = messages
      .filter((m) => this.shouldBeAshamed(m))
      .map((m) => m.markAsAshamed());

    if (ashamedMessages.length > 0) {
      await new Promise((r) => setTimeout(r, randomInt(100, 2000))); // mock network lag
    }

    return Promise.resolve(ashamedMessages);
  }

  private shouldBeAshamed(messageEntity: MessageEntity): boolean {
    return messageEntity.text.toLowerCase().includes('член');
  }
}
