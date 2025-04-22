import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { branche } from "./branche"

@Entity()
export class sellers {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=>branche , branche => branche.sellers)
    @JoinColumn()
    branch : branche

    @Column({type : 'varchar'})
    firstName:string;

    @Column({type : 'varchar'})
    lastName : string;

    @Column({type : 'varchar'})
    phoneNumber : string;

    @Column({type : 'varchar'})
    nationalCode : string;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}
