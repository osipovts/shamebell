import assert from 'node:assert';
import 'dotenv/config';
import { injectable } from 'inversify';
import { ConfigPort } from '../../application/ports/infrastructure/config.port';
import { isLogLevelArray } from '../../application/ports/infrastructure/logger.port';
import {
  TelegramBotConfigPort,
  LoggerConfigPort,
  MessageBatchConfigPort,
} from '../../application/ports/infrastructure/configs';
import { OpenRouterConfigPort } from '../../application/ports/infrastructure/configs/open-router-config.port';

@injectable()
export class EnvConfig implements ConfigPort {
  readonly telegramBotConfig: TelegramBotConfigPort;
  readonly loggerConfig: LoggerConfigPort;
  readonly messageBatchConfig: MessageBatchConfigPort;
  readonly openRouterConfig: OpenRouterConfigPort;

  constructor() {
    this.telegramBotConfig = this.readTelegramBotConfig();
    this.loggerConfig = this.readLoggerConfig();
    this.messageBatchConfig = this.readMessageBatchConfig();
    this.openRouterConfig = this.readOpenRouterConfig();
  }

  private readTelegramBotConfig(): TelegramBotConfigPort {
    const { TELEGRAM_BOT_TOKEN: token } = process.env;

    assert(typeof token === 'string');

    return { token };
  }

  private readLoggerConfig(): LoggerConfigPort {
    const logLevels = (process.env.LOGGER_LOG_LEVELS ?? '').split(',');

    assert(isLogLevelArray(logLevels));

    return { logLevels };
  }

  private readMessageBatchConfig(): MessageBatchConfigPort {
    const countLimit = Number(process.env.MESSAGE_BATCH_COUNT_LIMIT);
    const timeLimit = Number(process.env.MESSAGE_BATCH_TIME_LIMIT);

    assert(!isNaN(countLimit) && Number.isSafeInteger(countLimit));
    assert(!isNaN(timeLimit) && Number.isSafeInteger(timeLimit));

    return { countLimit, timeLimit };
  }

  private readOpenRouterConfig(): OpenRouterConfigPort {
    const {
      OPEN_ROUTER_URL: url,
      OPEN_ROUTER_API_KEY: apiKey,
      OPEN_ROUTER_MODEL: model,
    } = process.env;

    assert(typeof url === 'string');
    assert(typeof apiKey === 'string');
    assert(typeof model === 'string');

    return { url, apiKey, model };
  }
}
