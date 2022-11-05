import { RequestListener } from "http";
import { Server, ServerOptions } from "socket.io";

type props = {
    httpServer: Partial<ServerOptions> | undefined;
};

export default function buildSockets({ httpServer }: props) {
    return function socketIo() {
        const io = new Server(httpServer);

        io.on("connection", (socket) => {});
    };
}
