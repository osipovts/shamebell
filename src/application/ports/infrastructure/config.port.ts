import { LoggerConfigPort, MessageBatchConfigPort, TelegramBotConfigPort } from './configs';
import { OpenRouterConfigPort } from './configs/open-router-config.port';

export interface ConfigPort {
  readonly telegramBotConfig: TelegramBotConfigPort;
  readonly loggerConfig: LoggerConfigPort;
  readonly messageBatchConfig: MessageBatchConfigPort;
  readonly openRouterConfig: OpenRouterConfigPort;
}
