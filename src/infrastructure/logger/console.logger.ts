/* eslint-disable no-console */
import { inject, injectable } from 'inversify';
import { LoggerPort, LogLevel } from '../../application/ports/infrastructure/logger.port';
import { INJECT } from '../../composition-root/container/container.const';
import { LoggerConfigPort } from '../../application/ports/infrastructure/configs';

@injectable()
export class ConsoleLogger implements LoggerPort {
  private logLevels: LogLevel[] = Object.values(LogLevel);
  private context: string = ConsoleLogger.name;

  private readonly colors = new Map<LogLevel | 'reset', string>([
    [LogLevel.DEBUG, '\x1b[34m'], // Blue
    [LogLevel.INFO, '\x1b[32m'], // Green
    [LogLevel.WARN, '\x1b[33m'], // Yellow
    [LogLevel.ERROR, '\x1b[31m'], // Red
    ['reset', '\x1b[0m'], // Reset
  ]);

  constructor(@inject(INJECT.CONFIG.LOGGER) private readonly cfg: LoggerConfigPort) {
    this.setLogLevels(this.cfg.logLevels);
  }

  private get timestamp(): string {
    return new Date().toISOString();
  }

  setContext(context: string): void {
    this.context = context;
  }

  setLogLevels(logLevels: LogLevel[]) {
    this.logLevels = logLevels;
  }

  debug(...args: unknown[]): void {
    this.log(LogLevel.DEBUG, args);
  }

  info(...args: unknown[]): void {
    this.log(LogLevel.INFO, args);
  }

  warn(...args: unknown[]): void {
    this.log(LogLevel.WARN, args);
  }

  error(...args: unknown[]): void {
    this.log(LogLevel.ERROR, args);
  }

  private getLogString(level: LogLevel, arg: unknown): unknown {
    if (typeof arg === 'object') {
      return arg;
    }

    const colorStart = this.colors.get(level);
    const colorStop = this.colors.get('reset');
    const prefix = `[${this.timestamp}] [${level.toUpperCase()}] [${this.context}]`;

    return `${colorStart}${prefix} ${arg}${colorStop}`;
  }

  private log(level: LogLevel, args: unknown[]): void {
    if (!this.logLevels.includes(level)) {
      return;
    }

    for (const arg of args) {
      if (arg instanceof Error) {
        this.logError(arg);
      } else {
        this.logCommon(level, arg);
      }
    }
  }

  private logError(error: Error): void {
    console.error(this.getLogString(LogLevel.ERROR, error.message));

    if (error.stack) {
      console.error(this.getLogString(LogLevel.ERROR, error.stack));
    }
  }

  private logCommon(level: LogLevel, arg: unknown): void {
    console[level](this.getLogString(level, arg));
  }
}
