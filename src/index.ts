import { ControllerPort } from './application/ports/controller.port';
import { createDiContainer } from './di.container';
import { INJECT } from './di.tokens';

function start(): void {
  const container = createDiContainer();

  // start telegram container
  container.get<ControllerPort>(INJECT.TELEGRAM_CONTROLLER).listen();
}

start();
