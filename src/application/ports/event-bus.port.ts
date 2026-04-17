export type EventType = string; // TODO: enum or something concrete

export interface Event {
  readonly type: string;
}

export interface EventHandler<T extends Event> {
  handle(event: T): Promise<void>;
}

export interface EventBusPort {
  publish<T extends Event>(event: T): void;
  subscribe<T extends Event>(eventType: EventType, handler: EventHandler<T>): () => void;
}
