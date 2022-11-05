import { Server } from "http";

export default function buildSockets({ httpServer }: any) {
    return function socketIo() {
        const io = new Server(httpServer);

        io.on("connection", (socket) => {});
    };
}
