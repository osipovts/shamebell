import z from 'zod';
import { MessageDto } from '../../application/dto/message.dto';

export const MessageMapper = z
  .object({
    authorId: z.string().nonempty().max(32),
    authorName: z.string().nonempty().max(32),
    chatId: z.string().nonempty().max(32),
    text: z.string().nonempty().max(4096),
  })
  .transform((data) => new MessageDto(data));
