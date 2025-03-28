import { Entity, PrimaryGeneratedColumn, Column, OneToMany,OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn  } from "typeorm"
import { VerificationStatus } from "./enums/VerificationStatus"
// import { Invoice } from "./Invoice"
import { Wallet } from "./wallet";
// import { BankAccount } from "./BankAccount";
import { Remmitance } from "./Remmitance";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable : true})
    birthDate: string

    @Column()
    firstName: string

    @Column({nullable : true})
    lastName: string

    @Column()
    fullName: string

    @Column({nullable : true})
    age: number 

    @Column({nullable : true})
    fatherName : string

    @Column({nullable : true})
    email : string

    @Column({nullable : true})
    password : string

    @Column({
        type: "int",
        default: 0
    })    
    verificationStatus : number   // 0 : failed //1 : approved   // 2 : pending

    @Column({nullable : true})
    gender : boolean

    @Column({nullable : true})
    identityNumber : string

    @Column({nullable : true})
    identitySerial : string

    @Column({nullable : true})
    identitySeri : string

    @Column({nullable : true})
    officeName : string
    
    @Column({nullable : true})
    liveStatus : boolean
    
    @Column()
    verificationType : number        // 0:complete user   // 1: 

    @Column({type : 'int' , nullable : true})
    Code : number

    @Column({nullable : true})
    phoneNumber : string

    @Column({nullable : true})
    nationalCode : string
    
    @OneToMany(() => Remmitance , (remmitance)=> remmitance.seller, {nullable : true})
    sells : Remmitance[]
    
    @OneToMany(() => Remmitance , (remmitance)=> remmitance.buyer , {nullable : true})
    buys : Remmitance[]

    @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
    wallet: Wallet;

    @Column({ default: false })
    isSystemUser : boolean

    @Column({ default: false })
    isHaveBank : boolean

    @Column({nullable:true,default:''})
    identityTraceCode: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt : Date
        
    @DeleteDateColumn()
    deletedAt : Date
}

