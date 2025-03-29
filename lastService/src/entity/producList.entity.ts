import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import { InvoiceType } from "./InvoiceType"
import {TradeType} from "./enums/TradeType"
import { convertTradeInvoice } from "./inpersonConvertTrade.entity"

@Entity()
export class productList {
    @PrimaryGeneratedColumn()
    id : number
 
    @Column({ type: "numeric", precision: 10, scale: 0,default : 0 })
    totalPrice : number

    @Column({type : 'varchar' , nullable : true})
    category : string

    @Column({type : 'varchar' , nullable : true})
    title : string

    @Column({type : 'int' , nullable : true})
    num : number;

    @Column({type : 'numeric' , nullable : true})
    weight : string

    @Column({type : 'numeric' , nullable : true})
    wage : number


    // @Column({nullable : true})
    // status : string 
    
    @Column()
    date : string

    @Column()
    time : string

    // @ManyToOne(()=> InvoiceType , (invoiceType)=> invoiceType.invoices)
    // type : InvoiceType
    
    // @Column({nullable:true,default:null})
    // paymentMethod :  number           //0 : gateway   1 :transport   2 :inperson   3 : cash   4 : phisicalGold         


    @ManyToOne(()=>convertTradeInvoice , (ConvertTradeInvoice)=>ConvertTradeInvoice.productList)
    invoice : convertTradeInvoice

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt : Date
           
    @DeleteDateColumn()
    deletedAt : Date
}