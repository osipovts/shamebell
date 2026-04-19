import { Container } from 'inversify';
import { ScheduleOptions, SchedulerPort } from '../../application/ports/scheduler.port';
import { UseCasePort } from '../../application/ports/use-case.port';
import { Constructor } from '../../generic.types';

export class ScheduleBindingBuilder {
  private readonly bindings: Array<{
    options: ScheduleOptions;
    useCase: Constructor<UseCasePort<void>>;
  }> = [];

  bind(options: ScheduleOptions, UseCaseClass: Constructor<UseCasePort<void>>): this {
    this.bindings.push({ options, useCase: UseCaseClass });

    return this;
  }

  build(container: Container, scheduler: SchedulerPort): void {
    for (const { options, useCase: UseCaseClass } of this.bindings) {
      const useCaseInstance = container.get<UseCasePort<void>>(UseCaseClass);
      const useCaseHandler = useCaseInstance.execute.bind(useCaseInstance);
      scheduler.schedule(options, useCaseHandler);
    }
  }
}
