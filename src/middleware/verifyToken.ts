import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../user/user.entity";

// funciona bien
export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers["authorization"]?.split(" ")[1];

        if (!accessToken) {
            throw "requiere tpken"
        }
        const result: any = jwt.verify(accessToken, "misecreto")
        if (!result) {
            throw "some error"
        }
        const id = result.id;
        if (!id || !result.email) {
            throw "este token no tiene id o email, es falso"
        }
        const findUser = await User.findOne(id);
        if (!findUser) {
            throw "usuario inexistnte"
        }
        if (findUser.email !== result.email) {
            throw "otra discordia"
        }
        req.user = result;
        return next();

    } catch (error) {
        return res.json({ ok: false, message: "algo salio malito", error })
    }
}