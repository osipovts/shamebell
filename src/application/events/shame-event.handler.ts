import { inject, injectable } from 'inversify';
import { EventHandler } from '../ports/event-bus.port';
import { ShameEvent } from './shame.event';
import { ShameUseCase } from '../usecases/shame.use-case';

@injectable()
export class ShameEventHandler implements EventHandler<ShameEvent> {
  constructor(@inject(ShameUseCase) private readonly shameUseCase: ShameUseCase) {}

  async handle(event: ShameEvent): Promise<void> {
    this.shameUseCase.execute(event.message);
  }
}
