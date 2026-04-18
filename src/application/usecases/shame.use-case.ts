import { inject } from 'inversify';
import { INJECT } from '../../composition-root/container/container.const';
import { ControllerPort } from '../ports/controller.port';
import { LoggerPort } from '../ports/logger.port';
import { MessageDto } from '../ports/dto/message.dto';
import { UseCasePort } from '../ports/use-case.port';
import { ShameEvent } from '../events/shame.event';

export class ShameUseCase implements UseCasePort<ShameEvent> {
  constructor(
    @inject(INJECT.LOGGER) private readonly logger: LoggerPort,
    @inject(INJECT.CONTROLLER) private readonly controller: ControllerPort,
  ) {
    this.logger.setContext(ShameUseCase.name);
  }

  execute(event: ShameEvent): void {
    const messageDto = event.message;
    this.logger.info(`${messageDto.authorName} @ ${messageDto.chatId} is ashamed`);
    this.controller.sendMessage(messageDto.chatId, ShameUseCase.shameText(messageDto));
  }

  private static shameText(messageDto: MessageDto): string {
    return `Позор, @${messageDto.authorName}! Твое сообщение "${messageDto.text}" отвратительно!`;
  }
}
