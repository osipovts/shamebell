import { MessageEntity } from '../../domain/messages/message.entity';

export interface ShameAnalyzerPort {
  analyze(messages: MessageEntity[]): Promise<MessageEntity[]>; // MessageEntity.isAshamed
}
