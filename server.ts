const PORT = 8000;
import app from "./app";
import setupChannelDb from "./src/Features/channel/db";

import setUpGroupDb from "./src/Features/group/db";
import setupMessageDb from "./src/Features/message/db";

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
    setUpGroupDb();
    setupChannelDb();
    setupMessageDb();
});
