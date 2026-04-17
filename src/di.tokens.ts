// TODO: rework, make structured
// dependency injection tokens
export const INJECT = Object.freeze({
  // infra
  CONFIG: {
    ROOT: Symbol.for('CONFIG_ROOT'),
    TELEGRAM_BOT: Symbol.for('CONFIG_TELEGRAM_BOT'),
    LOGGER: Symbol.for('CONFIG_LOGGER'),
    MESSAGE_BATCH: Symbol.for('CONFIG_MESSAGE_BATCH'),
  },
  LOGGER: Symbol.for('LOGGER'),
  SHAME_ANALYZER: Symbol.for('SHAME_ANALYZER'),
  EVENT_BUS: Symbol.for('EVENT_BUS'),
  SCHEDULER: Symbol.for('SCHEDULER'),

  // presentation
  CONTROLLER: Symbol.for('CONTROLLER'),
});
