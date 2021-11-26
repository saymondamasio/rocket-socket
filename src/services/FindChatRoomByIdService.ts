import { ChatRoom } from "../schemas/ChatRoom";

export class FindChatRoomByIdService {
  async execute(id: string) {
    const room = await ChatRoom.findOne({ id }).populate('users_id');

    return room;
  }
}