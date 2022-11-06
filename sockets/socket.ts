import { Server, ServerOptions } from "socket.io";

type props = {
    httpServer: Partial<ServerOptions> | undefined | any;
};

export default function buildSockets({ httpServer }: props) {
    return function socketIo() {
        const io = new Server(httpServer, {
            cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
        });

        io.on("connection", (socket) => {
            console.log("Socket is connected", socket.id);
        });

        return io;
    };
}
