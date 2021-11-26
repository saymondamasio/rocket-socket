import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

interface CreateMessageDTO {
  to: string;
  text: string;
  room_id: string;
}

@injectable()
export class CreateMessageService {
  async execute({ text, to, room_id }: CreateMessageDTO) {
    const message = await Message.create({
      to, text, room_id
    });

    return message
  }
}