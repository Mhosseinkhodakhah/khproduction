import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class transActionQeue{

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'int'})
    transActionId : number

    @Column({type : 'int'})
    state : number                         // 0 : in the queue   // 1 : done   // 2 : reject

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt : Date;

}



@Entity()
export class transPortQueue{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'int'})
    transPortId : number

    @Column({type : 'int' , default : 0})
    state : number                         // 0 : in the queue   // 1 : done   // 2 : reject

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt : Date;

}