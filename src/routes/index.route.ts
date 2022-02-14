import { Router } from "express";
const router = Router();

// controller de rutas
import userRouter from "../user/user.controller";

router.use("/user", userRouter)


export { router };