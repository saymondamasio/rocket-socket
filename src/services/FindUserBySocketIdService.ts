import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
export class FindUserBySocketIdService {
  async execute(socket_id: string) {
    const user = await User.findOne({
      socket_id
    })

    return user
  }
}