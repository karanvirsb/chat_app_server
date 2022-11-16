import { Server, ServerOptions, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type props = {
    httpServer: Partial<ServerOptions> | undefined | any;
};

type socket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export default function buildSockets({ httpServer }: props) {
    return function socketIo() {
        const io = new Server(httpServer, {
            cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
        });

        io.on("connection", (socket) => {
            console.log("Socket is connected", socket.id);
        });

        // makes the socket join all the rooms
        io.on("JoinRooms", joinRooms());

        return io;
    };
}
function joinRooms(): (...args: any[]) => void {
    return ({ socket, rooms }: { socket: socket; rooms: string[] }) => {
        socket.join(rooms);
    };
}
