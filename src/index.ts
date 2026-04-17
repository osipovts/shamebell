import { ShameEventHandler } from './application/events/shame-event.handler';
import { ShameEvent } from './application/events/shame.event';
import { ControllerPort } from './application/ports/controller.port';
import { EventBusPort } from './application/ports/event-bus.port';
import { SchedulerPort } from './application/ports/scheduler.port';
import { AnalyzeMessagesUseCase } from './application/usecases/analyze-messages.use-case';
import { createDiContainer } from './di.container';
import { INJECT } from './di.tokens';

function start(): void {
  const container = createDiContainer();

  // subscribe application event handlers
  const eventBus = container.get<EventBusPort>(INJECT.EVENT_BUS);
  eventBus.subscribe(ShameEvent.name, container.get(ShameEventHandler));

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

start();
