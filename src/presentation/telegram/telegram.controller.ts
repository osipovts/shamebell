import TelegramBot from 'node-telegram-bot-api';
import { inject, injectable } from 'inversify';
import { ControllerPort } from '../../application/ports/presentation/controller.port';
import { INJECT } from '../../composition-root/container/container.const';
import { TelegramBotConfigPort } from '../../application/ports/configs/telegram-bot-config.port';
import { LoggerPort } from '../../application/ports/infrastructure/logger.port';
import assert from 'node:assert';
import { MessageMapper } from '../mappers/message.mapper';
import { AddMessageUseCase } from '../../application/usecases/add-message.use-case';

@injectable()
export class TelegramController implements ControllerPort {
  private bot: TelegramBot | undefined;

  constructor(
    @inject(INJECT.CONFIG.TELEGRAM_BOT) private readonly cfg: TelegramBotConfigPort,
    @inject(INJECT.LOGGER) private readonly logger: LoggerPort,
    // use cases
    @inject(AddMessageUseCase) private readonly addMessasgeUseCase: AddMessageUseCase,
  ) {
    this.logger.setContext(TelegramController.name);
  }

  listen(): void {
    // create bot
    this.bot = new TelegramBot(this.cfg.token, { polling: true });

    // setup command handlers
    this.bot.onText(/./, (msg) =>
      this.processMessage(
        String(msg.from?.id),
        msg.from?.username ?? msg.from?.first_name + ' ' + msg.from?.last_name,
        String(msg.chat.id),
        msg.text ?? '',
      ),
    );

    this.logger.info(`🚀 Telegram controller is ready`);
  }

  async sendMessage(to: string, message: string): Promise<void> {
    assert(this.bot !== undefined, 'Bot must be running before setup handlers');
    await this.bot.sendMessage(to, message);
  }

  private processMessage(authorId: string, authorName: string, chatId: string, text: string): void {
    try {
      const messageDto = MessageMapper.parse({ authorId, authorName, chatId, text });
      this.addMessasgeUseCase.execute(messageDto);
    } catch (e: unknown) {
      this.logger.error(e);
    }
  }
}
