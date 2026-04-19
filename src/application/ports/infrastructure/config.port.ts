import { LoggerConfigPort, MessageBatchConfigPort, TelegramBotConfigPort } from './configs';

export interface ConfigPort {
  readonly telegramBotConfig: TelegramBotConfigPort;
  readonly loggerConfig: LoggerConfigPort;
  readonly messageBatchConfig: MessageBatchConfigPort;
}
