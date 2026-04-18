import { MaybeAsyncVoid, Constructor } from '../../generic.types';

export const __EVENT_BRAND = Symbol('__EVENT_BRAND');

export interface EventPort {
  readonly [__EVENT_BRAND]: void; // using nominal typing to avoid inheritance
}

export interface EventBusPort {
  publish(event: EventPort): MaybeAsyncVoid;

  subscribe<E extends EventPort>(
    EventClass: Constructor<E>,
    handler: (event: E) => MaybeAsyncVoid,
  ): void;
}
