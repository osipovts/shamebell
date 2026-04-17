// infrastructure/schedulers/NodeScheduler.ts

import { inject } from 'inversify';
import {
  ScheduledTask,
  ScheduleOptions,
  SchedulerPort,
} from '../../application/ports/scheduler.port';
import { INJECT } from '../../di.tokens';
import { LoggerPort } from '../../application/ports/logger.port';

interface TaskMetaData {
  task: ScheduledTask;
  intervalMs: number;
  timerId: NodeJS.Timeout | null;
  isRunning: boolean;
}

export class SimpleScheduler implements SchedulerPort {
  private tasks: Map<string, TaskMetaData> = new Map();

  constructor(@inject(INJECT.LOGGER) private readonly logger: LoggerPort) {
    this.logger.setContext(SimpleScheduler.name);
  }

  public schedule(options: ScheduleOptions, task: ScheduledTask): void {
    const { name, intervalMs, runImmediately = false } = options;

    if (this.tasks.has(name)) {
      this.logger.warn(`Task "${name}" already exists and will be overwritten`);
      this.removeTask(name);
    }

    const metaData: TaskMetaData = {
      task,
      intervalMs,
      timerId: null,
      isRunning: true,
    };

    this.tasks.set(name, metaData);

    if (runImmediately) {
      this.executeTask(name);
    } else {
      this.setTimer(name);
    }
  }

  /**
   * @returns true if task exists and was stopped, false otherwise
   */
  public removeTask(name: string): boolean {
    const metaData = this.tasks.get(name);
    if (!metaData) return false;

    metaData.isRunning = false;
    if (metaData.timerId) {
      clearTimeout(metaData.timerId);
    }

    return this.tasks.delete(name);
  }

  public start(): void {
    for (const [name, metaData] of this.tasks.entries()) {
      if (!metaData.isRunning) {
        metaData.isRunning = true;
        this.setTimer(name);
      }
    }
  }

  public stop(): void {
    for (const name of this.tasks.keys()) {
      this.removeTask(name);
    }
  }

  private setTimer(name: string): void {
    const metaData = this.tasks.get(name);
    if (!metaData || !metaData.isRunning) return;

    metaData.timerId = setTimeout(() => {
      this.executeTask(name);
    }, metaData.intervalMs);
  }

  private async executeTask(name: string): Promise<void> {
    const metaData = this.tasks.get(name);
    if (!metaData || !metaData.isRunning) return;

    try {
      await metaData.task();
    } catch (error) {
      this.logger.error(`Error executing task "${name}":`, error);
    } finally {
      this.setTimer(name);
    }
  }
}
