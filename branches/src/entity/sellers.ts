import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { branche } from "./branche"
import { transAction } from "./transAction.entity";

@Entity()
export class sellers {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=>branche , branche => branche.sellers)
    @JoinColumn()
    branch : branche

    @Column({type : 'varchar' , nullable : true})
    firstName:string;

    @Column({type : 'varchar' , nullable : true})
    lastName : string;

    @Column({type : 'varchar' , nullable : true})
    phoneNumber : string;

    @Column({type : 'varchar' , nullable : true})
    nationalCode : string;


    @OneToMany(()=>transAction , (transAction) => transAction.seller)
    @JoinColumn()
    transActions : transAction[]


    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}
