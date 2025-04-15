import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

@Entity()
export class Otp {

    @PrimaryGeneratedColumn()
    id: string
    
    @Column()
    otp: string

    @Column()
    phoneNumber : string

    @Column({nullable : true , type : 'varchar'})
    time : string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt : Date
        
    @DeleteDateColumn()
    deletedAt : Date
}