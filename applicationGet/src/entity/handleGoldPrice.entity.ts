import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class handleGoldPrice{

    @PrimaryGeneratedColumn({type : 'int'})
    id : number

    @Column({type : 'bool' , default : false})
    active : boolean

    @Column({type : 'int' , default : 0})
    price : number

    @Column({type : 'varchar' , default : ''  , nullable : true})
    admin : string

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}