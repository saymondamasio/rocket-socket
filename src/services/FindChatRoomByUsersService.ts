import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export class FindChatRoomByUsersService {
  async execute(users_id: ObjectId[]) {
    const chat_room = await ChatRoom.findOne({
      users_id: {
        $all: users_id
      }
    }).exec();

    return chat_room
  }
}