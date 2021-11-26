import { injectable } from "tsyringe";
import { User } from "../schemas/User";

interface CreateUserDTO {
  email: string;
  socket_id: string;
  avatar: string;
  name: string;
}

@injectable()
export class CreateUserService {
  async execute({ avatar, email, name, socket_id, }: CreateUserDTO) {
    const userAlreadyExists = await User.findOne({ email }).exec();

    if (userAlreadyExists) {
      const user = await User.findOneAndUpdate({
        _id: userAlreadyExists._id
      }, {
        $set: {
          socket_id,
          avatar,
          name
        }
      })

      return user;
    } else {
      const user = await User.create({
        email,
        socket_id,
        avatar,
        name
      })

      return user;
    }


  }
}