import assert from 'node:assert';
import 'dotenv/config';
import { TelegramBotConfigPort } from '../../application/ports/config/telegram-bot-config.port';
import { injectable } from 'inversify';
import { ConfigPort } from '../../application/ports/config.port';
import { LoggerConfigPort } from '../../application/ports/config/logger-config.port';
import { isLogLevelArray } from '../../application/ports/logger.port';

@injectable()
export class EnvConfig implements ConfigPort {
  readonly telegramBotConfig: TelegramBotConfigPort;
  readonly loggerConfig: LoggerConfigPort;

  constructor() {
    this.telegramBotConfig = this.readTelegramBotConfig();
    this.loggerConfig = this.readLoggerConfig();
  }

  private readTelegramBotConfig(): TelegramBotConfigPort {
    return {
      token: process.env.TELEGRAM_BOT_TOKEN ?? '',
    };
  }

  private readLoggerConfig(): LoggerConfigPort {
    const logLevels = (process.env.LOGGER_LOG_LEVELS ?? '').split(',');

    assert(isLogLevelArray(logLevels));

    return { logLevels };
  }
}
