import { MaybeAsyncVoid } from '../../../generic.types';

export interface UseCasePort<Event = unknown> {
  execute(...args: unknown[]): MaybeAsyncVoid;
  execute(event: Event): MaybeAsyncVoid;
}
