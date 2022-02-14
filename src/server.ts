import { app, httpServer } from "./app";

import { connectionDB } from "./database/database"

connectionDB();

httpServer.listen(app.get("port"), () => {
    console.log("running on port: ", app.get("port"));

})