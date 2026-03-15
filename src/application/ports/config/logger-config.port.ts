import { LogLevel } from '../logger.port';

export interface LoggerConfigPort {
  readonly logLevels: LogLevel[];
}
