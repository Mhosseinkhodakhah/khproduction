import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { transAction } from "./transAction.entity";


@Entity()
export class user {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    birthDate: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ nullable: true })
    age: number
    
    @Column({ nullable: true })
    fatherName: string
        
    @Column()
    phoneNumber: string

    @Column({ nullable: true })
    nationalCode: string

    @OneToMany(()=>transAction , (TransAction) => TransAction.user)
    @JoinColumn()
    transActions : transAction[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt : Date
        
    @DeleteDateColumn()
    deletedAt : Date

}