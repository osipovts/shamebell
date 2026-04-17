import { inject, injectable } from 'inversify';
import {
  Event,
  EventBusPort,
  EventHandler,
  EventType,
} from '../../application/ports/event-bus.port';
import EventEmitter from 'node:events';
import { INJECT } from '../../di.tokens';
import { LoggerPort } from '../../application/ports/logger.port';

@injectable()
export class InMemoryEventBus implements EventBusPort {
  private readonly emitter = new EventEmitter();

  constructor(@inject(INJECT.LOGGER) private readonly logger: LoggerPort) {
    this.logger.setContext(InMemoryEventBus.name);
  }

  publish<T extends Event>(event: T): void {
    queueMicrotask(() => {
      this.emitter.emit(event.type, event);
    });
  }

  /**
   * @returns unsubscribe function
   */
  subscribe<T extends Event>(eventType: EventType, handler: EventHandler<T>): () => void {
    const wrappedHandler = async (event: T) => {
      try {
        await handler.handle(event);
      } catch (e: unknown) {
        this.logger.error(`Error while handling ${eventType}`, e);
      }
    };

    this.emitter.on(eventType, wrappedHandler);

    return () => {
      this.emitter.off(eventType, wrappedHandler);
    };
  }
}
