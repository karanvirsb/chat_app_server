import { Server, ServerOptions, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { groupUsers } from "../src/Features/group/data-access/group-db";
import { IGroup } from "../src/Features/group/group";

type props = {
    httpServer: Partial<ServerOptions> | undefined | any;
};

type socket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

const chatRooms = new Map<string, Set<string>>();

export default function buildSockets({ httpServer }: props) {
    return function socketIo() {
        const io = new Server(httpServer, {
            cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
        });

        io.on("connection", (socket) => {
            console.log("Socket is connected", socket.id);

            // makes the socket join all the rooms
            socket.on("join_rooms", joinRooms(socket));

            // when the update is successful
            socket.on("update_the_group_name", (groupData: IGroup) => {
                io.in(groupData.groupId).emit("update_group_name", groupData);
            });

            socket.on("delete_the_group", (groupData: IGroup) => {
                io.in(groupData.groupId).emit("delete_group", groupData);
            });

            socket.on("added_user_to_group", (groupUserData: groupUsers) => {
                console.log(groupUserData);
                io.in(groupUserData.gId).emit("added_user", groupUserData);
            });

            socket.on(
                "removed_user_from_group",
                (groupUserData: groupUsers) => {
                    console.log(groupUserData);
                    io.in(groupUserData.gId).emit(
                        "removed_user",
                        groupUserData
                    );
                }
            );
        });

        return io;
    };
}
function joinRooms(socket: socket): (...args: any[]) => void {
    return ({
        rooms,
        userId,
    }: {
        rooms: string | string[];
        userId: string;
    }) => {
        // for (let room of rooms) {
        //     // if room exists added user
        //     if (chatRooms.has(room)) {
        //         const users = chatRooms.get(room);
        //         users?.add(userId);
        //     } else {
        //         // if room doesnt exist add room and user
        //         const users = new Set<string>();
        //         users.add(userId);
        //         chatRooms.set(room, users);
        //     }
        // }
        console.log(
            `socketId: ${socket.id} and userId: ${userId} is joining rooms: ${rooms}`
        );
        socket.join(rooms);
    };
}
