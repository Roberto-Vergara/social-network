import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("friend")
export class Friend extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    requester_id: string  //this is the requester

    @Column()
    receiver_id: string; //this is the user who will decide accept or decline friendship request

    @Column()
    status: number;
}