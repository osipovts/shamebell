import { ControllerPort } from './application/ports/controller.port';
import { EventBusPort } from './application/ports/event-bus.port';
import { SchedulerPort } from './application/ports/scheduler.port';
import { AnalyzeMessagesUseCase } from './application/usecases/analyze-messages.use-case';
import { createContainer } from './composition-root/container/container';
import { INJECT } from './composition-root/container/container.const';
import { getEventBindings } from './composition-root/event-binding/event-binding';

export function bootstrap(): void {
  const container = createContainer();

  // bind events
  const eventBus = container.get<EventBusPort>(INJECT.EVENT_BUS);
  const eventBindings = getEventBindings();
  eventBindings.register(container, eventBus);

  // schedule analyze
  const scheduler = container.get<SchedulerPort>(INJECT.SCHEDULER);
  const analyzeMessagesUseCase = container.get<AnalyzeMessagesUseCase>(AnalyzeMessagesUseCase);
  scheduler.schedule(
    { intervalMs: 2_000, name: AnalyzeMessagesUseCase.name },
    analyzeMessagesUseCase.execute.bind(analyzeMessagesUseCase),
  );

  // start telegram container
  container.get<ControllerPort>(INJECT.CONTROLLER).listen();
}
