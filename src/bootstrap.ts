import { ControllerPort } from './application/ports/presentation/controller.port';
import { EventBusPort } from './application/ports/infrastructure/event-bus.port';
import { SchedulerPort } from './application/ports/infrastructure/scheduler.port';
import { createContainer } from './composition-root/container/container';
import { INJECT } from './composition-root/container/container.const';
import { getEventBindings } from './composition-root/event-binding/event-binding';
import { getScheduleBindings } from './composition-root/schedule-binding/schedule-binding';

export function bootstrap(): void {
  const container = createContainer();

  // bind events
  const eventBus = container.get<EventBusPort>(INJECT.EVENT_BUS);
  getEventBindings().build(container, eventBus);

  // schedule
  const scheduler = container.get<SchedulerPort>(INJECT.SCHEDULER);
  getScheduleBindings().build(container, scheduler);

  // start telegram container
  container.get<ControllerPort>(INJECT.CONTROLLER).listen();
}
