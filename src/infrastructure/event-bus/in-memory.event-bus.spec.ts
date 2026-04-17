jest.mock('inversify', () => ({
  injectable: () => (target: unknown) => target,
  inject: () => () => undefined,
}));

import { InMemoryEventBus } from './in-memory.event-bus';
import type { LoggerPort } from '../../application/ports/logger.port';
import type { Event, EventHandler } from '../../application/ports/event-bus.port';

const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

describe('InMemoryEventBus', () => {
  const createLoggerMock = () =>
    ({
      setContext: jest.fn(),
      error: jest.fn(),
    }) as unknown as jest.Mocked<LoggerPort>;

  it('should publish event asynchronously and call subscribed handler', async () => {
    const logger = createLoggerMock();
    const bus = new InMemoryEventBus(logger);

    const handler = {
      handle: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EventHandler<any>>;

    bus.subscribe('test.event', handler);

    const event = { type: 'test.event', payload: { id: 1 } } as Event;
    bus.publish(event);

    await flush();

    expect(handler.handle).toHaveBeenCalledTimes(1);
    expect(handler.handle).toHaveBeenCalledWith(event);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should log error when handler throws', async () => {
    const logger = createLoggerMock();
    const bus = new InMemoryEventBus(logger);

    const error = new Error('boom');

    const handler = {
      handle: jest.fn().mockRejectedValue(error),
    } as unknown as jest.Mocked<EventHandler<any>>;

    bus.subscribe('test.event', handler);

    const event = { type: 'test.event' } as Event;
    bus.publish(event);

    await flush();

    expect(handler.handle).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith('Error while handling test.event', error);
  });

  it('should unsubscribe handler', async () => {
    const logger = createLoggerMock();
    const bus = new InMemoryEventBus(logger);

    const handler = {
      handle: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EventHandler<any>>;

    const unsubscribe = bus.subscribe('test.event', handler);
    unsubscribe();

    bus.publish({ type: 'test.event' } as Event);

    await flush();

    expect(handler.handle).not.toHaveBeenCalled();
  });
});
