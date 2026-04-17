import { MessageBatch } from './message-batch';
import { MessageEntity } from './message.entity';

describe('MessageBatch', () => {
  let batch: MessageBatch;
  const testChatId = 'test-chat-id';

  const createMsg = (text: string) => new MessageEntity('u1', 'User 1', testChatId, text);

  beforeEach(() => {
    // Ready limits: 3 messages OR 10 seconds
    batch = new MessageBatch({ countLimit: 3, timeLimit: 10 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Readiness Logic (isReady)', () => {
    it('should be ready when the message count reaches the limit', () => {
      batch.add(createMsg('1'));
      batch.add(createMsg('2'));

      // Not ready yet (2 < 3)
      expect(batch.isReady()).toBe(false);

      batch.add(createMsg('3'));

      // Ready by count
      expect(batch.isReady()).toBe(true);
    });

    it('should be ready when the time limit has passed', () => {
      jest.useFakeTimers();
      const now = new Date('2026-01-01T10:00:00Z');
      jest.setSystemTime(now);

      // Add one message (timer starts)
      batch.add(createMsg('first'));

      // 5 seconds passed (limit 10) - not ready
      jest.setSystemTime(new Date('2026-01-01T10:00:05Z'));
      expect(batch.isReady()).toBe(false);

      // 11 seconds passed - ready by time
      jest.setSystemTime(new Date('2026-01-01T10:00:11Z'));
      expect(batch.isReady()).toBe(true);
    });

    it('should not be ready if empty', () => {
      expect(batch.isReady()).toBe(false);
    });
  });

  describe('add method', () => {
    it('should start timing on first message', () => {
      jest.useFakeTimers();
      const now = new Date('2026-01-01T10:00:00Z');
      jest.setSystemTime(now);

      batch.add(createMsg('first'));

      // Time starts with first message
      expect(batch.isReady()).toBe(false);

      // Fast forward to time limit
      jest.setSystemTime(new Date('2026-01-01T10:00:10Z'));
      expect(batch.isReady()).toBe(true);
    });

    it('should throw error when trying to add message to full batch', () => {
      batch.add(createMsg('1'));
      batch.add(createMsg('2'));
      batch.add(createMsg('3'));

      expect(() => batch.add(createMsg('4'))).toThrow();
    });
  });
});
