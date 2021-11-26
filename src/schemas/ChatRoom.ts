import mongoose, { Document, Schema } from "mongoose"
import { v4 as uuid } from 'uuid'
import { User } from "./User"

type ChatRoom = Document & {
  users_id: User[];
  id: string;
}

const ChatRoomSchema = new Schema({
  users_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users"
    }
  ],
  id: {
    type: String,
    default: uuid
  }
})

const ChatRoom = mongoose.model<ChatRoom>("ChatRoom", ChatRoomSchema)

export { ChatRoom }