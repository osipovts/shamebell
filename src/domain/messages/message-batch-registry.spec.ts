import { MessageBatchRegistry, MessageBatchMap } from './message-batch-registry';
import { MessageBatch } from './message-batch';
import { MessageEntity } from './message.entity';

describe('MessageBatchRegistry', () => {
  let registry: MessageBatchRegistry;
  const testChatId = 'test-chat-id';
  const otherChatId = 'other-chat-id';
  const config = { countLimit: 3, timeLimit: 10 };

  const createMsg = (chatId: string, text: string) =>
    new MessageEntity('u1', 'User 1', chatId, text);

  beforeEach(() => {
    registry = new MessageBatchRegistry(config);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('addMessage', () => {
    it('should create a new batch when chat does not exist', () => {
      const message = createMsg(testChatId, 'test message');
      const result = registry.addMessage(message);

      expect(result).toBeInstanceOf(MessageBatch);
      expect(result.getMessages()).toHaveLength(1);
      expect(result.getMessages()[0]).toBe(message);
    });

    it('should add message to existing batch when chat exists', () => {
      const message1 = createMsg(testChatId, 'first message');
      const message2 = createMsg(testChatId, 'second message');

      registry.addMessage(message1);
      const result = registry.addMessage(message2);

      expect(result.getMessages()).toHaveLength(2);
      expect(result.getMessages()).toContain(message1);
      expect(result.getMessages()).toContain(message2);
    });

    it('should handle messages from different chats separately', () => {
      const message1 = createMsg(testChatId, 'chat1 message');
      const message2 = createMsg(otherChatId, 'chat2 message');

      registry.addMessage(message1);
      const result2 = registry.addMessage(message2);

      const batches = registry['batches'];
      expect(batches.has(testChatId)).toBe(true);
      expect(batches.has(otherChatId)).toBe(true);

      const batch1 = batches.get(testChatId)!;
      const batch2 = batches.get(otherChatId)!;

      expect(batch1.getMessages()).toHaveLength(1);
      expect(batch1.getMessages()[0]).toBe(message1);
      expect(batch2.getMessages()).toHaveLength(1);
      expect(batch2.getMessages()[0]).toBe(message2);
    });
  });

  describe('takeAwayReadyBatches', () => {
    it('should return empty map when no batches are ready', () => {
      const message1 = createMsg(testChatId, 'not ready yet');
      registry.addMessage(message1);

      const result = registry.takeAwayReadyBatches();

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('should return ready batches and remove them from registry', () => {
      const message1 = createMsg(testChatId, 'message 1');
      const message2 = createMsg(testChatId, 'message 2');
      const message3 = createMsg(testChatId, 'message 3');

      registry.addMessage(message1);
      registry.addMessage(message2);
      const batch = registry.addMessage(message3);

      const result = registry.takeAwayReadyBatches();

      expect(result.size).toBe(1);
      expect(result.has(testChatId)).toBe(true);
      expect(result.get(testChatId)).toBe(batch);

      expect(registry['batches'].has(testChatId)).toBe(false);
    });

    it('should return multiple ready batches from different chats', () => {
      const message1 = createMsg(testChatId, '1');
      const message2 = createMsg(testChatId, '2');
      const message3 = createMsg(testChatId, '3');

      const message4 = createMsg(otherChatId, '1');
      const message5 = createMsg(otherChatId, '2');
      const message6 = createMsg(otherChatId, '3');

      registry.addMessage(message1);
      registry.addMessage(message2);
      registry.addMessage(message3);

      registry.addMessage(message4);
      registry.addMessage(message5);
      registry.addMessage(message6);

      const result = registry.takeAwayReadyBatches();

      expect(result.size).toBe(2);
      expect(result.has(testChatId)).toBe(true);
      expect(result.has(otherChatId)).toBe(true);

      // Проверяем, что оба батча удалены из реестра
      expect(registry['batches'].has(testChatId)).toBe(false);
      expect(registry['batches'].has(otherChatId)).toBe(false);
    });

    it('should return only ready batches and leave non-ready ones', () => {
      const message1 = createMsg(testChatId, '1');
      const message2 = createMsg(testChatId, '2');

      const message3 = createMsg(otherChatId, '1');
      const message4 = createMsg(otherChatId, '2');
      const message5 = createMsg(otherChatId, '3');

      registry.addMessage(message1);
      registry.addMessage(message2);

      registry.addMessage(message3);
      registry.addMessage(message4);
      registry.addMessage(message5);

      const result = registry.takeAwayReadyBatches();

      expect(result.size).toBe(1);
      expect(result.has(otherChatId)).toBe(true);
      expect(result.has(testChatId)).toBe(false);

      expect(registry['batches'].has(testChatId)).toBe(true);
      expect(registry['batches'].get(testChatId)?.getMessages()).toHaveLength(2);
    });

    it('should handle time-limited ready batches', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-01T10:00:00Z'));

      const message1 = createMsg(testChatId, 'first message');
      registry.addMessage(message1);

      jest.setSystemTime(new Date('2026-01-01T10:00:11Z'));

      const result = registry.takeAwayReadyBatches();

      expect(result.size).toBe(1);
      expect(result.has(testChatId)).toBe(true);
      expect(registry['batches'].has(testChatId)).toBe(false);
    });
  });

  describe('integration with MessageBatch', () => {
    it('should use MessageBatch correctly for each chat', () => {
      const message1 = createMsg(testChatId, '1');
      const message2 = createMsg(testChatId, '2');

      registry.addMessage(message1);
      const batch = registry.addMessage(message2);

      expect(batch).toBeInstanceOf(MessageBatch);
    });

    it('should respect batch limits for each chat separately', () => {
      const message1 = createMsg(testChatId, '1');
      const message2 = createMsg(testChatId, '2');
      const message3 = createMsg(testChatId, '3');
      const message4 = createMsg(testChatId, '4');

      registry.addMessage(message1);
      registry.addMessage(message2);
      registry.addMessage(message3);

      expect(() => registry.addMessage(message4)).toThrow();
    });
  });
});
