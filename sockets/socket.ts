import { RequestListener, Server } from "http";

type props = {
    httpServer: RequestListener;
};

export default function buildSockets({ httpServer }: props) {
    return function socketIo() {
        const io = new Server(httpServer);

        io.on("connection", (socket) => {});
    };
}
