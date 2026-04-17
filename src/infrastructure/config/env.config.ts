import assert from 'node:assert';
import 'dotenv/config';
import { injectable } from 'inversify';
import { ConfigPort } from '../../application/ports/config.port';
import { isLogLevelArray } from '../../application/ports/logger.port';
import {
  LoggerConfigPort,
  MessageBatchConfigPort,
  TelegramBotConfigPort,
} from '../../application/ports/configs';

@injectable()
export class EnvConfig implements ConfigPort {
  readonly telegramBotConfig: TelegramBotConfigPort;
  readonly loggerConfig: LoggerConfigPort;
  readonly messageBatchConfig: MessageBatchConfigPort;

  constructor() {
    this.telegramBotConfig = this.readTelegramBotConfig();
    this.loggerConfig = this.readLoggerConfig();
    this.messageBatchConfig = this.readMessageBatchConfig();
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
}
