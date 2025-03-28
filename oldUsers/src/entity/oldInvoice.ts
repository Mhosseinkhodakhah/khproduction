import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"
import { InvoiceType } from "./InvoiceType"

@Entity()
export class oldInvoice {
    @PrimaryGeneratedColumn()
    id : number

    @ManyToOne(()=> User , (user)=> user.sells)
    seller : User

    @ManyToOne(()=> User , (user)=> user.buys)
    buyer : User
    
    @Column({type : 'varchar'})
    invoiceNumber : string;

    
    @Column({ type: "numeric", precision: 10, scale: 1,default : 0 })
    goldPrice : number

    @Column({ type: "numeric", precision: 10, scale: 3, default: 0 })
    goldWeight : number

    @Column({ type: "numeric", precision: 10, scale: 1,default : 0 })
    totalPrice : number

    @Column({type : 'int', default : 0})
    state : number;                                                  // 0:created      // 1 : submited
 
    @Column({nullable : true})
    status : string; 

    @Column()
    date : string;

    @Column()
    time : string;

    @ManyToOne(()=> InvoiceType , (invoiceType)=> invoiceType.invoices)
    type : InvoiceType

    @CreateDateColumn()
    createdAt : Date
}