import express, { json } from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import * as dotenv from "dotenv"
dotenv.config()

import { router } from "./routes/index.route"

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { "origin": "*" } })

app.set("port", process.env.PORT || 4321);
app.use(json())
app.use("/", router)



io.on("connection", (socket) => {
})


export {
    app,
    httpServer
};