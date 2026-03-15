import { LoggerConfigPort } from './config/logger-config.port';
import { TelegramBotConfigPort } from './config/telegram-bot-config.port';

export interface ConfigPort {
  readonly telegramBotConfig: TelegramBotConfigPort;
  readonly loggerConfig: LoggerConfigPort;
}
