const PORT = 8000;
import app from "./app";
import httpServer from "./sockets";

import setupChannelDb from "./src/Features/groupChannel/db";
import setUpGroupDb from "./src/Features/group/db";
import setupMessageDb from "./src/Features/groupMessage/db";
import setupUserDb from "./src/Features/user/db";
import setupPrivateChannelDb from "./src/Features/privateChannel/db";
import setupPrivateMessageDb from "./src/Features/privateMessage/db";
import setupFriendsDb from "./src/Features/friends/db";

httpServer.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
    setupUserDb();
    setUpGroupDb();
    setupChannelDb();
    setupPrivateChannelDb();
    setupMessageDb();
    setupPrivateMessageDb();
    setupFriendsDb();
});

// app.listen(PORT, () => {
//     console.log(`listening on port: ${PORT}`);
//     setupUserDb();
//     setUpGroupDb();
//     setupChannelDb();
//     setupPrivateChannelDb();
//     setupMessageDb();
//     setupPrivateMessageDb();
//     setupFriendsDb();
// });
