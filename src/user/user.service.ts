import { Request, Response } from "express"
import { v4 } from "uuid"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { User } from "./user.entity";
import { Friend } from "../friend/friend.entity"
import { getConnection } from "typeorm";

class UserService {

    // get user from another user
    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user: any = await User.findOne(id)
            const { password, friends, ...rest } = user;
            return res.json({ user: rest })
        } catch (error) {
            return res.json(error)
        }
    }

    async getUsers(req: any, res: Response) {
        try {

            const findUser = await User.findOne(req.user.id)
            const users: any = await getConnection().createQueryBuilder(User, "user").select(["user.id", "user.name", "user.friends"]).getMany();
            const filterme = users.filter((us: any) => us.id !== req.user.id)
            let use: any = [];

            filterme.forEach((ele: any) => {

                if (!findUser.friends.includes(ele.id)) {
                    use.push(ele)
                }
            })

            res.json(use);
        } catch (error) {
            return res.json(error)
        }
    }

    // it works
    async createUser(req: Request, res: Response) {
        try {
            const data = req.body;
            if (data.name == data.password) {
                throw "no sea menso la contraseña debe ser diferente al nombre"
            }
            const uuid = v4();
            const hashPass = await bcrypt.hash(data.password, 8)
            const createdUser: any = User.create({ ...data, id: uuid, password: hashPass, friends: [] });
            if (!createdUser) {
                throw { ok: false, message: "error in create user", status: 400 }
            }
            await createdUser.save();

            res.status(201).json({ ok: true, message: "user created", status: 201 })
        } catch (error) {
            console.log(error);
            res.status(400).json({ ok: false, message: "error al crear usuario", status: 400 })
        }
    }

    // it works
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } })
            if (!user) {
                throw { ok: false, message: "user not found", status: 404 }
            }
            const compare = await bcrypt.compare(password, user.password);
            if (!compare) {
                throw { ok: false, message: "incorrect password", status: 401 }
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            const accessToken = jwt.sign(payload, "misecreto")
            return res.json({ accessToken, ok: true, message: "correcto inicio de sesion", id: user.id })
        } catch (error) {
            return res.json({ message: "some error", ok: false })

        }
    }

    // funciona
    async requestFriendship(req: any, res: Response) {
        try {
            const myid = req.user.id;
            const friendId = req.params.id;
            const findRequest = await Friend.findOne({ where: { requester_id: myid, receiver_id: friendId } });
            if (!findRequest) {
                // status 2 meaning pending pendiente no se
                const createRequest = Friend.create({ requester_id: myid, receiver_id: friendId, status: 2 })
                if (!createRequest) {
                    throw "error al crear usuario"
                }
                await createRequest.save();
                res.json({ error: null, message: "la peticion fue hecha" })
            }
            if (findRequest?.status === 2) return res.json({ error: null, message: "ya has enviado la solicitud a este usuario" })

        } catch (error) {
            console.log(error);
            res.json({ error, message: "something goes wrong" })
        }
    }

    // ver peticiones de amistad pendientes, funciona
    async request(req: any, res: Response) {
        try {
            let myid = req.user.id;
            const getRequest = await Friend.find({ where: { receiver_id: myid, status: 2 } })
            res.json({ error: null, request: getRequest });
        } catch (error) {
            res.json({ error, message: "something goes wrong" });
        }
    }

    async accept(req: any, res: Response) {

        const { option } = req.body;
        let myid = req.user.id;
        const friendId = req.params.requesterId;
        if (option === "aceptar") {
            const request: any = await Friend.findOne({ where: { requester_id: friendId, receiver_id: myid } })
            // console.log(request);

            const me: any = await User.findOne(myid);
            const friend: any = await User.findOne(friendId);
            request.status = 1;
            me.friends = [...me.friends, friend.id];
            friend.friends = [...friend.friends, me.id];


            await request.save();
            await me.save()
            await friend.save()

            res.json({ error: null, message: "aceptado" })

        } else if (option === "rechazar") {
            const request: any = await Friend.findOne({ where: { requester_id: friendId, receiver_id: myid } })

            try {
                await getConnection().createQueryBuilder().delete().from(Friend).where("id = :id", { id: request.id }).execute();

                return res.json({ error: null, message: "rechazado" })
            } catch (error) {

                return res.json({ error, message: "something goes wrong" })
            }

        }
    }

    async userFriends(req: any, res: Response) {
        try {
            const myid = req.user.id;
            const findUser = await User.findOne(myid)
            res.json(findUser.friends)
        } catch (error) {
            res.json({ message: "some error", error })
        }
    }


}

export const userService = new UserService();