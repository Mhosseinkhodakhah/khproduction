import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"



@Entity()
export class transportInvoice {
    @PrimaryGeneratedColumn()
    id : number

    @ManyToOne(()=> User , (user)=> user.sells)
    sender : User
   
    @ManyToOne(()=> User , (user)=> user.buys)
    reciever : User
    

    @Column({ type: "numeric", precision: 10, scale: 3, default: 0 })
    goldWeight : number

    @Column({nullable : true})
    invoiceId : string

    @Column({nullable : true})
    status : string                 // init     // pending      // completed     // failed

    @Column()
    date : string


    @Column()
    time : string


    @Column({type : 'varchar'})
    type : string;                           // transport
    
    @Column({nullable:true,default:false , type : 'bool'})
    otpApproved : boolean

    @Column({nullable:true , type : 'varchar'})
    otpCode : string

    @Column({nullable:true , type : 'varchar'})
    otptime : string

    @CreateDateColumn()
    createdAt: Date
   
    @UpdateDateColumn()
    updatedAt : Date
           
    @DeleteDateColumn()
    deletedAt : Date

}