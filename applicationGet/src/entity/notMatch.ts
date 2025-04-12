import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class NotMatch{
    @PrimaryGeneratedColumn()
    id : number;


    @Column({type : 'varchar'})
    firstName : string;


    @Column({type : 'varchar'})
    lastName : string;

    @Column({type : 'varchar'})
    phoneNumber : string;

    @Column({type : 'varchar'})
    nationalCode : string;
}