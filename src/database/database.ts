import { createConnection } from "typeorm"

// entities
import { User } from "../user/user.entity";
import { Friend } from "../friend/friend.entity";

export const connectionDB = async () => {
    try {
        const connection = await createConnection({
            type: "mysql",
            host: process.env.HOST,
            port: 3306,
            username: process.env.USER_NAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            entities: [User, Friend],
            synchronize: true
        });
        console.log("database is connected");
    } catch (error) {
        console.log("error in connect database");
        console.log(error);

    }

}