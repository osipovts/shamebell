import { MaybeAsyncVoid } from '../../generic.types';

export type ScheduledTask = () => MaybeAsyncVoid;

export interface ScheduleOptions {
  name: string;
  intervalMs: number;
  runImmediately?: boolean;
}

export interface SchedulerPort {
  schedule(options: ScheduleOptions, task: ScheduledTask): void;
  removeTask(name: string): boolean;
  start(): void;
  stop(): void;
}
