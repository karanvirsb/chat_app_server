const PORT = 8000;
import httpServer from "./sockets";
import setupChannelDb from "./src/Features/groupChannel/db";
import setUpGroupDb from "./src/Features/group/db";
import setupMessageDb from "./src/Features/groupMessage/db";
import setupUserDb from "./src/Features/user/db";
import setupPrivateChannelDb from "./src/Features/privateChannel/db";
import setupPrivateMessageDb from "./src/Features/privateMessage/db";
import setupFriendsDb from "./src/Features/friends/db";
import sleep from "./src/Utilities/sleep";

httpServer.listen(PORT, async () => {
  console.log(`listening on port: ${PORT}`);
  try {
    await setupUserDb();
    await sleep(1000);

    await setUpGroupDb();
    await sleep(1000);

    await setupChannelDb();
    await sleep(1000);

    await setupPrivateChannelDb();
    await sleep(1000);

    await setupMessageDb();
    await sleep(1000);

    await setupPrivateMessageDb();
    await sleep(1000);

    await setupFriendsDb();
  } catch (error) {
    console.log(error);
  }
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
