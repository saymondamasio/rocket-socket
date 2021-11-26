import { container } from "tsyringe";
import { io } from "../http";
import { CreateUserService } from "../services/CreateUserService";
import { ListUsersService } from '../services/ListUsersService'
import { CreateChatRoomService } from '../services/CreateChatRoomService'
import { FindUserBySocketIdService } from "../services/FindUserBySocketIdService";
import { FindChatRoomByUsersService } from "../services/FindChatRoomByUsersService";
import { CreateMessageService } from "../services/CreateMessageService";
import { ListMessagesByChatRoomService } from "../services/ListMessagesByChatRoomService";
import { FindChatRoomByIdService } from "../services/FindChatRoomByIdService";

io.on('connect', socket => {

  socket.on('start', async ({ avatar, email, name }) => {
    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({ avatar, email, name, socket_id: socket.id });

    socket.broadcast.emit('new_user', user)
  })

  socket.on('load_users', async (callback) => {
    const listUsersService = container.resolve(ListUsersService);

    const users = await listUsersService.execute();

    callback(users)
  })

  socket.on('start_chat', async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const findChatRoomByUsersService = container.resolve(FindChatRoomByUsersService);
    const findUserBySocketIdService = container.resolve(FindUserBySocketIdService);
    const listMessagesByChatRoomService = container.resolve(ListMessagesByChatRoomService);

    const userLogged = await findUserBySocketIdService.execute(socket.id);

    let chatRoom = await findChatRoomByUsersService.execute([userLogged!._id, data.user_id]);

    if (!chatRoom) {
      chatRoom = await createChatRoomService.execute([userLogged!._id, data.user_id]);
    }

    socket.join(chatRoom.id);

    const messages = await listMessagesByChatRoomService.execute(chatRoom.id);

    callback({ chatRoom, messages })
  })

  socket.on('send_message', async data => {
    const findUserBySocketIdService = container.resolve(FindUserBySocketIdService);
    const createMessageService = container.resolve(CreateMessageService);
    const findChatRoomByIdService = container.resolve(FindChatRoomByIdService);

    const user_send = await findUserBySocketIdService.execute(socket.id);

    if (data.room_id) {
      const message = await createMessageService.execute({
        to: user_send!._id,
        room_id: data.room_id,
        text: data.message,
      })

      io.to(data.room_id).emit('new_message', { message, user_send })

      const room = await findChatRoomByIdService.execute(data.room_id);

      room?.users_id.forEach(user => {

        if (user._id !== user_send!._id) {
          io.to(user.socket_id).emit('notification', {
            new_message: true,
            room_id: data.room_id,
            from: user_send
          })
        }
      })

    }
  })
})