import { Entity, PrimaryGeneratedColumn, Column, OneToMany,OneToOne, UpdateDateColumn, DeleteDateColumn, CreateDateColumn, PrimaryColumn  } from "typeorm"
import { VerificationStatus } from "./enums/VerificationStatus"
import { Invoice } from "./Invoice"
import { Wallet } from "./Wallet";
import { BankAccount } from "./BankAccount";
import { convertTradeInvoice } from "./inpersonConvertTrade.entity";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type : 'varchar',  nullable : true})
    Referral : string;
    
    @Column({nullable : true})
    birthDate: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({nullable : true})
    age: number 

    @Column({nullable : true})
    fatherName : string

    @Column({nullable : true})
    email : string

    @Column({nullable : true})
    password : string

    @Column({
        type: "enum",
        enum: VerificationStatus,
        default: VerificationStatus.FAILED
    })    
    verificationStatus : VerificationStatus

    @Column({nullable : true})
    gender : boolean

    @Column({ type: "varchar", nullable: true })
    date: string

    @Column({ type: "varchar", nullable: true })
    time: string
    
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
    
    @Column({type : 'bool' , default : false})
    oldUserCheck : boolean

    @Column()
    phoneNumber : string

    @Column({nullable : true})
    nationalCode : string
    
    @OneToMany(() => Invoice , (invoice)=> invoice.seller, {nullable : true})
    sells : Invoice[]
    
    @OneToMany(() => Invoice , (invoice)=> invoice.buyer , {nullable : true})
    buys : Invoice[]

    @OneToMany(() => convertTradeInvoice , (invoice)=> invoice.seller, {nullable : true})
    convertSells : convertTradeInvoice[]
    
    @OneToMany(() => convertTradeInvoice , (invoice)=> invoice.buyer , {nullable : true})
    convertBuys : convertTradeInvoice[]

    @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
    wallet: Wallet;
    
    @OneToMany(() => BankAccount , (bankAccount)=> bankAccount.owner , {nullable : true,cascade: true})
    bankAccounts : BankAccount[]

    @Column({nullable : true , default : '' , type : 'varchar'})
    identityTraceCode : string;

    @Column({ default: false })
    isSystemUser : boolean

    @Column({ default: false })
    isHaveBank : boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt : Date
        
    @DeleteDateColumn()
    deletedAt : Date
    
    
}

