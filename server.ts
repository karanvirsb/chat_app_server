const PORT = 8000;
import app from "./app";

import setUpGroupDb from "./src/Features/group/db";

app.listen(PORT, () => {
    console.log("listening on port", PORT);
    setUpGroupDb();
});
