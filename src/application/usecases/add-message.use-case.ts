import { inject, injectable } from 'inversify';
import { INJECT } from '../../composition-root/container/container.const';
import { MessageEntity } from '../../domain/messages/message.entity';
import { MessageDto } from '../ports/dto/message.dto';
import { LoggerPort } from '../ports/logger.port';
import { MessageBatchRegistry } from '../../domain/messages/message-batch-registry';
import { UseCasePort } from '../ports/use-case.port';

@injectable()
export class AddMessageUseCase implements UseCasePort {
  constructor(
    @inject(INJECT.LOGGER) private readonly logger: LoggerPort,
    @inject(MessageBatchRegistry) private readonly messages: MessageBatchRegistry,
  ) {
    this.logger.setContext(AddMessageUseCase.name);
  }

  execute(messageDto: MessageDto): void {
    // 1. Create message entity
    const message = new MessageEntity(
      messageDto.authorId,
      messageDto.authorName,
      messageDto.chatId,
      messageDto.text,
    );

    // 2. Add message entity to a batch
    this.messages.addMessage(message);

    // 3. Debug log
    this.log(messageDto);
  }

  private log(messageDto: MessageDto, textLimit: number = 30): void {
    const text = `${messageDto.text.substring(0, textLimit)}${messageDto.text.length > textLimit ? '...' : ''}`;
    this.logger.debug(`Added message ${messageDto.authorId}@${messageDto.chatId}: ${text}`);
  }
}
