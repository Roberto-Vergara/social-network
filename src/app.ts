import express, { json } from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import * as dotenv from "dotenv"
dotenv.config()


import { router } from "./routes/index.route"

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { "origin": "*" } })

app.set("port", process.env.PORT || 4321);
app.use(cors({ origin: "*" }))
app.use(json())
app.use("/", router)



io.on("connection", (socket) => {
    socket.on("message", (data) => {
        socket.to(data.to).emit("message", { msg: data.message, emitter: data.emitter })
    })

    socket.on("join", (data) => {
        socket.join(data)
    })
})


export {
    app,
    httpServer
};