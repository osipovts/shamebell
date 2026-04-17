import { inject } from 'inversify';
import { INJECT } from '../../di.tokens';
import { ControllerPort } from '../ports/controller.port';
import { LoggerPort } from '../ports/logger.port';
import { MessageDto } from '../ports/dto/message.dto';

export class ShameUseCase {
  constructor(
    @inject(INJECT.LOGGER) private readonly logger: LoggerPort,
    @inject(INJECT.CONTROLLER) private readonly controller: ControllerPort,
  ) {
    this.logger.setContext(ShameUseCase.name);
  }

  execute(messageDto: MessageDto): void {
    this.logger.info(`${messageDto.authorName} @ ${messageDto.chatId} is ashamed`);
    this.controller.sendMessage(messageDto.chatId, ShameUseCase.shameText(messageDto));
  }

  private static shameText(messageDto: MessageDto): string {
    return `Позор, @${messageDto.authorName}! Твое сообщение "${messageDto.text}" отвратительно!`;
  }
}
