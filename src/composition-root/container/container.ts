import { ContainerOptions, Container, ResolutionContext } from 'inversify';
import { ConfigPort } from '../../application/ports/config.port';
import {
  TelegramBotConfigPort,
  LoggerConfigPort,
  MessageBatchConfigPort,
} from '../../application/ports/configs';
import { ControllerPort } from '../../application/ports/controller.port';
import { EventBusPort } from '../../application/ports/event-bus.port';
import { LoggerPort } from '../../application/ports/logger.port';
import { SchedulerPort } from '../../application/ports/scheduler.port';
import { ShameAnalyzerPort } from '../../application/ports/shame-analyzer.port';
import { MessageBatchRegistry } from '../../domain/messages/message-batch-registry';
import { EnvConfig } from '../../infrastructure/config/env.config';
import { InMemoryEventBus } from '../../infrastructure/event-bus/in-memory.event-bus';
import { ConsoleLogger } from '../../infrastructure/logger/console.logger';
import { SimpleScheduler } from '../../infrastructure/scheduler/simple.scheduler';
import { MockShameAnalyzer } from '../../infrastructure/shame-analyzer/mock.shame-analyzer';
import { TelegramController } from '../../presentation/telegram/telegram.controller';
import { INJECT } from './container.const';

export function createContainer(
  options: ContainerOptions = { autobind: true, defaultScope: 'Singleton' },
): Container {
  const container = new Container(options);

  // Complete config
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

  // -- message batch config
  container
    .bind<MessageBatchConfigPort>(INJECT.CONFIG.MESSAGE_BATCH)
    .toDynamicValue((ctx: ResolutionContext): MessageBatchConfigPort => {
      return ctx.get<ConfigPort>(INJECT.CONFIG.ROOT).messageBatchConfig;
    });

  // Infra
  container.bind<LoggerPort>(INJECT.LOGGER).to(ConsoleLogger).inTransientScope();
  container.bind<ShameAnalyzerPort>(INJECT.SHAME_ANALYZER).to(MockShameAnalyzer).inSingletonScope();
  container.bind<EventBusPort>(INJECT.EVENT_BUS).to(InMemoryEventBus).inSingletonScope();
  container.bind<SchedulerPort>(INJECT.SCHEDULER).to(SimpleScheduler).inSingletonScope();

  // Controllers
  container.bind<ControllerPort>(INJECT.CONTROLLER).to(TelegramController).inSingletonScope();

  // Create MessageBatchRegistry after all dependencies are bound
  // Domain singletons
  const messageBatchRegistry = new MessageBatchRegistry(
    container.get<MessageBatchConfigPort>(INJECT.CONFIG.MESSAGE_BATCH),
  );
  container.bind(MessageBatchRegistry).toConstantValue(messageBatchRegistry);

  return container;
}
