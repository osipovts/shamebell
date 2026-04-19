import { AnalyzeMessagesUseCase } from '../../application/usecases/analyze-messages.use-case';
import { ScheduleBindingBuilder } from './schedule-binding.builder';

export const getScheduleBindings = (
  builder: ScheduleBindingBuilder = new ScheduleBindingBuilder(),
) => {
  return builder.bind(
    { name: AnalyzeMessagesUseCase.name, intervalMs: 2_000 },
    AnalyzeMessagesUseCase,
  ); // .bind({ name: 'AnotherUseCase', interval: 10_000 }, AnotherUseCase)
};
