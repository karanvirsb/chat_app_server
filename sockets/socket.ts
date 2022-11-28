import { Server, ServerOptions, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { groupUsers, user } from "../src/Features/group/data-access/group-db";
import { IGroup } from "../src/Features/group/group";
import { IUser } from "../src/Features/user/user";

type props = {
    httpServer: Partial<ServerOptions> | undefined | any;
};

type socket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

type InvalidateEvent = {
    queryTags: string[];
    id: string;
};

type UpdateEvent = {
    groupId: string;
    payload: Partial<IGroup>;
};

export type DeleteEvent = {
    groupId: string;
    payload: {};
};

export type UpdateGroupUsersEvent = {
    groupId: string;
    payload: { userInfo: user };
};

export type LeaveRoomEvent = {
    groupId: string;
    payload: { userId: string };
};

export type LeaveGroupEvent = {
    groupId: string;
    payload: { userId: string };
};

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

            socket.on("leave_room", (data: LeaveRoomEvent) => {
                socket.leave(data.groupId);
            });

            // when the update is successful
            socket.on("updated_group_name", (data: UpdateEvent) => {
                io.to(data.groupId).emit("update_group_name", data);
            });

            socket.on("delete_the_group", (groupData: DeleteEvent) => {
                io.to(groupData.groupId).emit("delete_group", groupData);
            });

            socket.on(
                "update_the_group_users",
                (groupUserData: UpdateGroupUsersEvent) => {
                    io.to(groupUserData.groupId).emit(
                        "update_group_users",
                        groupUserData
                    );
                }
            );

            socket.on("leave_the_group", (groupUserData: LeaveGroupEvent) => {
                io.to(groupUserData.groupId).emit(
                    "removed_user",
                    groupUserData
                );
            });
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
