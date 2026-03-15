// dependency injection tokens
export const INJECT = Object.freeze({
  // infra
  CONFIG: {
    ROOT: Symbol.for('CONFIG_ROOT'),
    TELEGRAM_BOT: Symbol.for('CONFIG_TELEGRAM_BOT'),
    LOGGER: Symbol.for('CONFIG_LOGGER'),
  },
  LOGGER: Symbol.for('LOGGER'),

  // presentation
  TELEGRAM_CONTROLLER: Symbol.for('TELEGRAM_CONTROLLER'),
});
