import { server } from "./http";
import './websockets/ChatService'


server.listen(3000, () => console.log('Server started on port 3000'))