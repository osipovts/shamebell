export class MessageDto {
  readonly authorId!: string;
  readonly authorName!: string;
  readonly chatId!: string;
  readonly text!: string;

  constructor(data: Partial<MessageDto>) {
    Object.assign(this, data);
  }
}
