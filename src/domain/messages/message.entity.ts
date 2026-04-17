export class MessageEntity {
  constructor(
    public readonly authorId: string,
    public readonly authorName: string,
    public readonly chatId: string,
    public readonly text: string,
    public isAshamed?: boolean,
  ) {}

  markAsAshamed() {
    this.isAshamed = true;
    return this;
  }
}
