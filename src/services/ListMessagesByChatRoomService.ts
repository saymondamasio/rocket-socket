import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
export class ListMessagesByChatRoomService {
  async execute(room_id: string) {
    const messages = await Message.find({ room_id }).populate('to');

    return messages;
  }
}