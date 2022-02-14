import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";


@Entity("user")
export class User extends BaseEntity {
    @PrimaryColumn()
    id: string; //uuid

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column("simple-array")
    friends: string[]
}