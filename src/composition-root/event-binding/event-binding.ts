import { ShameEvent } from '../../application/events/shame.event';
import { ShameUseCase } from '../../application/usecases/shame.use-case';
import { EventBindingBuilder } from './event-binding.builder';

export const getEventBindings = (builder: EventBindingBuilder = new EventBindingBuilder()) => {
  return builder.bind(ShameEvent, ShameUseCase); // .bind(Event, UseCase).bind(AnotherEvent, AnotherUseCase)
};
