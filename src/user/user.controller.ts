import { Router } from "express";
const router = Router();

import { verifyToken } from "../middleware/verifyToken"

import { userService } from "./user.service"

const { createUser, requestFriendship, request, accept, login, getUser, getUsers, userFriends } = userService;

router.get("/get/:id", getUser)

router.get("/get", verifyToken, getUsers)

// singup
router.post("/", createUser)

router.post("/login", login)

// we are going to use jwt to get our id
router.get("/requestFriend/:id", verifyToken, requestFriendship)

// id del token
router.get("/request", verifyToken, request)

// id del token, and requesterId in params
router.post("/accept/:requesterId", verifyToken, accept)

router.get("/testMW", verifyToken, (req: any, res) => {
    console.log(req.user);
    res.json("it works")
})

router.get("/myfriends", verifyToken, userFriends)



export default router;