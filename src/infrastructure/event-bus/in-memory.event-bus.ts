import { EventBusPort, EventPort } from '../../application/ports/event-bus.port';
import { Constructor, MaybeAsyncVoid } from '../../generic.types';

export class InMemoryEventBus implements EventBusPort {
  private readonly handlers = new Map<
    Constructor<EventPort>,
    Array<(event: unknown) => MaybeAsyncVoid>
  >();

  public subscribe<E extends EventPort>(
    EventClass: Constructor<E>,
    handler: (event: E) => MaybeAsyncVoid,
  ): void {
    const existingHandlers = this.handlers.get(EventClass) || [];

    existingHandlers.push((event: unknown) => handler(event as E));

    this.handlers.set(EventClass, existingHandlers);
  }

  public async publish(event: EventPort): Promise<void> {
    const EventConstructor = event.constructor as Constructor<EventPort>;

    const eventHandlers = this.handlers.get(EventConstructor);

    if (eventHandlers && eventHandlers.length > 0) {
      await Promise.all(eventHandlers.map((handler) => handler(event)));
    }
  }
}
