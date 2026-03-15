export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export function isLogLevel(obj: unknown): obj is LogLevel {
  return typeof obj === 'string' && Object.values(LogLevel).map(String).includes(obj);
}

export function isLogLevelArray(obj: unknown): obj is LogLevel[] {
  return Array.isArray(obj) && obj.every((item) => isLogLevel(item));
}

export interface LoggerPort {
  setContext(context: string): void;
  setLogLevels(logLevels: LogLevel[]): void;

  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: (Error | unknown)[]): void;
}
