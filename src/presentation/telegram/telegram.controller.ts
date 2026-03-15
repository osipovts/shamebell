import TelegramBot from 'node-telegram-bot-api';
import { inject, injectable } from 'inversify';
import { ControllerPort } from '../../application/ports/controller.port';
import { INJECT } from '../../di.tokens';
import { TelegramBotConfigPort } from '../../application/ports/config/telegram-bot-config.port';
import { LoggerPort } from '../../application/ports/logger.port';
import assert from 'node:assert';

@injectable()
export class TelegramController implements ControllerPort {
  private bot: TelegramBot | undefined;

  constructor(
    @inject(INJECT.CONFIG.TELEGRAM_BOT) private readonly cfg: TelegramBotConfigPort,
    @inject(INJECT.LOGGER) private readonly logger: LoggerPort,
  ) {
    this.logger.setContext(TelegramController.name);
  }

  listen(): void {
    this.bot = new TelegramBot(this.cfg.token, { polling: true });
    this.logger.info(`Bot is listening for commands`);
    this.setupCommandHandlers();
  }

  private setupCommandHandlers(): void {
    assert(this.bot !== undefined, 'Bot must be running before setup handlers');

    this.bot.onText(/./, (msg) => {
      this.logger.info(`Echo ${msg.text} to ${msg.from?.id}`);
      this.bot?.sendMessage(msg.from!.id, msg.text ?? '');
    });
  }
}
