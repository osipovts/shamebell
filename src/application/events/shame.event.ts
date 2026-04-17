import { MessageDto } from '../ports/dto/message.dto';
import { Event } from '../ports/event-bus.port';

export class ShameEvent implements Event {
  readonly type = ShameEvent.name;

  constructor(public readonly message: MessageDto) {}
}
