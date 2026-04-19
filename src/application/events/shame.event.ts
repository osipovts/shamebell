import { MessageDto } from '../dto/message.dto';
import { __EVENT_BRAND, EventPort } from '../ports/infrastructure/event-bus.port';

export class ShameEvent implements EventPort {
  readonly [__EVENT_BRAND]: void = undefined;

  constructor(public readonly message: MessageDto) {}
}
