import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import { InvoiceType } from "./InvoiceType"
import {TradeType} from "./enums/TradeType"
import { productList } from "./producList.entity"

@Entity()
export class convertTradeInvoice {
    @PrimaryGeneratedColumn()
    id : number

    @ManyToOne(()=> User , (user)=> user.sells)
    seller : User
    
    @ManyToOne(()=> User , (user)=> user.buys)
    buyer : User
    
    @Column({ type: "numeric", precision: 10, scale: 0,default : 0 })
    goldPrice : number

    @Column({ type: "numeric", precision: 10, scale: 3, default: 0 })
    goldWeight : number

    @Column({ type: "numeric", precision: 10, scale: 0,default : 0 })
    totalInvoicePrice : number

    @Column({nullable : true})
    authority : string

    @Column({nullable : true})
    invoiceId : string

    @Column({type : 'int' , nullable : true })
    paymentMethod : number                      


    @Column({type : 'int' , nullable : true })
    paymentType : number                       // 0 : cash     1 : cash va sandoogh     2 : sandoogh

    

    @Column({nullable : true})
    status : string 
    
    @Column()
    date : string

    @Column()
    time : string

    @OneToMany(()=> productList , (ProductList)=> ProductList.invoice)
    productList : productList
    
    @Column({nullable:true,default:false , type : 'bool'})
    fromPhone : boolean

    @Column({type : 'bool' , default : false , nullable : true})
    inPerson : boolean

    @Column({type : 'bool' , default : false , nullable : true})
    fromGateway : boolean

    @Column({nullable:true,default:""})
    adminId:string

    @Column({nullable:true,default:""})
    accounterId:string

    @Column({  default: "", type: "varchar" })
    originCardPan: string
    
    @Column({  default: "", type: "varchar" })
    destCardPan: string
    
    @Column({nullable:true,default:"",type:"varchar"})
    description:string
    
    @Column({nullable:true,default:"",type:"varchar"})
    accounterDescription:string
    @Column({
          type: "enum",
          enum: TradeType,
          default: TradeType.ONLINE
    })
    tradeType:TradeType;

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt : Date
           
    @DeleteDateColumn()
    deletedAt : Date
}