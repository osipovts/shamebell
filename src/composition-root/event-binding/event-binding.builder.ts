import { Container } from 'inversify';
import { UseCasePort } from '../../application/ports/application/use-case.port';
import { EventBusPort, EventPort } from '../../application/ports/infrastructure/event-bus.port';
import { Constructor } from '../../generic.types';

export class EventBindingBuilder {
  private readonly bindings: Array<{
    event: Constructor<EventPort>;
    useCase: Constructor<UseCasePort<any>>;
  }> = [];

  bind<E extends EventPort>(
    EventClass: Constructor<E>,
    UseCaseClass: Constructor<UseCasePort<E>>,
  ): this {
    this.bindings.push({ event: EventClass, useCase: UseCaseClass });

    return this;
  }

  build(container: Container, eventBus: EventBusPort): void {
    for (const { event: EventClass, useCase: UseCaseClass } of this.bindings) {
      const useCaseInstance = container.get<UseCasePort>(UseCaseClass);

      eventBus.subscribe(EventClass, (eventInstance: unknown) => {
        useCaseInstance.execute(eventInstance);
      });
    }
  }
}
