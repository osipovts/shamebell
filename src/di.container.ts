import { Container, ResolutionContext } from 'inversify';
import { INJECT } from './di.tokens';
import { EnvConfig } from './infrastructure/config/env.config';
import { ConfigPort } from './application/ports/config.port';
import { TelegramBotConfigPort } from './application/ports/config/telegram-bot-config.port';
import { LoggerConfigPort } from './application/ports/config/logger-config.port';
import { LoggerPort } from './application/ports/logger.port';
import { ConsoleLogger } from './infrastructure/logger/console.logger';
import { ControllerPort } from './application/ports/controller.port';
import { TelegramController } from './presentation/telegram/telegram.controller';

export function createDiContainer(): Container {
  const container = new Container();

  // Config
  container.bind<ConfigPort>(INJECT.CONFIG.ROOT).to(EnvConfig).inSingletonScope();

  // -- telegram bot config
  container
    .bind<TelegramBotConfigPort>(INJECT.CONFIG.TELEGRAM_BOT)
    .toDynamicValue((ctx: ResolutionContext): TelegramBotConfigPort => {
      return ctx.get<ConfigPort>(INJECT.CONFIG.ROOT).telegramBotConfig;
    });

  // -- logger config
  container
    .bind<LoggerConfigPort>(INJECT.CONFIG.LOGGER)
    .toDynamicValue((ctx: ResolutionContext): LoggerConfigPort => {
      return ctx.get<ConfigPort>(INJECT.CONFIG.ROOT).loggerConfig;
    });

  // Infra
  container.bind<LoggerPort>(INJECT.LOGGER).to(ConsoleLogger).inTransientScope();

  // Controllers
  container
    .bind<ControllerPort>(INJECT.TELEGRAM_CONTROLLER)
    .to(TelegramController)
    .inSingletonScope();

  return container;
}
