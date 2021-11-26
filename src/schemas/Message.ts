import mongoose, { Document, Schema } from 'mongoose'

type Message = Document & {
  to: string
  text: string
  created_at: Date
  room_id: string
}

const MessageSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  text: String,
  room_id: {
    type: String,
    ref: 'ChatRooms',
  },
  created_at: {
    type: Date,
    default: Date.now(),
  }
})

const Message = mongoose.model<Message>('Messages', MessageSchema)

export { Message }
